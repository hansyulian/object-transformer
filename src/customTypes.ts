export type KeyValuePair<T = unknown> = { [key: string]: T };
export type ObjectTransformerSetting = KeyValuePair<ObjectTransformerOptions>;
export type ObjectProcessor<Value = unknown, Data = unknown, Context = {}> = (
  value: Value,
  data: Data,
  settings: ObjectTransformerOptions,
  context: Context,
) => Data;
export type ObjectTransformerOptions = {
  from?: string;
  process?: ObjectProcessor<string | number | unknown, string | number | unknown>;
  transformerName?: string;
  defaultValue?: unknown;
  enums?: unknown;
}
export type ObjectTransformerSettingIndex = KeyValuePair<ObjectTransformerOptions>;
export type ObjectTransformerHelperIndex = KeyValuePair<ObjectProcessor>;