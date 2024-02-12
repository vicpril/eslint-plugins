/**
 * @fileoverview Check absolute imports in FSD
 * @author vicpril
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/path-checker"),
  RuleTester = require("eslint").RuleTester;


//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({ parserOptions: { ecmaVersion: 6, sourceType: "module" } });
ruleTester.run("path-checker", rule, {
  valid: [{
    filename: '/home/vic/_study/bomberman/src/frontend/widgets/AddCommentForm/ui/AddCommentForm/AddCommentForm.tsx',
    code: "import { getCommentFormText } from '../../model/selectors/getCommentFormText'",
    errors: [],
    options: [
      { alias: '@', srcPath: 'src/frontend' },
    ]
  },],

  invalid: [
    {
      filename: '/home/vic/_study/bomberman/src/frontend/widgets/AddCommentForm/ui/AddCommentForm/AddCommentForm.tsx',
      code: "import { getCommentFormText } from '@/widgets/AddCommentForm/model/selectors/getCommentFormText'",
      errors: [{ message: "В рамках одного слайса все пути должны быть относительными" }],
      options: [
        { alias: '@', srcPath: 'src/frontend' },
      ]
    },
    {
      filename: '/home/vic/_study/bomberman/src/frontend/widgets/AddCommentForm/ui/AddCommentForm/AddCommentForm.tsx',
      code: "import { getCommentFormText } from 'widgets/AddCommentForm/model/selectors/getCommentFormText'",
      errors: [{ message: "В рамках одного слайса все пути должны быть относительными" }],
      options: [
        { srcPath: 'src/frontend' },
      ]
    },
  ],
});
