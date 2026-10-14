import * as React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../components/ui/accordion';

export function AccordionView() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold text-foreground">Accordion</h1>
      <Accordion defaultValue="one">
      <AccordionItem value="one">
        <AccordionTrigger>Shipping</AccordionTrigger>
        <AccordionContent>Delivered in 3–5 days.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="two">
        <AccordionTrigger>Returns</AccordionTrigger>
        <AccordionContent>Free returns within 30 days.</AccordionContent>
      </AccordionItem>
    </Accordion>
    </div>
  );
}
