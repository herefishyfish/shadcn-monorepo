import { useState } from 'react';
import { Device } from '@nativescript/core';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Kbd, KbdGroup } from '@/components/ui/kbd';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Slider } from '@/components/ui/slider';
import { toast } from '@/components/ui/sonner';
import { Spinner } from '@/components/ui/spinner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Toggle } from '@/components/ui/toggle';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { ButtonGroup } from '@/components/ui/button-group';
import { Calendar } from '@/components/ui/calendar';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from '@/components/ui/command';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { Field, FieldDescription, FieldLabel } from '@/components/ui/field';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
} from '@/components/ui/input-group';
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from '@/components/ui/input-otp';
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { ChartContainer, ChartLegend, LineChart, type ChartConfig } from '@/components/ui/chart';

const settings = [
  { label: 'Notifications', body: 'Get notified about new activity.', on: true },
  { label: 'Marketing emails', body: 'Product news and offers.', on: false },
  { label: 'Security alerts', body: 'Sign-ins from new devices.', on: true },
];

const team = [
  { name: 'Ada Lovelace', role: 'Owner', initials: 'AL', src: 'https://i.pravatar.cc/96?img=47' },
  { name: 'Alan Turing', role: 'Editor', initials: 'AT', src: '' },
  { name: 'Grace Hopper', role: 'Viewer', initials: 'GH', src: 'https://i.pravatar.cc/96?img=32' },
];

function ButtonsCard() {
  const [taps, setTaps] = useState(0);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Button</CardTitle>
        <CardDescription>Six variants and four sizes.</CardDescription>
      </CardHeader>
      <CardContent className="gap-4">
        <div className="flex flex-row flex-wrap gap-2">
          <Button onClick={() => setTaps(taps + 1)}>{taps ? `Tapped ${taps}×` : 'Default'}</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="link">Link</Button>
        </div>
        <div className="flex flex-row flex-wrap items-center gap-2">
          <Button size="sm">Small</Button>
          <Button size="lg">Large</Button>
          <Button size="icon" variant="outline">+</Button>
          <Button disabled>Disabled</Button>
        </div>
      </CardContent>
    </Card>
  );
}

function FormCard() {
  const [email, setEmail] = useState('');
  const [terms, setTerms] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
        <CardDescription>Input, Textarea, Label and Checkbox.</CardDescription>
      </CardHeader>
      <CardContent className="gap-4">
        <div className="flex flex-col gap-2">
          <Label>Email</Label>
          <Input
            type="email"
            placeholder="you@example.com"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label>Bio</Label>
          <Textarea placeholder="Tell us a little about yourself" />
        </div>
        <div className="flex flex-row items-center gap-2">
          <Checkbox id="terms" checked={terms} onCheckedChange={setTerms} />
          <Label htmlFor="terms">Accept terms and conditions</Label>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          className="flex-1"
          disabled={!terms || !email.includes('@')}
          onClick={() => setSubmitted(true)}
        >
          {submitted ? 'Account created ✓' : 'Create account'}
        </Button>
      </CardFooter>
    </Card>
  );
}

function SettingsCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Settings</CardTitle>
        <CardDescription>Switch and Separator.</CardDescription>
      </CardHeader>
      <CardContent className="gap-3">
        {settings.map((setting, index) => (
          <div key={setting.label} className="flex flex-col gap-3">
            {index > 0 && <Separator />}
            <div className="flex flex-row items-center gap-4">
              <div className="flex flex-1 flex-col gap-0.5">
                <Label>{setting.label}</Label>
                <span className="text-sm text-muted-foreground">{setting.body}</span>
              </div>
              <Switch defaultChecked={setting.on} />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function TabsCard() {
  const [tab, setTab] = useState('account');
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tabs</CardTitle>
        <CardDescription>Selected tab: {tab}</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="password">Password</TabsTrigger>
          </TabsList>
          <TabsContent value="account" className="gap-2 pt-2">
            <Label>Name</Label>
            <Input placeholder="Pedro Duarte" />
          </TabsContent>
          <TabsContent value="password" className="gap-2 pt-2">
            <Label>New password</Label>
            <Input type="password" placeholder="••••••••" />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

function TeamCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Team</CardTitle>
        <CardDescription>Avatar and Badge.</CardDescription>
      </CardHeader>
      <CardContent className="gap-4">
        {team.map((member) => (
          <div key={member.name} className="flex flex-row items-center gap-3">
            <Avatar className="size-10">
              <AvatarFallback>{member.initials}</AvatarFallback>
              {member.src && <AvatarImage src={member.src} />}
            </Avatar>
            <span className="flex-1 text-sm font-medium text-foreground">{member.name}</span>
            <Badge variant={member.role === 'Owner' ? 'default' : 'secondary'}>{member.role}</Badge>
          </div>
        ))}
        <div className="flex flex-row flex-wrap gap-2">
          <Badge>Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="destructive">Destructive</Badge>
          <Badge variant="outline">Outline</Badge>
        </div>
      </CardContent>
    </Card>
  );
}

function FeedbackCard() {
  const [progress, setProgress] = useState(40);
  const step = (by: number) => setProgress((p) => Math.min(100, Math.max(0, p + by)));
  return (
    <Card>
      <CardHeader>
        <CardTitle>Feedback</CardTitle>
        <CardDescription>Alert, Progress and Skeleton.</CardDescription>
      </CardHeader>
      <CardContent className="gap-4">
        <Alert>
          <AlertTitle>Heads up!</AlertTitle>
          <AlertDescription>Running on {Device.os}.</AlertDescription>
        </Alert>
        <Alert variant="destructive">
          <AlertTitle>Something went wrong</AlertTitle>
          <AlertDescription>Your session has expired.</AlertDescription>
        </Alert>
        <div className="flex flex-row items-center gap-3">
          <Button size="icon" variant="outline" onClick={() => step(-10)}>
            −
          </Button>
          <Progress value={progress} className="flex-1" />
          <Button size="icon" variant="outline" onClick={() => step(10)}>
            +
          </Button>
        </div>
        <div className="flex flex-row items-center gap-3">
          <Skeleton className="size-10 rounded-full" />
          <div className="flex flex-1 flex-col gap-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function OverlaysCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Overlays</CardTitle>
        <CardDescription>Dialog, Alert Dialog, Sheet and Sonner.</CardDescription>
      </CardHeader>
      <CardContent className="gap-2">
        <div className="flex flex-row flex-wrap gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Edit profile</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit profile</DialogTitle>
                <DialogDescription>Make changes to your profile here.</DialogDescription>
              </DialogHeader>
              <div className="flex flex-col gap-2">
                <Label>Name</Label>
                <Input placeholder="Pedro Duarte" />
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <DialogClose asChild>
                  <Button onClick={() => toast.success('Profile saved')}>Save changes</Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">Delete</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This permanently deletes your account and removes your data.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => toast.error('Account deleted')}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline">Open sheet</Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
                <SheetDescription>Narrow down the results.</SheetDescription>
              </SheetHeader>
              <div className="flex flex-col gap-3 px-4">
                <div className="flex flex-row items-center gap-2">
                  <Checkbox id="in-stock" defaultChecked />
                  <Label htmlFor="in-stock">In stock</Label>
                </div>
                <div className="flex flex-row items-center gap-2">
                  <Checkbox id="on-sale" />
                  <Label htmlFor="on-sale">On sale</Label>
                </div>
              </div>
              <SheetFooter>
                <Button onClick={() => toast('Filters applied')}>Apply</Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>

          <Button
            variant="secondary"
            onClick={() =>
              toast('Event has been created', {
                description: 'Sunday, December 3 at 9:00 AM',
                action: { label: 'Undo', onClick: () => toast('Undone') },
              })
            }
          >
            Show toast
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function MenusCard() {
  const [fruit, setFruit] = useState('');
  return (
    <Card>
      <CardHeader>
        <CardTitle>Menus</CardTitle>
        <CardDescription>Select, Dropdown Menu and Popover.</CardDescription>
      </CardHeader>
      <CardContent className="gap-3">
        <Select value={fruit} onValueChange={setFruit}>
          <SelectTrigger>
            <SelectValue placeholder="Select a fruit" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Fruits</SelectLabel>
              <SelectItem value="apple">Apple</SelectItem>
              <SelectItem value="banana">Banana</SelectItem>
              <SelectItem value="blueberry">Blueberry</SelectItem>
              <SelectItem value="grapes">Grapes</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <div className="flex flex-row flex-wrap gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">Open menu</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48">
              <DropdownMenuLabel>My account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={() => toast('Profile')}>
                Profile <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => toast('Settings')}>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive" onSelect={() => toast('Logged out')}>
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">Dimensions</Button>
            </PopoverTrigger>
            <PopoverContent>
              <span className="text-sm font-medium text-popover-foreground">Dimensions</span>
              <span className="text-sm text-muted-foreground">Set the dimensions for the layer.</span>
              <Input defaultValue="100%" />
            </PopoverContent>
          </Popover>
        </div>
      </CardContent>
    </Card>
  );
}

function ControlsCard() {
  const [volume, setVolume] = useState([50]);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Controls</CardTitle>
        <CardDescription>Toggle, Toggle Group, Radio Group and Slider.</CardDescription>
      </CardHeader>
      <CardContent className="gap-4">
        <div className="flex flex-row flex-wrap items-center gap-2">
          <Toggle variant="outline">B</Toggle>
          <Toggle variant="outline" defaultPressed>
            I
          </Toggle>
          <ToggleGroup type="single" variant="outline" defaultValue="center">
            <ToggleGroupItem value="left">Left</ToggleGroupItem>
            <ToggleGroupItem value="center">Center</ToggleGroupItem>
            <ToggleGroupItem value="right">Right</ToggleGroupItem>
          </ToggleGroup>
        </div>
        <RadioGroup defaultValue="comfortable">
          {['default', 'comfortable', 'compact'].map((option) => (
            <div key={option} className="flex flex-row items-center gap-2">
              <RadioGroupItem value={option} id={`density-${option}`} />
              <Label htmlFor={`density-${option}`} className="capitalize">
                {option}
              </Label>
            </div>
          ))}
        </RadioGroup>
        <div className="flex flex-col gap-2">
          <Label>Volume: {volume[0]}</Label>
          <Slider value={volume} onValueChange={setVolume} max={100} step={1} />
        </div>
      </CardContent>
    </Card>
  );
}

function DisclosureCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Disclosure</CardTitle>
        <CardDescription>Accordion and Collapsible.</CardDescription>
      </CardHeader>
      <CardContent className="gap-4">
        <Accordion type="single" collapsible defaultValue="item-1">
          <AccordionItem value="item-1">
            <AccordionTrigger>Is it accessible?</AccordionTrigger>
            <AccordionContent>
              <p className="text-sm text-muted-foreground">It renders native views on each platform.</p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Is it styled?</AccordionTrigger>
            <AccordionContent>
              <p className="text-sm text-muted-foreground">Yes, with your shadcn theme.</p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <Collapsible className="gap-2">
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="self-start">
              @peduarte starred 3 repositories ▾
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="gap-2">
            {['@radix-ui/primitives', '@radix-ui/colors', '@stitches/react'].map((repo) => (
              <div key={repo} className="rounded-md border border-border px-4 py-2">
                <span className="text-sm text-foreground">{repo}</span>
              </div>
            ))}
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
}

const invoices = [
  { id: 'INV001', status: 'Paid', amount: '$250.00' },
  { id: 'INV002', status: 'Pending', amount: '$150.00' },
  { id: 'INV003', status: 'Unpaid', amount: '$350.00' },
];

function DataCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Data</CardTitle>
        <CardDescription>Table, Breadcrumb, Kbd and Spinner.</CardDescription>
      </CardHeader>
      <CardContent className="gap-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink>Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink>Billing</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Invoices</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.map((invoice) => (
              <TableRow key={invoice.id}>
                <TableCell className="font-medium">{invoice.id}</TableCell>
                <TableCell>{invoice.status}</TableCell>
                <TableCell className="text-right">{invoice.amount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="flex flex-row items-center gap-3">
          <KbdGroup>
            <Kbd>⌘</Kbd>
            <Kbd>K</Kbd>
          </KbdGroup>
          <span className="flex-1 text-sm text-muted-foreground">to search</span>
          <Spinner />
          <span className="text-sm text-muted-foreground">Loading</span>
        </div>
      </CardContent>
    </Card>
  );
}


function FormsCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Form layout</CardTitle>
        <CardDescription>Field, Button Group and Input Group.</CardDescription>
      </CardHeader>
      <CardContent className="gap-4">
        <Field>
          <FieldLabel>Website</FieldLabel>
          <InputGroup>
            <InputGroupAddon>
              <InputGroupText>https://</InputGroupText>
            </InputGroupAddon>
            <InputGroupInput placeholder="example.com" />
            <InputGroupAddon align="inline-end">
              <InputGroupButton onClick={() => toast('Copied')}>Copy</InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
          <FieldDescription>Where people can find you.</FieldDescription>
        </Field>
        <ButtonGroup>
          <Button variant="outline">Archive</Button>
          <Button variant="outline">Report</Button>
          <Button variant="outline">Snooze</Button>
        </ButtonGroup>
      </CardContent>
    </Card>
  );
}

function ItemsCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Item</CardTitle>
        <CardDescription>Rows with media, content and actions.</CardDescription>
      </CardHeader>
      <CardContent className="gap-3">
        <Item variant="outline">
          <ItemContent>
            <ItemTitle>Basic item</ItemTitle>
            <ItemDescription>A simple item with a title and description.</ItemDescription>
          </ItemContent>
          <ItemActions>
            <Button variant="outline" size="sm">
              Action
            </Button>
          </ItemActions>
        </Item>
        <Item variant="muted" size="sm">
          <ItemMedia variant="icon">
            <span className="text-sm text-foreground">✓</span>
          </ItemMedia>
          <ItemContent>
            <ItemTitle>Your profile has been verified.</ItemTitle>
          </ItemContent>
        </Item>
      </CardContent>
    </Card>
  );
}

function MoreOverlaysCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>More overlays</CardTitle>
        <CardDescription>Drawer, Tooltip and Context Menu.</CardDescription>
      </CardHeader>
      <CardContent className="gap-4">
        <div className="flex flex-row flex-wrap items-center gap-2">
          <Drawer>
            <DrawerTrigger asChild>
              <Button variant="outline">Open drawer</Button>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>Move goal</DrawerTitle>
                <DrawerDescription>Set your daily activity goal.</DrawerDescription>
              </DrawerHeader>
              <span className="text-center text-6xl font-bold text-foreground">350</span>
              <span className="text-center text-xs text-muted-foreground">CALORIES/DAY</span>
              <DrawerFooter>
                <DrawerClose asChild>
                  <Button onClick={() => toast.success('Goal saved')}>Submit</Button>
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
          <Tooltip>
            <TooltipTrigger>
              <Button variant="outline">Hover or hold me</Button>
            </TooltipTrigger>
            <TooltipContent>Add to library</TooltipContent>
          </Tooltip>
        </div>
        <ContextMenu>
          <ContextMenuTrigger className="h-24 items-center justify-center rounded-md border border-dashed border-border">
            <span className="text-sm text-muted-foreground">Right-click or long-press here</span>
          </ContextMenuTrigger>
          <ContextMenuContent className="w-52">
            <ContextMenuItem onSelect={() => toast('Back')}>
              Back <ContextMenuShortcut>⌘[</ContextMenuShortcut>
            </ContextMenuItem>
            <ContextMenuItem onSelect={() => toast('Reload')}>
              Reload <ContextMenuShortcut>⌘R</ContextMenuShortcut>
            </ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem onSelect={() => toast('Saved')}>Save page as…</ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      </CardContent>
    </Card>
  );
}

function CommandCard() {
  const [open, setOpen] = useState(false);
  const run = (label: string) => {
    setOpen(false);
    toast(label);
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle>Command</CardTitle>
        <CardDescription>A searchable command palette.</CardDescription>
      </CardHeader>
      <CardContent>
        <Button variant="outline" className="justify-between" onClick={() => setOpen(true)}>
          Search commands… <Kbd>⌘K</Kbd>
        </Button>
        <CommandDialog open={open} onOpenChange={setOpen}>
          <CommandInput placeholder="Type a command or search…" />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Suggestions">
              <CommandItem onSelect={run}>Calendar</CommandItem>
              <CommandItem onSelect={run}>Search emoji</CommandItem>
              <CommandItem onSelect={run}>Calculator</CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Settings">
              <CommandItem onSelect={run}>
                Profile <CommandShortcut>⌘P</CommandShortcut>
              </CommandItem>
              <CommandItem onSelect={run}>
                Settings <CommandShortcut>⌘S</CommandShortcut>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </CommandDialog>
      </CardContent>
    </Card>
  );
}

function DateCard() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [code, setCode] = useState('');
  return (
    <Card>
      <CardHeader>
        <CardTitle>Calendar & OTP</CardTitle>
        <CardDescription>
          {date ? `Selected ${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}` : 'Pick a date'}
        </CardDescription>
      </CardHeader>
      <CardContent className="items-center gap-4">
        <Calendar selected={date} onSelect={setDate} className="rounded-md border border-border" />
        <InputOTP maxLength={6} value={code} onChange={setCode}>
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
          </InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup>
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
      </CardContent>
    </Card>
  );
}

const usage = [
  { day: 'Mon', api: 120, web: 82 },
  { day: 'Tue', api: 164, web: 96 },
  { day: 'Wed', api: 148, web: 131 },
  { day: 'Thu', api: 201, web: 118 },
  { day: 'Fri', api: 187, web: 152 },
  { day: 'Sat', api: 96, web: 74 },
  { day: 'Sun', api: 88, web: 61 },
];

const usageConfig = {
  api: { label: 'API', color: 'var(--chart-1)' },
  web: { label: 'Web', color: 'var(--chart-2)' },
} satisfies ChartConfig;

function ChartsCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Chart</CardTitle>
        <CardDescription>Requests per day. Tap or drag across it.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={usageConfig} className="h-48">
          <LineChart data={usage} xKey="day" />
        </ChartContainer>
        <ChartLegend config={usageConfig} />
      </CardContent>
    </Card>
  );
}

/** Every component, one card each. */
export function ComponentsPage() {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(300,1fr))] gap-6">
      <ButtonsCard />
      <FormCard />
      <FormsCard />
      <SettingsCard />
      <TabsCard />
      <TeamCard />
      <ItemsCard />
      <FeedbackCard />
      <OverlaysCard />
      <MoreOverlaysCard />
      <MenusCard />
      <CommandCard />
      <ControlsCard />
      <DateCard />
      <DisclosureCard />
      <DataCard />
      <ChartsCard />
    </div>
  );
}
