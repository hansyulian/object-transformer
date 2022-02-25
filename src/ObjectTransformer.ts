import { extract } from 'utils';
import { ObjectTransformerOptions, KeyValuePair, ObjectTransformerSettingIndex, ObjectTransformerHelperIndex, ObjectTransformerErrorType, ObjectTransformerBaseContext, TransformReturnType, ObjectTransformerError } from './customTypes';

export class ObjectTransformer<TransformerIndex extends ObjectTransformerSettingIndex,
  TransformerHelperIndex extends ObjectTransformerHelperIndex>{
  private _transformerIndex: TransformerIndex;
  private _transformerHelperIndex: TransformerHelperIndex;

  constructor(transformerIndex: TransformerIndex,
    transformerHelperIndex: TransformerHelperIndex,
  ) {
    this._transformerIndex = transformerIndex;
    this._transformerHelperIndex = transformerHelperIndex;

  }

  public get transformerIndex() {
    return this._transformerIndex
  }

  public get transformerHelperIndex() {
    return this._transformerHelperIndex;
  }

  public process<Data, CustomObjectTransformerContext>(name: string, data: Data | Data[], additionalContext?: CustomObjectTransformerContext): TransformReturnType {
    const runContext = {
      ...additionalContext,
      errors: [],
      iterationKeys: [],
    }
    const result = this._process(name, data, runContext);
    if (runContext.errors.length > 0) {
      throw new ObjectTransformerError(runContext.errors);
    }
    return result;
  }

  private _process<Data, CustomObjectTransformerContext>(name: string, data: Data | Data[], context: CustomObjectTransformerContext & ObjectTransformerBaseContext): (KeyValuePair | KeyValuePair[]) {
    if (Array.isArray(data)) {
      return data.map((record, index) => this._process(name, record, {
        ...context,
        iterationKeys: [...context.iterationKeys, index],
      })) as KeyValuePair[];
    }
    if (data === null || data === undefined) {
      return {};
    }
    const view: ObjectTransformerOptions = this._transformerIndex[name];
    if (!view) {
      throw new Error(`View not found: ${name}`);
    }
    const result: KeyValuePair = {};
    const fieldSettings: [string, ObjectTransformerOptions][] = Object.entries(view);
    for (const fieldSetting of fieldSettings) {
      const [key, options] = fieldSetting;
      const { defaultValue, required, type, enums, from, process, transformerName } = options;
      const iterationKeys = [...context.iterationKeys, key];
      let value = from ? extract(data, from) : data[key];
      // validation
      if (required && (value === undefined || value === null)) {
        context.errors.push({
          type: 'required',
          iterationKeys,
        });
        continue;
      }
      if (value === undefined || value === null) {
        continue;
      }
      if (type) {
        const valueType = typeof (value);
        if (type !== valueType) {
          context.errors.push({
            type: 'invalidType',
            iterationKeys,
            expectation: type,
            reality: valueType,
          })
          continue;
        }
      }
      // value processing
      value = value === undefined || value === null ? defaultValue : value;
      if (enums) {
        value = enums[value];
      }
      if (process) {
        value = process(value, data, options, {
          ...context,
          iterationKeys,
        });
      }
      if (transformerName) {
        value = this._process(transformerName, value, {
          ...context,
          iterationKeys,
        });
      }
      result[key] = value;
    }
    return result;
  }

}