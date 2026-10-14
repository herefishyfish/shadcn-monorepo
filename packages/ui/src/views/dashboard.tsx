import { useState } from 'react';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Item, ItemActions, ItemContent, ItemDescription, ItemGroup, ItemMedia, ItemTitle } from '../components/ui/item';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '../components/ui/pagination';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';

const stats = [
  { label: 'Total revenue', value: '$45,231.89', change: '+20.1% from last month' },
  { label: 'Subscriptions', value: '+2,350', change: '+180.1% from last month' },
  { label: 'Sales', value: '+12,234', change: '+19% from last month' },
  { label: 'Active now', value: '+573', change: '+201 since last hour' },
];

const sales = [
  { name: 'Olivia Martin', email: 'olivia.martin@email.com', amount: '+$1,999.00', initials: 'OM' },
  { name: 'Jackson Lee', email: 'jackson.lee@email.com', amount: '+$39.00', initials: 'JL' },
  { name: 'Isabella Nguyen', email: 'isabella.nguyen@email.com', amount: '+$299.00', initials: 'IN' },
  { name: 'William Kim', email: 'will@email.com', amount: '+$99.00', initials: 'WK' },
  { name: 'Sofia Davis', email: 'sofia.davis@email.com', amount: '+$39.00', initials: 'SD' },
];

const statuses = ['Paid', 'Pending', 'Unpaid', 'Refunded'] as const;
const orders = Array.from({ length: 20 }, (_, i) => ({
  id: `INV${String(i + 1).padStart(3, '0')}`,
  customer: sales[i % sales.length].name,
  status: statuses[i % statuses.length],
  amount: `$${(((i * 37) % 450) + 50).toFixed(2)}`,
}));

const visitors = [
  { month: 'Jan', desktop: 186, mobile: 80 },
  { month: 'Feb', desktop: 305, mobile: 200 },
  { month: 'Mar', desktop: 237, mobile: 120 },
  { month: 'Apr', desktop: 73, mobile: 190 },
  { month: 'May', desktop: 209, mobile: 130 },
  { month: 'Jun', desktop: 214, mobile: 140 },
];

const revenue = [
  { month: 'Jan', revenue: 18200 },
  { month: 'Feb', revenue: 21400 },
  { month: 'Mar', revenue: 19800 },
  { month: 'Apr', revenue: 26100 },
  { month: 'May', revenue: 31900 },
  { month: 'Jun', revenue: 45231 },
];

const statusVariant = {
  Paid: 'default',
  Pending: 'secondary',
  Unpaid: 'destructive',
  Refunded: 'outline',
} as const;

const PAGE_SIZE = 5;

