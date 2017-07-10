const { object, array, string, number } = require('../src/schema');
const test = require('tape');

test('schema', t => {
  const rootSchema = object({
    str1: string(),
    str2: string('hello world'),
    num1: number(),
    num2: number(2),
    obj1: object({
      obj11: string(),
      num11: number(),
    }),
    arr1: array({
      obj: object({
        str: string('5555'),
      }),
    }),
  });

  t.ok(rootSchema.type === Object);
  t.ok(rootSchema.values.str1.type === String);
  t.ok(rootSchema.values.num2.defaultValue === 2);
  t.end();
});
