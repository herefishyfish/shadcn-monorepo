import * as React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';

export function TableView() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold text-foreground">Table</h1>
      <Table>
      <TableHeader>
        <TableRow><TableHead>Invoice</TableHead><TableHead className="text-right">Amount</TableHead></TableRow>
      </TableHeader>
      <TableBody>
        <TableRow><TableCell>INV001</TableCell><TableCell className="text-right">$250.00</TableCell></TableRow>
        <TableRow><TableCell>INV002</TableCell><TableCell className="text-right">$150.00</TableCell></TableRow>
      </TableBody>
    </Table>
    </div>
  );
}
