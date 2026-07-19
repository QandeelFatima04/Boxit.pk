import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";
import {
  InstagramIcon,
  FacebookIcon,
  LinkedinIcon,
} from "@/components/social-icons";
import { Logo } from "@/components/logo";
import { footerNav } from "@/lib/nav";
import { site, telLink } from "@/lib/site";

function Column({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      <ul className="mt-3 space-y-2">
        {links.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              className="text-sm text-muted-foreground transition hover:text-brand"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-12 border-t bg-cream">
      <div className="container-page grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-6">
        <div className="lg:col-span-2">
          <Logo />
          <p className="mt-4 max-w-xs text-sm text-muted-foreground">
            {site.description}
          </p>
          <div className="mt-5 space-y-2 text-sm text-muted-foreground">
            <a href={telLink()} className="flex items-center gap-2 hover:text-brand">
              <Phone className="h-4 w-4" /> {site.phoneDisplay}
            </a>
            <a
              href={`mailto:${site.email}`}
              className="flex items-center gap-2 hover:text-brand"
            >
              <Mail className="h-4 w-4" /> {site.email}
            </a>
            <p className="flex items-center gap-2">
              <MapPin className="h-4 w-4" /> {site.address}
            </p>
          </div>
          <div className="mt-5 flex gap-3">
            <a
              href={site.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="grid h-9 w-9 place-items-center rounded-full border hover:bg-muted"
            >
              <InstagramIcon className="h-4 w-4" />
            </a>
            <a
              href={site.social.facebook}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="grid h-9 w-9 place-items-center rounded-full border hover:bg-muted"
            >
              <FacebookIcon className="h-4 w-4" />
            </a>
            <a
              href={site.social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="grid h-9 w-9 place-items-center rounded-full border hover:bg-muted"
            >
              <LinkedinIcon className="h-4 w-4" />
            </a>
          </div>
        </div>

        <Column title="Solutions" links={footerNav.solutions} />
        <Column title="Explore" links={footerNav.explore} />
        <Column title="Company" links={footerNav.company} />
        <Column title="Legal" links={footerNav.legal} />
      </div>

      <div className="border-t">
        <div className="container-page flex flex-col items-center justify-between gap-2 py-5 text-xs text-muted-foreground sm:flex-row">
          <p>
            © {new Date().getFullYear()} {site.legalName}. Pakistan&apos;s first
            plantable seed-paper maker.
          </p>
          <p>Tree-free paper · Made in {site.city}</p>
        </div>
      </div>
    </footer>
  );
}
