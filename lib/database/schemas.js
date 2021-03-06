'use strict';

const cloneDeep = require('lodash/cloneDeep');

/**
 * Individual Content Type Schema
 */
const content = [
  {
    name: 'revision',
    type: 'increments',
    index: true,
  },
  {
    name: 'id',
    type: 'string',
  },
  {
    name: 'created',
    type: 'timestamp',
  },
  {
    name: 'language',
    type: 'string',
  },
  {
    name: 'sunrise',
    type: 'dateTime',
  },
  {
    name: 'sunrise-timezone',
    type: 'string',
  },
  {
    name: 'sunset',
    type: 'dateTime',
  },
  {
    name: 'sunset-timezone',
    type: 'string',
  },
  {
    name: 'approval',
    type: 'integer',
  },
  {
    name: 'publishable',
    type: 'boolean',
  },
  {
    name: 'value',
    type: 'jsonb',
  },
  {
    name: 'author',
    type: 'integer',
    foreign: {
      reference: 'users.id',
      delete: 'SET NULL',
      update: 'CASCADE',
    },
  },
  {
    name: 'audit',
    type: 'jsonb',
  },
];

/**
 * All Content Types Schema
 */
const allTypes = [
  {
    name: 'version',
    type: 'increments',
    index: true,
  },
  {
    name: 'created',
    type: 'timestamp',
  },
  {
    name: 'value',
    type: 'jsonb',
  },
];

/*
 * Users schema
 */
const users = [
  {
    name: 'id',
    type: 'increments',
    index: true,
  },
  {
    name: 'email',
    type: 'string',
  },
  {
    name: 'password',
    type: 'string',
  },
  {
    name: 'role',
    type: 'string',
  },
  {
    name: 'access',
    type: 'jsonb',
  },
  {
    name: 'created',
    type: 'timestamp',
  },
  {
    name: 'updated',
    type: 'timestamp',
  },
];

/*
 * Applications schema
 */
const applications = [
  {
    name: 'id',
    type: 'increments',
    index: true,
  },
  {
    name: 'name',
    type: 'string',
  },
  {
    name: 'live-endpoint',
    type: 'string',
  },
  {
    name: 'updated-endpoint',
    type: 'string',
  },
  {
    name: 'sunset-endpoint',
    type: 'string',
  },
  {
    name: 'client-id',
    type: 'string',
  },
  {
    name: 'client-secret',
    type: 'string',
  },
  {
    name: 'responses',
    type: 'jsonb',
  },
  {
    name: 'created',
    type: 'timestamp',
  },
  {
    name: 'updated',
    type: 'timestamp',
  },
];

/*
 * API schema
 */
const apis = cloneDeep(content).filter(field => {
  const ignores = ['created', 'author', 'revision', 'approval', 'publishable', 'sunrise-timezone', 'sunset-timezone'];
  if (ignores.indexOf(field.name) >= 0) {
    return false;
  }

  return true;
}).map(field => {
  const fld = field;

  // Remove Index property if it exists
  if (fld.hasOwnProperty('index')) {
    delete fld.index;
  }

  if (fld.name === 'value') {
    fld.name = 'attributes';
  }

  return fld;
}).concat([
  {
    name: 'revision',
    type: 'integer',
  },
  {
    name: 'type',
    type: 'string',
  },
  {
    name: 'type-slug',
    type: 'string',
  },
  {
    name: 'key',
    type: 'string',
  },
  {
    name: 'key-slug',
    type: 'string',
  },
]);

module.exports = [
  {
    name: 'users',
    fields: users,
  },
  {
    name: 'content',
    fields: content,
  },
  {
    name: 'all-types',
    fields: allTypes,
  },
  {
    name: 'live',
    fields: apis,
  },
  {
    name: 'schedule',
    fields: apis,
  },
  {
    name: 'applications',
    fields: applications,
  },
];
