import Link from "next/link";
import type { ReactNode } from "react";

/**
 * Minimal renderer for the markdown-ish subset used in content/blog.ts:
 * `##`/`###` headings, `-` and `1.` lists, pipe tables, `**bold**`, `*italic*`
 * and `[text](/href)` links. Deliberately not a full markdown parser — it only
 * needs to cover what editors actually write, without pulling in a dependency.
 */

const INLINE = /(\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)]+\))/g;

function inline(text: string, keyPrefix: string): ReactNode[] {
  return text.split(INLINE).map((part, i) => {
    const key = `${keyPrefix}-${i}`;

    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={key} className="font-semibold text-foreground">
          {part.slice(2, -2)}
        </strong>
      );
    }

    if (part.startsWith("*") && part.endsWith("*")) {
      return <em key={key}>{part.slice(1, -1)}</em>;
    }

    const link = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(part);
    if (link) {
      const [, label, href] = link;
      const className = "font-medium text-brand underline underline-offset-4 hover:no-underline";
      // Off-site links (WhatsApp, socials) need a plain anchor.
      return href.startsWith("/") ? (
        <Link key={key} href={href} className={className}>
          {label}
        </Link>
      ) : (
        <a
          key={key}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={className}
        >
          {label}
        </a>
      );
    }

    return part;
  });
}

/** Splits a `| a | b |` row into its cells. */
const cells = (row: string) =>
  row
    .trim()
    .replace(/^\||\|$/g, "")
    .split("|")
    .map((c) => c.trim());

const isTableDivider = (line: string) => /^\|[\s|:-]+\|$/.test(line.trim());

function Table({ rows, keyPrefix }: { rows: string[]; keyPrefix: string }) {
  const [header, ...body] = rows.filter((r) => !isTableDivider(r));
  return (
    // Narrow screens scroll the table rather than the page.
    <div className="my-8 overflow-x-auto rounded-2xl border">
      <table className="w-full border-collapse text-left text-sm">
        <thead className="bg-secondary/50">
          <tr>
            {cells(header).map((cell, i) => (
              <th
                key={i}
                className="px-4 py-3 font-semibold text-foreground whitespace-nowrap"
              >
                {inline(cell, `${keyPrefix}-th-${i}`)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {body.map((row, r) => (
            <tr key={r} className="border-t">
              {cells(row).map((cell, c) => (
                <td key={c} className="px-4 py-3 align-top">
                  {inline(cell, `${keyPrefix}-td-${r}-${c}`)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function PostBody({ body }: { body: string }) {
  const lines = body.split("\n");
  const blocks: ReactNode[] = [];

  // Consecutive lines of the same kind (list items, table rows, wrapped
  // paragraph text) are gathered into one block before being rendered.
  let buffer: string[] = [];
  let mode: "p" | "ul" | "ol" | "table" | null = null;

  const flush = () => {
    if (!buffer.length || !mode) return;
    const key = `block-${blocks.length}`;
    const items = buffer;

    if (mode === "table") {
      blocks.push(<Table key={key} rows={items} keyPrefix={key} />);
    } else if (mode === "ul" || mode === "ol") {
      const List = mode === "ul" ? "ul" : "ol";
      blocks.push(
        <List
          key={key}
          className={`my-6 space-y-2 pl-6 ${
            mode === "ul" ? "list-disc" : "list-decimal"
          } marker:text-brand`}
        >
          {items.map((item, i) => (
            <li key={i} className="pl-1">
              {inline(item, `${key}-li-${i}`)}
            </li>
          ))}
        </List>,
      );
    } else {
      blocks.push(
        <p key={key} className="my-5">
          {inline(items.join(" "), key)}
        </p>,
      );
    }

    buffer = [];
    mode = null;
  };

  for (const line of lines) {
    const trimmed = line.trim();

    if (!trimmed) {
      flush();
      continue;
    }

    const heading = /^(#{2,3})\s+(.*)$/.exec(trimmed);
    if (heading) {
      flush();
      const [, hashes, text] = heading;
      const key = `block-${blocks.length}`;
      blocks.push(
        hashes.length === 2 ? (
          <h2
            key={key}
            className="mt-12 mb-4 font-[family-name:var(--font-heading)] text-2xl font-bold text-foreground sm:text-3xl"
          >
            {inline(text, key)}
          </h2>
        ) : (
          <h3
            key={key}
            className="mt-8 mb-3 font-[family-name:var(--font-heading)] text-xl font-bold text-foreground"
          >
            {inline(text, key)}
          </h3>
        ),
      );
      continue;
    }

    if (trimmed.startsWith("|")) {
      if (mode !== "table") flush();
      mode = "table";
      buffer.push(trimmed);
      continue;
    }

    const bullet = /^[-*]\s+(.*)$/.exec(trimmed);
    if (bullet) {
      if (mode !== "ul") flush();
      mode = "ul";
      buffer.push(bullet[1]);
      continue;
    }

    const numbered = /^\d+\.\s+(.*)$/.exec(trimmed);
    if (numbered) {
      if (mode !== "ol") flush();
      mode = "ol";
      buffer.push(numbered[1]);
      continue;
    }

    if (mode !== "p") flush();
    mode = "p";
    buffer.push(trimmed);
  }

  flush();

  return (
    <div className="text-lg leading-relaxed text-muted-foreground">
      {blocks}
    </div>
  );
}
