import * as React from 'react';
import { Field, FieldDescription, FieldGroup, FieldLabel } from '../components/ui/field';
import { Input } from '../components/ui/input';

export function FieldView() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold text-foreground">Field</h1>
      <FieldGroup>
      <Field>
        <FieldLabel>Name</FieldLabel>
        <Input placeholder="Ada Lovelace" />
        <FieldDescription>Shown on your profile.</FieldDescription>
      </Field>
    </FieldGroup>
    </div>
  );
}
