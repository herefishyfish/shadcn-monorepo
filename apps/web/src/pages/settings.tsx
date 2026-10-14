import { SettingsView } from '@repo/ui/views/settings';
import { useWebTheme } from '../theme';

export function SettingsPage() {
  const { appearance, setAppearance } = useWebTheme();
  return <SettingsView appearance={appearance} onAppearance={setAppearance} />;
}
