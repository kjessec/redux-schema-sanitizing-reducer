'use strict';
import { createSanitizingReducer } from '../src';
import { object, string, number, array } from '../src/schema';
import test from 'tape';

createSanitizingReducer.trackChanges = true;

test('sanitizing reducer', function(t) {
  const schema = object({
    aStringValue: string('a value'),
    anObjectValue: object({
      nest1: string(''),
      nest2: number(12344)
    }),
    anArrayValue: array(object({
      nest11: string('asdf'),
      nest12: number(145),
      nest13: string('hello world')
    }))
  });

  const reducer = createSanitizingReducer(schema);
  const state = {
    aStringValue: undefined,
    anObjectValue: {
      nest1: undefined,
      nest2: undefined,
      nest3: 'whatever~~~~~~~'
    },
    anUnchangingObjectValue: {
      val: 'foo'
    },
    anArrayValue: [
      {
        nest11: 'aaaa',
        nest12: 333
      },
      {
        nest11: 'ffff',
        nest12: 345345
      }
    ]
  };

  const newState = reducer(state);
  t.ok(state !== newState, 'root node immutable');
  t.ok(state.anArrayValue[0].nest12 === newState.anArrayValue[0].nest12, 'same values are the same');
  t.ok(state.anObjectValue !== newState.anObjectValue, '');
  t.ok(state.anUnchangingObjectValue === newState.anUnchangingObjectValue);

  // make immutable changes to newState
  const newImmutableState = {
    ...newState,
    anArrayValue: [
      ...newState.anArrayValue,
      { /* empty object */ }
    ]
  };

  const newNewState = reducer(newImmutableState);
  t.ok(newNewState !== newState, 'root node immutable');
  t.ok(newNewState.anArrayValue !== newState.anArrayValue, 'interim nodes immutable');
  t.ok(newNewState.anArrayValue[2] !== newState.anArrayValue[2], 'leaf node created according to the schema');
  t.ok(newNewState.anArrayValue[2].nest11 === 'asdf', 'default value enforced');
  t.end();
});
