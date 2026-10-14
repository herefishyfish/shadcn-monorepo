import { useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from '../components/ui/alert';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Checkbox } from '../components/ui/checkbox';
import { Item, ItemContent, ItemDescription, ItemMedia, ItemTitle } from '../components/ui/item';
import { Label } from '../components/ui/label';
import { Progress } from '../components/ui/progress';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { Slider } from '../components/ui/slider';
import { Switch } from '../components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Textarea } from '../components/ui/textarea';

// ponytail: the night lives in memory. Persist when a watch has to survive a reload.

const crew = [
  { id: 'ada', name: 'Ada Voss', role: 'Optics', initials: 'AV' },
  { id: 'jun', name: 'Jun Park', role: 'Radio', initials: 'JP' },
  { id: 'leo', name: 'Leo Ibarra', role: 'Power', initials: 'LI' },
  { id: 'noor', name: 'Noor El-Sayed', role: 'Night lead', initials: 'NE' },
];

const tasks = [
  { id: 'gen', label: 'Top up the generator' },
  { id: 'focus', label: 'Focus the all-sky lens' },
  { id: 'radio', label: 'Radio check with McMurdo' },
  { id: 'tea', label: 'Put the kettle on' },
] as const;

const instruments = [
  { id: 'all-sky', label: 'All-sky camera', note: 'Fish-eye on the hatch. Thirty-second exposures.' },
  { id: 'spectro', label: 'Spectrograph', note: 'Slit on the green line, 557.7 nm.' },
  { id: 'mag', label: 'Magnetometer', note: 'Fluxgate is quiet. Log spikes over 40 nT.' },
];

const GALE = 45;

