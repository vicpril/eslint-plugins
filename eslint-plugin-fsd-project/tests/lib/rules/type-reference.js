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

ruleTester.run("type-reference", rule, {
  valid: [
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
