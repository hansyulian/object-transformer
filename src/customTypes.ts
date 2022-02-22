export type ViewContext<T> = T;
export type KeyValuePair<T = unknown> = Record<string, T>;
export type ViewSettings = KeyValuePair<ViewOptions>;
export type ViewProcessType<Value = unknown, Data = unknown, Context = {}> = (
  value: Value,
  data: Data,
  settings: ViewOptions,
  context: ViewContext<Context>,
) => Data;
export type ViewOptions = {
  from?: string;
  process?: ViewProcessType<string | number | unknown, string | number | unknown>;
  view?: string;
  defaultValue?: unknown;
  enums?: unknown;
}