import Image from "next/image";
import { partners, type Partner } from "@/content/partners";
import { cn } from "@/lib/utils";

// One auto-scrolling row. The list is duplicated so the -50% translate loops
// seamlessly; hovering the row pauses it.
function MarqueeRow({
  items,
  reverse = false,
}: {
  items: Partner[];
  reverse?: boolean;
}) {
  const track = [...items, ...items];
  return (
    <ul
      className={cn(
        "flex w-max items-center gap-6 sm:gap-8",
        reverse ? "animate-marquee-reverse" : "animate-marquee",
        "hover:[animation-play-state:paused]",
      )}
    >
      {track.map((p, i) => (
        <li
          key={`${p.slug}-${i}`}
          className="flex h-14 w-36 shrink-0 items-center justify-center sm:h-[76px] sm:w-44"
          title={p.name}
        >
          <Image
            src={`/images/partners/${p.slug}.png`}
            alt={`${p.name} logo`}
            width={220}
            height={120}
            aria-hidden={i >= items.length}
            className="h-auto max-h-full w-auto max-w-full object-contain opacity-80 transition-opacity duration-300 hover:opacity-100"
            sizes="180px"
          />
        </li>
      ))}
    </ul>
  );
}

export function LogoMarquee() {
  const mid = Math.ceil(partners.length / 2);
  const rowA = partners.slice(0, mid);
  const rowB = partners.slice(mid);
  return (
    <div
      className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]"
      style={{ WebkitMaskImage: "linear-gradient(to right,transparent,black 6%,black 94%,transparent)" }}
    >
      <div className="flex flex-col gap-7 sm:gap-9">
        <MarqueeRow items={rowA} />
        <MarqueeRow items={rowB} reverse />
      </div>
    </div>
  );
}
