import { extract } from 'utils';
import { ViewProcessType, ViewOptions, KeyValuePair } from './customTypes';

export class ViewRender<ViewListIndex extends KeyValuePair<ViewOptions>,
  ViewHelperIndex extends KeyValuePair<ViewProcessType<ViewListIndex>>>{

  public viewIndex: ViewListIndex;
  public viewHelperIndex: ViewHelperIndex;

  constructor(viewIndex: ViewListIndex, viewHelperIndex: ViewHelperIndex) {
    this.viewIndex = viewIndex;
    this.viewHelperIndex = viewHelperIndex;
  }

  public render<Data, DataContext>(name: keyof ViewListIndex, data: Data | Data[], context?: DataContext): (KeyValuePair | KeyValuePair[]) {
    if (Array.isArray(data)) {
      return data.map((record) => this.render(name, record, context)) as KeyValuePair[];
    }
    if (data === null || data === undefined) {
      return {};
    }
    const view: ViewOptions = this.viewIndex[name];
    if (!view) {
      throw new Error(`View not found: ${name}`);
    }
    const result: KeyValuePair = {};
    const fieldSettings: [string, ViewOptions][] = Object.entries(view);
    for (const fieldSetting of fieldSettings) {
      const [key, options] = fieldSetting;
      const { defaultValue, enums, from, process, view } = options;
      let value = from ? extract(data, from) : data[key];
      value = value === undefined ? defaultValue : value;
      if (enums) {
        value = enums[value];
      }
      if (process) {
        value = process(value, data, options, context);
      }
      if (view) {
        value = this.render(view, value, context);
      }
      result[key] = value;
    }
    return result;
  }

}