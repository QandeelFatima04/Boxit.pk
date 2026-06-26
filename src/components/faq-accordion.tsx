import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { Faq } from "@/content/types";

export function FaqAccordion({ items }: { items: Faq[] }) {
  return (
    <Accordion className="divide-y rounded-2xl border bg-card">
      {items.map((faq, i) => (
        <AccordionItem key={i} value={`faq-${i}`} className="px-5">
          <AccordionTrigger className="text-left text-base font-semibold">
            {faq.question}
          </AccordionTrigger>
          <AccordionContent className="text-muted-foreground">
            {faq.answer}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
