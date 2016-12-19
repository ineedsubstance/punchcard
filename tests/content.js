import test from 'ava';
import uuid from 'uuid';
import config from 'config';
import _ from 'lodash';

import utils from '../lib/content/utils';
import futils from './fixtures/_utils';

const req = {
  params: {
    id: '',
    revision: '',
  },
  session: {},
};

const type = {
  name: '',
  id: '',
};


//////////////////////////////
// Utils - file inputs
//////////////////////////////
test('fileinputs - no input should return array', t => {
  const result = utils.fileinputs();

  t.true(Array.isArray(result), 'should return an array');
  t.is(result.length, 0,  'should return an empty array');
});

test('fileinputs - get file inputs', t => {
  const type = futils.type('fileinputs');
  const result = utils.fileinputs(type.attributes);

  t.true(Array.isArray(result), 'should return an array');
  t.is(result.length, 4,  'should have two items in array');

  t.is(typeof result[0], 'object', 'file input desc should be an object');
  t.is(result[0].attr, 'fileinputs-file-single', 'should know 1st attribute\'s id');
  t.is(result[0].input, 'filesingle', 'should know 1st attribute\'s input id');
  t.is(result[0].type, 'file', 'should know 1st attribute\'s input type');
  t.is(typeof result[1], 'object', 'file input desc should be an object');
  t.is(result[1].attr, 'fileinputs-file-repeating', 'should know 2nd attribute\'s id');
  t.is(result[1].input, 'filerepeater', 'should know 2nd attribute\'s input id');
  t.is(result[1].type, 'file', 'should know 2nd attribute\'s input type');
  t.is(typeof result[2], 'object', 'file input desc should be an object');
  t.is(result[2].attr, 'fileinputs-file-multiple', 'should know 3rd attribute\'s id');
  t.is(result[2].input, 'filemulti1', 'should know 3rd attribute\'s input id');
  t.is(result[2].type, 'file', 'should know 3rd attribute\'s input type');
  t.is(typeof result[3], 'object', 'file input desc should be an object');
  t.is(result[3].attr, 'fileinputs-file-multiple', 'should know 4th attribute\'s id');
  t.is(result[3].input, 'filemulti2', 'should know 4th attribute\'s input id');
  t.is(result[3].type, 'file', 'should know 4th attribute\'s input type');
});

//////////////////////////////
// Utils - file paths
//////////////////////////////
test('filepaths - returns second param unchanged if first param empty or not array', t => {
  const result = utils.filepaths('', 'foo');

  t.is(result, 'foo', 'should return 2nd param');

  const result2 = utils.filepaths('bar', 'foo');

  t.is(result2, 'foo', 'should return 2nd param');

  const result3 = utils.filepaths([], 'foo');

  t.is(result3, 'foo', 'should return 2nd param');
});

test('filepaths - convert file values to add absolute', t => {
  const type = futils.type('fileinputs');
  const fileinputs = utils.fileinputs(type.attributes);
  const result = utils.filepaths(fileinputs, futils.values('fileinputs'));

  t.is(typeof result['fileinputs-file-single'], 'object', 'file-single input should be an object');
  t.is(typeof result['fileinputs-file-single']['filesingle'], 'object', 'file-single input should contain an input object');
  t.is(typeof result['fileinputs-file-single']['filesingle'].value, 'object', 'file-single input should contain an input value object');
  t.is(typeof result['fileinputs-file-single']['filesingle'].value.absolute, 'string', 'file-single input should contain an absolute string');
  t.true(_.includes(result['fileinputs-file-single']['filesingle'].value.absolute, config.storage.public), 'file-single input should contain the storage prefix');

  t.true(Array.isArray(result['fileinputs-file-repeating']['filerepeater']), 'file-repeating input should be an array');
  result['fileinputs-file-repeating']['filerepeater'].forEach(input => {
    t.is(typeof input.value.absolute, 'string', 'filerepeater input should contain an absolute string');
    t.true(_.includes(input.value.absolute, config.storage.public), 'filerepeater input should contain the storage prefix');
  });

  t.is(typeof result['fileinputs-file-multiple'], 'object', 'file-multiple input should be an object');
  const multis = result['fileinputs-file-multiple'];

  t.is(Object.keys(multis).length, 2, 'should contain two inputs');
  Object.keys(multis).forEach(input => {
    t.is(typeof multis[input].value, 'object', 'file-multiple input should contain an input value object');
    t.is(typeof multis[input].value.absolute, 'string', 'file-multiple input should contain an absolute string');
    t.true(_.includes(multis[input].value.absolute, config.storage.public), 'file-multiple input should contain the storage prefix');
  });
});

//////////////////////////////
// Utils - id check
//////////////////////////////
test('Check content id-not blank', t => {
  const result = utils.check.id(req);
  t.false(result, 'Not in uuid');
});

test('Check content id-not object', t => {
  const rq = (JSON.parse(JSON.stringify(req)));
  rq.params.id = {};
  const result = utils.check.id(rq);
  t.false(result, 'Not in uuid');
});

test('Check content id-not string', t => {
  const rq = (JSON.parse(JSON.stringify(req)));
  rq.params.id = 'foo';
  const result = utils.check.id(rq);
  t.false(result, 'Not in uuid');
});

test('Check content id-not just a number', t => {
  const rq = (JSON.parse(JSON.stringify(req)));
  rq.params.id = 123;
  const result = utils.check.id(rq);
  t.false(result, 'Not in uuid');
});

test('Check content id - IS uuid', t => {
  const rq = (JSON.parse(JSON.stringify(req)));
  rq.params.id = uuid.v4();
  const result = utils.check.id(rq);
  t.true(result, 'It should be in uuid');
});

//////////////////////////////
// Utils - revision check
//////////////////////////////
test('Check revision id-not blank', t => {
  const result = utils.check.revision(req);
  t.false(result, 'Not blank');
});
test('Check revision id-not object', t => {
  const rq = (JSON.parse(JSON.stringify(req)));
  rq.params.id = {};
  const result = utils.check.revision(rq);
  t.false(result, 'Not an object');
});

test('Check revision id-not string', t => {
  const rq = (JSON.parse(JSON.stringify(req)));
  rq.params.id = 'foo';
  const result = utils.check.revision(rq);
  t.false(result, 'Not a string');
});

//////////////////////////////
// Utils - type check
//////////////////////////////
test('Check type exists', t => {
  const result = utils.check.type(req, null);
  t.false(result, 'Not blank');
});

test('Check type is object', t => {
  const result = utils.check.type(req, 'foo');
  t.false(result, 'Type should be an object');
});

test('Check type for name', t => {
  const typ = (JSON.parse(JSON.stringify(type)));
  typ.id = 'foo';
  const result = utils.check.type(req, typ);
  t.false(result, 'Should not allow blank type name');
});

test('Check type for id', t => {
  const typ = (JSON.parse(JSON.stringify(type)));
  typ.name = 'foo';
  const result = utils.check.type(req, typ);
  t.false(result, 'Should not allow blank type id');
});

test('Check accept a type object', t => {
  const typ = {
    name: 'foo',
    id: 'foo',
  };
  const result = utils.check.type(req, typ);
  t.true(result, 'Should be happy with a type object');
});
