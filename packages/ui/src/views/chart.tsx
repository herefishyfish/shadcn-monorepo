import * as React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';

export function ChartView() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold text-foreground">Chart</h1>
      <Table>
      <TableHeader>
        <TableRow><TableHead>Month</TableHead><TableHead>Desktop</TableHead><TableHead>Mobile</TableHead></TableRow>
      </TableHeader>
      <TableBody>
        <TableRow><TableCell>Jan</TableCell><TableCell>186</TableCell><TableCell>80</TableCell></TableRow>
        <TableRow><TableCell>Feb</TableCell><TableCell>305</TableCell><TableCell>200</TableCell></TableRow>
        <TableRow><TableCell>Mar</TableCell><TableCell>237</TableCell><TableCell>120</TableCell></TableRow>
      </TableBody>
    </Table>
    </div>
  );
}
