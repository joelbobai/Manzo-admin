export function cn(
  ...inputs: Array<string | false | null | undefined>
): string {
  return inputs.filter(Boolean).join(" ");
}

export function formatFullName(name: string): string {
  return name.trim().replace(/\s+/g, " ");
}
