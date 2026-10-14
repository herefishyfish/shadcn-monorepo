import { toast } from '@/components/ui/sonner';
import { useTheme } from '@/lib/theme';
import { SettingsView } from '@repo/ui/views/settings';
import { DatePicker, LanguagePicker } from './settings-pickers';

export function SettingsPage() {
  const { appearance, setAppearance } = useTheme();
  return (
    <SettingsView
      appearance={appearance}
      onAppearance={setAppearance}
      onSave={() => toast.success('Profile updated')}
      dateField={(value, onChange) => <DatePicker value={value} onChange={onChange} />}
      languageField={(value, onChange) => <LanguagePicker value={value} onChange={onChange} />}
    />
  );
}
