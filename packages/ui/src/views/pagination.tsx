import * as React from 'react';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '../components/ui/pagination';

export function PaginationView() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold text-foreground">Pagination</h1>
      <Pagination>
      <PaginationContent>
        <PaginationItem><PaginationPrevious /></PaginationItem>
        <PaginationItem><PaginationLink isActive>1</PaginationLink></PaginationItem>
        <PaginationItem><PaginationLink>2</PaginationLink></PaginationItem>
        <PaginationItem><PaginationNext /></PaginationItem>
      </PaginationContent>
    </Pagination>
    </div>
  );
}
