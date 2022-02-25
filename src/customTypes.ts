export type KeyValuePair<T = unknown> = { [key: string]: T };
export type ObjectTransformerSetting = KeyValuePair<ObjectTransformerOptions>;
export type ObjectTransformerExceptionType = 'required' | 'invalidType';
export type IterationKeyType = string | number
export type TransformReturnType = (KeyValuePair | KeyValuePair[]);
export type ObjectTransformerErrorType = {
  type: 'required',
  iterationKeys: IterationKeyType[],
} | {
  type: 'invalidType',
  iterationKeys: IterationKeyType[],
  expectation: ObjectValueType,
  reality: "string" | "number" | "bigint" | "boolean" | "symbol" | "undefined" | "object" | "function",
}
export type ObjectTransformerBaseContext = {
  errors: ObjectTransformerErrorType[],
  iterationKeys: IterationKeyType[],
}
export type ObjectProcessor<Value = unknown, Data = unknown, Context = {}> = (
  value: Value,
  data: Data,
  settings: ObjectTransformerOptions,
  context: Context,
) => Data;
export type ObjectValueType = 'string' | 'number' | 'boolean' | 'object';
export type ObjectTransformerOptions = {
  from?: string;
  process?: ObjectProcessor<string | number | unknown, string | number | unknown>;
  transformerName?: string;
  defaultValue?: unknown;
  enums?: unknown;
  type?: ObjectValueType;
  required?: boolean;
}
export type ObjectTransformerSettingIndex = KeyValuePair<KeyValuePair<ObjectTransformerOptions>>;
export type ObjectTransformerHelperIndex = KeyValuePair<ObjectProcessor>;
export class ObjectTransformerError extends Error {

  public errors: ObjectTransformerErrorType[];

  constructor(errors: ObjectTransformerErrorType[]) {
    super();
    this.errors = errors;
    this.message = 'ObjectTransformerError';
  }

}