import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldSeparator } from '../components/ui/field';
import { Input } from '../components/ui/input';
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from '../components/ui/input-otp';

function SignIn({ onContinue }: { onContinue: (email: string) => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  return (
    <Card>
      <CardHeader className="items-center">
        <CardTitle className="text-xl">Welcome back</CardTitle>
        <CardDescription>Sign in to your Acme Inc account</CardDescription>
      </CardHeader>
      <CardContent>
        <FieldGroup>
          <Button variant="outline">Continue with Apple</Button>
          <Button variant="outline">Continue with Google</Button>
          <FieldSeparator />
          <Field>
            <FieldLabel>Email</FieldLabel>
            <Input type="email" placeholder="m@example.com" onChange={(e) => setEmail(e.target.value)} />
          </Field>
          <Field>
            <FieldLabel>Password</FieldLabel>
            <Input type="password" onChange={(e) => setPassword(e.target.value)} />
          </Field>
          <Button disabled={!email.includes('@') || !password} onClick={() => onContinue(email)}>
            Sign in
          </Button>
          <FieldDescription className="text-center">Don't have an account? Sign up</FieldDescription>
        </FieldGroup>
      </CardContent>
    </Card>
  );
}

function Verify({ email, onBack, onSignedIn }: { email: string; onBack: () => void; onSignedIn?: (email: string) => void }) {
  const [code, setCode] = useState('');
  const [done, setDone] = useState(false);
  const verify = () => {
    if (onSignedIn) onSignedIn(email);
    else setDone(true);
  };
  return (
    <Card>
      <CardHeader className="items-center">
        <CardTitle className="text-xl">Enter verification code</CardTitle>
        <CardDescription>We sent a 6-digit code to {email}.</CardDescription>
      </CardHeader>
      <CardContent className="items-center gap-6">
        <InputOTP maxLength={6} value={code} onChange={setCode} onComplete={verify}>
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
        <div className="flex w-full flex-col gap-2">
          <Button disabled={code.length < 6} onClick={verify}>
            Verify
          </Button>
          <Button variant="ghost" onClick={onBack}>
            Use a different email
          </Button>
          {done && <span className="text-center text-sm text-muted-foreground">Signed in as {email}</span>}
        </div>
      </CardContent>
    </Card>
  );
}

export function LoginView({ onSignedIn }: { onSignedIn?: (email: string) => void }) {
  const [email, setEmail] = useState<string | null>(null);
  return (
    <div className="mx-auto flex w-full max-w-sm flex-col gap-6">
      <div className="flex flex-row items-center justify-center gap-2">
        <div className="flex size-7 items-center justify-center rounded-md bg-primary">
          <span className="text-sm font-bold text-primary-foreground">N</span>
        </div>
        <span className="text-base font-medium text-foreground">Acme Inc.</span>
      </div>
      {email ? (
        <Verify email={email} onBack={() => setEmail(null)} onSignedIn={onSignedIn} />
      ) : (
        <SignIn onContinue={setEmail} />
      )}
    </div>
  );
}
