/* eslint max-len: 0 */
const { createSanitizingReducer } = require('../src');
const { object, string, number, array } = require('../src/schema');
const test = require('tape');

test('sanitizing reducer', t => {
  const schema = object({
    aStringValue: string('a value'),
    anObjectValue: object({
      nest1: string(''),
      nest2: number(12344),
    }),
    anArrayValue: array(object({
      nest11: string('asdf'),
      nest12: number(145),
      nest13: string('hello world'),
    })),
    pragmaticTest: (value = {}) => (value.type === 1) ? string('hello!') : number(-1),
  });

  const reducer = createSanitizingReducer(schema);
  const state = {
    aStringValue: undefined,
    aNumberValue: 222,
    anObjectValue: {
      nest1: undefined,
      nest2: undefined,
      nest3: 'whatever~~~~~~~',
    },
    anUnchangingObjectValue: {
      val: 'foo',
    },
    anArrayValue: [
      {
        nest11: 'aaaa',
        nest12: 333,
      },
      {
        nest11: 'ffff',
        nest12: 345345,
      },
    ],
  };

  const newState = reducer(state);
  t.ok(state !== newState, 'root node immutable');
  t.ok(state.aNumberValue === 222);
  t.ok(state.anArrayValue[0].nest12 === newState.anArrayValue[0].nest12, 'same values are the same');
  t.ok(state.anObjectValue !== newState.anObjectValue, '');
  t.ok(state.anUnchangingObjectValue === newState.anUnchangingObjectValue);

  // make immutable changes to newState
  const newImmutableState = {
    ...newState,
    aNumberValue: 0,
    anArrayValue: [
      ...newState.anArrayValue,
      { /* empty object */ },
    ],
  };

  const newNewState = reducer(newImmutableState);
  t.ok(newNewState !== newState, 'root node immutable');
  t.equal(newNewState.aNumberValue, 0);
  t.ok(newNewState.anArrayValue !== newState.anArrayValue, 'interim nodes immutable');
  t.ok(newNewState.anArrayValue[2] !== newState.anArrayValue[2], 'leaf node created according to the schema');
  t.ok(newNewState.anArrayValue[2].nest11 === 'asdf', 'default value enforced');
  t.end();
});