function Orders() {
  const [page, setPage] = useState(1);
  const pageCount = Math.ceil(orders.length / PAGE_SIZE);
  const rows = orders.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Orders</CardTitle>
        <CardDescription>Recent orders from your store.</CardDescription>
      </CardHeader>
      <CardContent className="gap-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.id}</TableCell>
                <TableCell>{order.customer}</TableCell>
                <div className="flex flex-1 flex-row p-2">
                  <Badge variant={statusVariant[order.status]}>{order.status}</Badge>
                </div>
                <TableCell className="text-right">{order.amount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious onClick={() => setPage(Math.max(1, page - 1))} />
            </PaginationItem>
            {Array.from({ length: pageCount }, (_, i) => i + 1).map((n) => (
              <PaginationItem key={n}>
                <PaginationLink isActive={n === page} onClick={() => setPage(n)}>
                  {n}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext onClick={() => setPage(Math.min(pageCount, page + 1))} />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </CardContent>
    </Card>
  );
}

function NumberTable({
  rows,
  columns,
}: {
  rows: Record<string, string | number>[];
  columns: { key: string; label: string }[];
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {columns.map((column) => (
            <TableHead key={column.key}>{column.label}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row) => (
          <TableRow key={String(row.month)}>
            {columns.map((column) => (
              <TableCell key={column.key}>{row[column.key]}</TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

// ponytail: flex bars, so web and NativeScript share one chart. The chart page still draws the SVG one.
function Bars({
  rows,
  series,
}: {
  rows: { month: string; [key: string]: string | number }[];
  series: { key: string; label: string; color: string }[];
}) {
  const max = Math.max(1, ...rows.flatMap((row) => series.map((item) => Number(row[item.key]) || 0)));
  return (
    <div className="flex flex-col gap-2">
      <div className="flex h-40 flex-row items-stretch gap-2">
        {rows.map((row) => (
          <div key={row.month} className="flex flex-1 flex-row items-stretch justify-center gap-1">
            {series.map((item) => {
              const value = Number(row[item.key]) || 0;
              return (
                <div key={item.key} className="flex w-3 flex-col">
                  <div style={{ flexGrow: max - value }} />
                  <div className={`w-full rounded-t-sm ${item.color}`} style={{ flexGrow: value }} />
                </div>
              );
            })}
          </div>
        ))}
      </div>
      <div className="flex flex-row gap-2">
        {rows.map((row) => (
          <span key={row.month} className="flex-1 text-center text-xs text-muted-foreground">
            {row.month}
          </span>
        ))}
      </div>
      {series.length > 1 ? (
        <div className="flex flex-row items-center justify-center gap-4">
          {series.map((item) => (
            <div key={item.key} className="flex flex-row items-center gap-1.5">
              <div className={`size-2.5 rounded-[2] ${item.color}`} />
              <span className="text-xs text-muted-foreground">{item.label}</span>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function DashboardView() {
  return (
    <>
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-foreground">Welcome back, NativeScript!</h1>
        <p className="text-sm text-muted-foreground">Here's what's happening with your store today.</p>
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="gap-6 pt-2">
          <div className="grid grid-cols-[repeat(auto-fill,minmax(220,1fr))] gap-4">
            {stats.map((stat) => (
              <Card key={stat.label} className="gap-2">
                <CardHeader>
                  <CardDescription>{stat.label}</CardDescription>
                  <span className="text-2xl font-bold text-card-foreground">{stat.value}</span>
                </CardHeader>
                <CardContent>
                  <span className="text-xs text-muted-foreground">{stat.change}</span>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-[repeat(auto-fill,minmax(320,1fr))] gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Visitors</CardTitle>
                <CardDescription>January – June 2026</CardDescription>
              </CardHeader>
              <CardContent className="gap-3">
                <Bars
                  rows={visitors}
                  series={[
                    { key: 'desktop', label: 'Desktop', color: 'bg-chart-1' },
                    { key: 'mobile', label: 'Mobile', color: 'bg-chart-2' },
                  ]}
                />
                <NumberTable
                  rows={visitors}
                  columns={[
                    { key: 'month', label: 'Month' },
                    { key: 'desktop', label: 'Desktop' },
                    { key: 'mobile', label: 'Mobile' },
                  ]}
                />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Revenue</CardTitle>
                <CardDescription>Up 41.8% on May</CardDescription>
              </CardHeader>
              <CardContent className="gap-3">
                <Bars rows={revenue} series={[{ key: 'revenue', label: 'Revenue', color: 'bg-chart-1' }]} />
                <NumberTable
                  rows={revenue}
                  columns={[
                    { key: 'month', label: 'Month' },
                    { key: 'revenue', label: 'Revenue' },
                  ]}
                />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent sales</CardTitle>
              <CardDescription>You made 265 sales this month.</CardDescription>
            </CardHeader>
            <CardContent>
              <ItemGroup>
                {sales.map((sale) => (
                  <Item key={sale.email} size="sm" className="px-0">
                    <ItemMedia>
                      <Avatar className="size-9">
                        <AvatarFallback>{sale.initials}</AvatarFallback>
                      </Avatar>
                    </ItemMedia>
                    <ItemContent>
                      <ItemTitle>{sale.name}</ItemTitle>
                      <ItemDescription>{sale.email}</ItemDescription>
                    </ItemContent>
                    <ItemActions>
                      <span className="text-sm font-medium text-foreground">{sale.amount}</span>
                    </ItemActions>
                  </Item>
                ))}
              </ItemGroup>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders" className="pt-2">
          <Orders />
        </TabsContent>
      </Tabs>
    </>
  );
}