function clock() {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

export function KiteView() {
  const [wind, setWind] = useState(28);
  const [dome, setDome] = useState(true);
  const [instrument, setInstrument] = useState('all-sky');
  const [done, setDone] = useState<Record<string, boolean>>({ gen: true, focus: true, radio: false, tea: false });
  const [watch, setWatch] = useState(0);
  const [note, setNote] = useState('');
  const [entries, setEntries] = useState([
    { time: '01:40', text: 'Aurora brightened in the south. Started a run.' },
    { time: '00:15', text: 'Handed the watch to Ada. Generator at 80%.' },
  ]);

  const gale = wind >= GALE;
  const band = wind < 20 ? 'Calm' : gale ? 'Gale' : 'Fresh';
  const onDuty = crew[watch];
  const next = crew[(watch + 1) % crew.length];
  const finished = tasks.filter((task) => done[task.id]).length;
  const ready = finished === tasks.length && !(gale && dome);
  const running = instruments.find((item) => item.id === instrument)!;

  const file = () => {
    const text = note.trim();
    if (!text) return;
    setEntries([{ time: clock(), text }, ...entries]);
    setNote('');
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <div className="flex flex-row flex-wrap items-center gap-2">
          <span className="text-xl font-semibold text-foreground">Kite Station</span>
          <Badge variant={gale ? 'destructive' : 'secondary'}>{band}</Badge>
          <Badge variant="outline">{dome ? 'Dome open' : 'Dome shut'}</Badge>
        </div>
        <span className="text-sm text-muted-foreground">
          Ross Ice Shelf · Night 118 · {onDuty.name} has the watch
        </span>
      </div>
      
      <Card
        className="flex flex-col gap-2 p-4"
        style={{
          background:
            'radial-gradient(ellipse at 80% 20%, rgba(111, 171, 247, 0.35) 0%, transparent 60%),' +
            'radial-gradient(ellipse at 15% 80%, rgba(90, 246, 252, 0.32) 0%, transparent 65%),' +
            'radial-gradient(ellipse at 50% 45%, rgba(255, 233, 167, 0.15) 0%, transparent 80%)',
        }}
      >
        <span className="text-xl font-semibold text-foreground">Native Station!</span>
        <p className="text-sm text-muted-foreground">
          NativeScript is a framework for building native applications using JavaScript and CSS. It allows you to build mobile applications using web technologies and share code between iOS, Android, Web, Windows and more.
        </p>
      </Card>
 

      {gale && dome ? (
        <Alert variant="destructive">
          <AlertTitle>Wind is over the hatch limit</AlertTitle>
          <AlertDescription>Close the dome before the next gust. The camera can keep running through the slit.</AlertDescription>
        </Alert>
      ) : null}
      {ready ? (
        <Alert>
          <AlertTitle>The watch is set</AlertTitle>
          <AlertDescription>
            {running.label} is running and the hut is closed up. {onDuty.name.split(' ')[0]} can sit with the kettle.
          </AlertDescription>
        </Alert>
      ) : null}

      <Tabs defaultValue="board">
        <TabsList>
          <TabsTrigger value="board">Board</TabsTrigger>
          <TabsTrigger value="log">Log</TabsTrigger>
        </TabsList>
        <TabsContent value="board" className="gap-4 pt-2">
          <Card>
            <CardHeader>
              <CardTitle>Outside</CardTitle>
              <CardDescription>{wind} km/h out of the south. Hatch limit is {GALE}.</CardDescription>
            </CardHeader>
            <CardContent className="gap-4">
              <Slider value={[wind]} min={0} max={80} onValueChange={(value) => setWind(value[0])} />
              <div className="flex flex-row items-center justify-between gap-3">
                <Label htmlFor="dome">Dome</Label>
                <Switch id="dome" checked={dome} onCheckedChange={setDome} />
              </div>
            </CardContent>
            {gale && dome ? (
              <CardFooter>
                <Button variant="destructive" onClick={() => setDome(false)}>
                  Close the dome
                </Button>
              </CardFooter>
            ) : null}
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Instrument</CardTitle>
              <CardDescription>{running.note}</CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup value={instrument} onValueChange={setInstrument}>
                {instruments.map((item) => (
                  <div key={item.id} className="flex flex-row items-center gap-2">
                    <RadioGroupItem id={item.id} value={item.id} />
                    <Label htmlFor={item.id}>{item.label}</Label>
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Before you sit down</CardTitle>
              <CardDescription>
                {finished} of {tasks.length} done
              </CardDescription>
            </CardHeader>
            <CardContent className="gap-3">
              <Progress value={(finished / tasks.length) * 100} />
              {tasks.map((task) => (
                <div key={task.id} className="flex flex-row items-center gap-2">
                  <Checkbox
                    id={task.id}
                    checked={!!done[task.id]}
                    onCheckedChange={(checked) => setDone({ ...done, [task.id]: checked })}
                  />
                  <Label htmlFor={task.id}>{task.label}</Label>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Crew</CardTitle>
              <CardDescription>Four people. One awake.</CardDescription>
            </CardHeader>
            <CardContent className="gap-2">
              {crew.map((person) => (
                <Item key={person.id} variant={person.id === onDuty.id ? 'muted' : 'outline'} size="sm">
                  <ItemMedia>
                    <Avatar>
                      <AvatarFallback>{person.initials}</AvatarFallback>
                    </Avatar>
                  </ItemMedia>
                  <ItemContent>
                    <ItemTitle>{person.name}</ItemTitle>
                    <ItemDescription>{person.role}</ItemDescription>
                  </ItemContent>
                  {person.id === onDuty.id ? <Badge>On watch</Badge> : null}
                </Item>
              ))}
            </CardContent>
            <CardFooter>
              <Button variant="outline" onClick={() => setWatch((watch + 1) % crew.length)}>
                Hand the watch to {next.name.split(' ')[0]}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="log" className="gap-4 pt-2">
          <Card>
            <CardHeader>
              <CardTitle>File a line</CardTitle>
              <CardDescription>What changed since the last entry.</CardDescription>
            </CardHeader>
            <CardContent className="gap-3">
              <Textarea
                value={note}
                placeholder="Green line flared, then dropped."
                onChange={(event) => setNote(event.target.value)}
              />
              <Button disabled={!note.trim()} onClick={file}>
                File it
              </Button>
            </CardContent>
          </Card>
          <div className="flex flex-col gap-2">
            {entries.map((entry) => (
              <Item key={`${entry.time}-${entry.text}`} variant="outline" size="sm">
                <ItemContent>
                  <ItemTitle>{entry.time}</ItemTitle>
                  <ItemDescription>{entry.text}</ItemDescription>
                </ItemContent>
              </Item>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
