export function formatDate(input: string) {
  if (!input) return "";
  const d = new Date(input);
  const date = d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
  const time = d.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });
  return `${date} ${time}`;
}

function isKeyValueObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}

export function getFieldValue(o: unknown, field: string): unknown {
  return isKeyValueObject(o)
    ? (o as Record<string, unknown>)[field]
    : undefined;
}

export function asArray<T = unknown>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}
