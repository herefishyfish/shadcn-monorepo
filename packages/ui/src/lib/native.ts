/** True inside the NativeScript runtime. Browsers do not set these globals. */
export function isNative() {
  const g = globalThis as { isAndroid?: boolean; isIOS?: boolean; isWindows?: boolean };
  return Boolean(g.isAndroid || g.isIOS || g.isWindows);
}
