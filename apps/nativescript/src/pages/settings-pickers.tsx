import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger, usePopover } from '@/components/ui/popover';

const languages = ['English', 'French', 'German', 'Spanish', 'Portuguese', 'Russian', 'Japanese', 'Korean', 'Chinese'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function DatePickerContent({ value, onChange }: { value?: Date; onChange: (date: Date) => void }) {
  const { setOpen } = usePopover();
  return (
    <PopoverContent className="w-auto p-0">
      <Calendar
        selected={value}
        onSelect={(date) => {
          onChange(date);
          setOpen(false);
        }}
        disabled={(date) => date > new Date()}
      />
    </PopoverContent>
  );
}

export function DatePicker({ value, onChange }: { value?: Date; onChange: (date: Date) => void }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-56 justify-start text-left">
          {value ? `${MONTHS[value.getMonth()]} ${value.getDate()}, ${value.getFullYear()}` : 'Pick a date'}
        </Button>
      </PopoverTrigger>
      <DatePickerContent value={value} onChange={onChange} />
    </Popover>
  );
}

function LanguagePickerContent({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const { setOpen } = usePopover();
  return (
    <PopoverContent className="w-56 p-0">
      <Command>
        <CommandInput placeholder="Search language…" />
        <CommandList>
          <CommandEmpty>No language found.</CommandEmpty>
          <CommandGroup>
            {languages.map((language) => (
              <CommandItem
                key={language}
                value={language}
                onSelect={(selected) => {
                  onChange(selected);
                  setOpen(false);
                }}
              >
                {language}
                {language === value && <span className="text-sm text-popover-foreground">✓</span>}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    </PopoverContent>
  );
}

export function LanguagePicker({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-56 justify-between text-left">
          {value || 'Select language'} ▾
        </Button>
      </PopoverTrigger>
      <LanguagePickerContent value={value} onChange={onChange} />
    </Popover>
  );
}
