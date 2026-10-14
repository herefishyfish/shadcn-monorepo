import { useState, type ReactNode } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from '../components/ui/field';
import { Input } from '../components/ui/input';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { Switch } from '../components/ui/switch';
import { Textarea } from '../components/ui/textarea';
import { ToggleGroup, ToggleGroupItem } from '../components/ui/toggle-group';

const languages = ['English', 'French', 'German', 'Spanish', 'Portuguese', 'Russian', 'Japanese', 'Korean', 'Chinese'];

type Appearance = 'light' | 'dark';

export function SettingsView({
  appearance,
  onAppearance,
  onSave,
  dateField,
  languageField,
}: {
  appearance?: Appearance;
  onAppearance?: (value: Appearance) => void;
  onSave?: () => void;
  dateField?: (value: Date | undefined, onChange: (date: Date) => void) => ReactNode;
  languageField?: (value: string, onChange: (value: string) => void) => ReactNode;
}) {
  const [mode, setMode] = useState<Appearance>(appearance ?? 'light');
  const current = appearance ?? mode;
  const [name, setName] = useState('Pedro Duarte');
  const [email, setEmail] = useState('pedro@example.com');
  const [birthday, setBirthday] = useState<Date | undefined>();
  const [language, setLanguage] = useState('English');
  const [saved, setSaved] = useState(false);
  const emailError = email.includes('@') ? undefined : 'Enter a valid email address.';

  const setAppearance = (value: Appearance) => {
    setMode(value);
    onAppearance?.(value);
  };

  return (
    <>
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground">Manage your account settings and preferences.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>This is how others will see you.</CardDescription>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <Field>
              <FieldLabel>Name</FieldLabel>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
              <FieldDescription>Your public display name.</FieldDescription>
            </Field>
            <Field>
              <FieldLabel>Email</FieldLabel>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              <FieldError>{emailError}</FieldError>
            </Field>
            <Field>
              <FieldLabel>Bio</FieldLabel>
              <Textarea placeholder="Tell us a little bit about yourself" />
            </Field>
            <Field>
              <FieldLabel>Date of birth</FieldLabel>
              {dateField ? (
                dateField(birthday, setBirthday)
              ) : (
                <Input
                  type="date"
                  value={birthday ? birthday.toISOString().slice(0, 10) : ''}
                  onChange={(e) => setBirthday(e.target.value ? new Date(e.target.value) : undefined)}
                />
              )}
              <FieldDescription>Used to calculate your age.</FieldDescription>
            </Field>
            <Field>
              <FieldLabel>Language</FieldLabel>
              {languageField ? (
                languageField(language, setLanguage)
              ) : (
                <div className="flex flex-row flex-wrap gap-2">
                  {languages.map((item) => (
                    <Button
                      key={item}
                      variant={item === language ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setLanguage(item)}
                    >
                      {item}
                    </Button>
                  ))}
                </div>
              )}
            </Field>
          </FieldGroup>
        </CardContent>
        <CardFooter>
          <Button
            disabled={!!emailError}
            onClick={() => {
              onSave?.();
              setSaved(true);
            }}
          >
            Update profile
          </Button>
          {saved && <span className="text-sm text-muted-foreground">Profile updated</span>}
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>Choose what we email you about.</CardDescription>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <RadioGroup defaultValue="mentions">
              {[
                ['all', 'All new messages'],
                ['mentions', 'Direct messages and mentions'],
                ['none', 'Nothing'],
              ].map(([value, label]) => (
                <Field key={value} orientation="horizontal">
                  <RadioGroupItem value={value} id={`notify-${value}`} />
                  <FieldLabel htmlFor={`notify-${value}`}>{label}</FieldLabel>
                </Field>
              ))}
            </RadioGroup>
            <FieldSeparator />
            {(
              [
                ['Communication emails', 'Receive emails about your account activity.', false],
                ['Marketing emails', 'Receive emails about new products and features.', false],
                ['Security emails', 'Receive emails about your account security.', true],
              ] as const
            ).map(([title, description, on]) => (
              <Field key={title} orientation="horizontal">
                <FieldContent>
                  <FieldLabel>{title}</FieldLabel>
                  <FieldDescription>{description}</FieldDescription>
                </FieldContent>
                <Switch defaultChecked={on} />
              </Field>
            ))}
          </FieldGroup>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>Override the system theme.</CardDescription>
        </CardHeader>
        <CardContent>
          <ToggleGroup
            type="single"
            variant="outline"
            value={current}
            onValueChange={(value) => value && setAppearance(value as Appearance)}
          >
            <ToggleGroupItem value="light">Light</ToggleGroupItem>
            <ToggleGroupItem value="dark">Dark</ToggleGroupItem>
          </ToggleGroup>
        </CardContent>
      </Card>
    </>
  );
}
