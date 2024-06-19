/**
 * @fileoverview type-reference
 * @author vicpril
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const mocha = require("mocha")
const RuleTester = require("@typescript-eslint/rule-tester")

const rule = require("../../../lib/rules/type-reference")

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

RuleTester.RuleTester.afterAll = mocha.after;

const ruleTester = new RuleTester.RuleTester({
  parser: '@typescript-eslint/parser',
});

const options = [
  {
    alias: '@',
    ignoreModules: ['Shared']
  }
]

const codeWithImportedEnums = `
import type { InjectionKey } from 'vue'
import type { TEST, SomeElse } from '../models/schema/test'
import type { TEST } from '../models/schema/test'
export const ListViewSlug: InjectionKey<string> = Symbol('ListViewSlug')
const useEnum: TEST.BlaBLa
`

const codeWithDeclaredEnums = `
  const qwe = 123

  type SchemaText = BaseFilter & {
    type: TYPE.TEXT
    meta: MetaSchema
    default_value: string
  }

  enum TYPE {
    TEXT = 'text',
    SELECT = 'select'
  }

`


ruleTester.run("type-reference", rule, {
  valid: [
    {
      filename: '/home/vic/thesis/BILET/BVB-CRM_FRONT/src/index.ts',
      code: codeWithDeclaredEnums,
      errors: [],
      options: options,
    },
    {
      filename: '/home/vic/thesis/BILET/BVB-CRM_FRONT/src/features/ListView/components/ListView.vue',
      code: "type ColumnBoolean = ListView.Schema.Table.BaseColumn",
      errors: [],
      options: options,
    },
    {
      filename: '/home/vic/thesis/BILET/BVB-CRM_FRONT/src/features/ListView/components/ListView.vue',
      code: "type ColumnBoolean = Shared.Schema.Table.BaseColumn",
      errors: [],
      options: options,
    },
    {
      filename: '/home/vic/thesis/BILET/BVB-CRM_FRONT/src/features/ListView/components/ListView.vue',
      code: codeWithImportedEnums,
      errors: [],
      options: options,
    },
    {
      filename: '/home/vic/thesis/BILET/BVB-CRM_FRONT/src/features/ListView/components/ListView.vue',
      code: codeWithDeclaredEnums,
      errors: [],
      options: options,
    },
  ],

  invalid: [
    {
      filename: '/home/vic/thesis/BILET/BVB-CRM_FRONT/src/features/DetailsView/components/DetailsView.vue',
      code: "type ColumnBoolean = ListView.Schema.Table.BaseColumn",
      errors: [{message: "Запрещено использовать глобальные типы из других слайсов (entities, features, widgets, pages, app)"}],
      options: options,
    },
    {
      filename: '/home/vic/thesis/BILET/BVB-CRM_FRONT/src/features/DetailsView/components/DetailsView.vue',
      code: "type ColumnBoolean = Shared.Schema.Table.BaseColumn",
      errors: [{message: "Запрещено использовать глобальные типы из других слайсов (entities, features, widgets, pages, app)"}],
      options: [],
    },
  ],
});
