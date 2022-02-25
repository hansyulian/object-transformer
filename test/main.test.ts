import { ObjectTransformer, ObjectTransformerError, ObjectTransformerHelperIndex, ObjectTransformerSettingIndex } from "index";

const transformers: ObjectTransformerSettingIndex = {
  basic: {
    anyValue: {},
    stringOnly: {
      type: 'string',
    },
    numberOnly: {
      type: 'number',
    },
    booleanOnly: {
      type: 'boolean'
    },
    usingOtherTransformer: {
      transformerName: 'otherTransformer'
    },
    usingFrom: {
      from: 'fromTarget'
    }
  },
  otherTransformer: {
    value: {}
  },
  validation: {
    anyValue: {},
    stringOnly: {
      type: 'string',
    },
    numberOnly: {
      type: 'number',
    },
    booleanOnly: {
      type: 'boolean'
    },
    required: {
      required: true,
    }
  }
}

const helpers: ObjectTransformerHelperIndex = {

}

describe('ObjectTransfromer', () => {
  it('basic transformation 1', () => {
    const transformer = new ObjectTransformer(transformers, helpers);
    const result = transformer.process('basic', {
      anyValue: 123,
      stringOnly: 'abcd',
      numberOnly: 123,
      booleanOnly: true,
      strayValue: 'shouldnt exists',
      usingOtherTransformer: {
        value: 123,
        value2: 'abc'
      },
      fromTarget: 'abcd1234',
    });
    expect(result).toStrictEqual({
      anyValue: 123,
      stringOnly: 'abcd',
      numberOnly: 123,
      booleanOnly: true,
      usingOtherTransformer: {
        value: 123,
      },
      usingFrom: 'abcd1234',
    });
  });
  it('basic transformation 2 (array)', () => {
    const transformer = new ObjectTransformer(transformers, helpers);
    const result = transformer.process('basic', [{
      anyValue: 123,
      stringOnly: 'abcd',
      numberOnly: 123,
      booleanOnly: true,
      strayValue: 'shouldnt exists'
    }, {
      anyValue: 123,
      stringOnly: 'abcd',
      numberOnly: 123,
      booleanOnly: true,
      strayValue: 'shouldnt exists'
    }]);
    expect(result).toStrictEqual([{
      anyValue: 123,
      stringOnly: 'abcd',
      numberOnly: 123,
      booleanOnly: true
    }, {
      anyValue: 123,
      stringOnly: 'abcd',
      numberOnly: 123,
      booleanOnly: true
    }]);
  });
  it('validation 1', () => {
    const transformer = new ObjectTransformer(transformers, helpers);
    try {
      transformer.process('validation', {
        anyValue: false,
        stringOnly: 1234,
        numberOnly: '12345',
        booleanOnly: 1234,
      });
      fail('should be failed');
    } catch (err) {
      const { errors } = err as ObjectTransformerError;
      console.log(JSON.stringify(errors, null, 4))
      expect(errors).toEqual([
        {
          type: "invalidType",
          iterationKeys: [
            "stringOnly"
          ],
          expectation: "string",
          reality: "number"
        },
        {
          type: "invalidType",
          iterationKeys: [
            "numberOnly"
          ],
          expectation: "number",
          reality: "string"
        },
        {
          type: "invalidType",
          iterationKeys: [
            "booleanOnly"
          ],
          expectation: "boolean",
          reality: "number"
        },
        {
          type: "required",
          iterationKeys: [
            "required"
          ]
        }
      ]);
    }
  })
})