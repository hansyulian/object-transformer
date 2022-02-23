import { ObjectTransformer, ObjectTransformerHelperIndex, ObjectTransformerSettingIndex } from "index";

const transformers: ObjectTransformerSettingIndex = {

}

const helpers: ObjectTransformerHelperIndex = {

}

declare('ObjectTransfromer', () => {
  let renderTest: ObjectTransformer;

  beforeAll(() => {
    renderTest = new ObjectTransformer(transformers, helpers);
  });


})