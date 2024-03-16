/*--------------------------------------------------------------------------

@sinclair/typebox/type

The MIT License (MIT)

Copyright (c) 2017-2024 Haydn Paterson (sinclair) <haydn.developer@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

---------------------------------------------------------------------------*/

import { Kind, Hint, ReadonlyKind, OptionalKind } from '../symbols/index'
import type { TProperties } from '../object/index'
import type { TUnsafe } from '../unsafe/index'
import { Array } from '../array/index'
import { BigInt } from '../bigint/index'
import { Boolean } from '../boolean/index'
import { Intersect } from '../intersect/index'
import { Literal } from '../literal/index'
import { Not } from '../not/index'
import { Number } from '../number/index'
import { Object } from '../object/index'
import { Record } from '../record/index'
import { Recursive } from '../recursive/index'
import { String } from '../string/index'
import { Undefined } from '../undefined/index'
import { Union } from '../union/index'

export interface SchemaOptions {
  $schema?: string
  /** Id for this schema */
  $id?: string
  /** Title of this schema */
  title?: string
  /** Description of this schema */
  description?: string
  /** Default value for this schema */
  default?: any
  /** Example values matching this schema */
  examples?: any
  /** Optional annotation for readOnly */
  readOnly?: boolean
  /** Optional annotation for writeOnly */
  writeOnly?: boolean
  [prop: string]: any
}
export interface TKind {
  [Kind]: string
}
export interface TSchema extends TKind, SchemaOptions {
  [ReadonlyKind]?: string
  [OptionalKind]?: string
  [Hint]?: string
  params: unknown[]
  static: unknown
}

function Type(kind: string, schema: TProperties = {}) {
  return Object(schema, {
    kindSchema: Literal(kind)
  })
}

const Option = <const T extends TSchema[]>(...schemas: T) =>
  Union([...schemas, Undefined()])

export const Schema = (options?: SchemaOptions): TUnsafe<TSchema> =>
  Recursive(Schema => {
    const nativeTypes = [
      Type('Any'),
      Type('Array', {
        items: Schema,
        minItems: Option(Number()),
        maxItems: Option(Number()),
        uniqueItems: Option(Boolean()),
        contains: Option(Schema),
        minContains: Option(Number()),
        maxContains: Option(Number()),
      }),
      Type('AsyncIterator', {
        items: Schema,
      }),
      Type('BigInt', {
        exclusiveMaximum: Option(BigInt()),
        exclusiveMinimum: Option(BigInt()),
        maximum: Option(BigInt()),
        minimum: Option(BigInt()),
        multipleOf: Option(BigInt()),
      }),
      Type('Boolean'),
      Type('Constructor', {
        parameters: Array(Schema),
        returns: Schema,
      }),
      Type('Date', {
        exclusiveMaximumTimestamp: Option(Number()),
        exclusiveMinimumTimestamp: Option(Number()),
        maximumTimestamp: Option(Number()),
        minimumTimestamp: Option(Number()),
        multipleOfTimestamp: Option(Number()),
      }),
      Type('Function', {
        parameters: Array(Schema),
        returns: Schema,
      }),
      Type('Integer', {
        exclusiveMaximum: Option(Number()),
        exclusiveMinimum: Option(Number()),
        maximum: Option(Number()),
        minimum: Option(Number()),
        multipleOf: Option(Number()),
      }),
      Type('Intersect', {
        allOf: Array(Schema),
        unevaluatedProperties: Option(Boolean(), Schema),
        type: Option(Literal('object')),
      }),
      Type('Iterator', {
        items: Schema,
      }),
      Type('Literal', {
        const: Union([String(), Number(), Boolean()]),
      }),
      Type('MappedKey', {
        keys: Array(Union([String(), Number()])),
      }),
      Type('MappedResult', {
        properties: Record(String(), Schema),
      }),
      Type('Never', {
        not: Object({}, { additionalProperties: false })
      }),
      Type('Not', {
        not: Schema,
      }),
      Type('Null'),
      Type('Number', {
        exclusiveMaximum: Option(Number()),
        exclusiveMinimum: Option(Number()),
        maximum: Option(Number()),
        minimum: Option(Number()),
        multipleOf: Option(Number()),
      }),
      Type('Object', {
        properties: Record(String(), Schema),
        additionalProperties: Option(Boolean(), Schema),
        minProperties: Option(Number()),
        maxProperties: Option(Number()),
        required: Option(Array(String())),
      }),
      Type('Promise', {
        item: Schema,
      }),
      Type('Record', {
        patternProperties: Record(String(), Schema),
        additionalProperties: Option(Boolean(), Schema),
      }),
      Type('Ref', {
        $ref: String(),
      }),
      Type('RegExp', {
        source: String(),
        flags: String(),
        minLength: Option(Number()),
        maxLength: Option(Number()),
      }),
      Type('String', {
        minLength: Option(Number()),
        maxLength: Option(Number()),
        pattern: Option(String()),
        format: Option(String()),
        contentEncoding: Option(String()),
        contentMediaType: Option(String()),
      }),
      Type('Symbol'),
      Type('TemplateLiteral', {
        pattern: String(),
      }),
      Type('This', {
        $ref: String(),
      }),
      Type('Tuple', {
        items: Option(Array(Schema)),
        additionalItems: Option(Boolean()),
        minItems: Number(),
        maxItems: Number(),
      }),
      Type('Undefined'),
      Type('Union', {
        anyOf: Array(Schema),
      }),
      Type('Uint8Array', {
        minByteLength: Option(Number()),
        maxByteLength: Option(Number()),
      }),
      Type('Unknown'),
      Type('Void'),
    ]

    const NativeTypeKind = nativeTypes.map(T => T.kindSchema!)
    const UnknownType = Object({}, {
      kindSchema: Intersect([String(), Not(Union(NativeTypeKind))]),
    })

    return Union([...nativeTypes, UnknownType])
  }, options) as any
