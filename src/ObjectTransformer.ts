import { extract } from 'utils';
import { ObjectProcessor, ObjectTransformerOptions, KeyValuePair, ObjectTransformerSettingIndex, ObjectTransformerHelperIndex } from './customTypes';

export class ObjectTransformer<ObjectTransformers extends ObjectTransformerSettingIndex = {},
  ObjectTransformerHelpers extends ObjectTransformerHelperIndex = {},
  Keys extends keyof ObjectTransformers = ''>{

  public viewIndex: ObjectTransformers;
  public viewHelperIndex: ObjectTransformerHelpers;

  constructor(viewIndex: ObjectTransformers, viewHelperIndex: ObjectTransformerHelpers) {
    this.viewIndex = viewIndex;
    this.viewHelperIndex = viewHelperIndex;
  }

  public render<Data, DataContext>(name: Keys, data: Data | Data[], context?: DataContext): (KeyValuePair | KeyValuePair[]) {
    if (Array.isArray(data)) {
      return data.map((record) => this.render(name, record, context)) as KeyValuePair[];
    }
    if (data === null || data === undefined) {
      return {};
    }
    const view: ObjectTransformerOptions = this.viewIndex[name];
    if (!view) {
      throw new Error(`View not found: ${name}`);
    }
    const result: KeyValuePair = {};
    const fieldSettings: [string, ObjectTransformerOptions][] = Object.entries(view);
    for (const fieldSetting of fieldSettings) {
      const [key, options] = fieldSetting;
      const { defaultValue, enums, from, process, transformerName } = options;
      let value = from ? extract(data, from) : data[key];
      value = value === undefined ? defaultValue : value;
      if (enums) {
        value = enums[value];
      }
      if (process) {
        value = process(value, data, options, context);
      }
      if (transformerName) {
        value = this.render(transformerName as Keys, value, context);
      }
      result[key] = value;
    }
    return result;
  }

}