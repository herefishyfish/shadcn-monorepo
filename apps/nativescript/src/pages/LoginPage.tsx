import { Utils } from '@nativescript/core';
import { toast } from '@/components/ui/sonner';
import { LoginView } from '@repo/ui/views/login';

export function LoginPage() {
  return (
    <LoginView
      onSignedIn={(email) => {
        Utils.dismissKeyboard();
        toast.success('Signed in', { description: email });
      }}
    />
  );
}
