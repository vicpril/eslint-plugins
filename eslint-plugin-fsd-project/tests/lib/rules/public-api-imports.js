/**
 * @fileoverview descr
 * @author public-api-imports
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/public-api-imports"),
  RuleTester = require("eslint").RuleTester;


//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({ parserOptions: { ecmaVersion: 6, sourceType: "module" } });

const aliasOptions = [
  {
    alias: '@'
  }
]

ruleTester.run("public-api-imports", rule, {
  valid: [
    {
      code: "import { addCommentFormActions, addCommentFormReducer } from '../../model/slices/addCommentFormSlice'",
      errors: [],
    },
    {
      code: "import { addCommentFormActions, addCommentFormReducer } from '@/entities/Article'",
      errors: [],
      options: aliasOptions,
    },
    {
      code: "import { addCommentFormActions, addCommentFormReducer } from '@/shared/Article/model/file.ts'",
      errors: [],
      options: aliasOptions,
    },
    {
      filename: '/home/vic/_study/bomberman/src/frontend/entities/file.test.ts',
      code: "import { addCommentFormActions, addCommentFormReducer } from '@/entities/Article/testing'",
      errors: [],
      options: [{
        alias: '@',
        testFilesPatterns: ['**/*.test.ts', '**/*.test.tsx', '**/StoreDecorator.tsx']
      }],
    },
    {
      filename: '/home/vic/_study/bomberman/src/frontend/shared/config/storybook/StoreDecorator.tsx',
      code: "import { addCommentFormActions, addCommentFormReducer } from '@/entities/Article/testing'",
      errors: [],
      options: [{
        alias: '@',
        testFilesPatterns: ['**/*.test.ts', '**/*.test.tsx', '**/StoreDecorator.tsx']
      }],
    },
    {
      filename: '/home/vic/_study/bomberman/src/frontend/pages/ProfilePage/ui/ProfilePage.test.tsx',
      code: "import { profileUpdateReducer } from '@/features/ProfileEdit/testing'",
      errors: [],
      options: [{
        alias: '@',
        testFilesPatterns: ['**/*.test.ts', '**/*.test.tsx', '**/StoreDecorator.tsx']
      }],
    }
  ],

  invalid: [
    {
      code: "import { addCommentFormActions, addCommentFormReducer } from '@/entities/Article/model/file.ts'",
      errors: [{ message: "Абсолютный импорт разрешен только из Public API (index.ts)"}],
      options: aliasOptions,
    },
    {
      filename: '/home/vic/_study/bomberman/src/frontend/entities/StoreDecorator.tsx',
      code: "import { addCommentFormActions, addCommentFormReducer } from '@/entities/Article/testing/file.tsx'",
      errors: [{message: 'Абсолютный импорт разрешен только из Public API (index.ts)'}],
      options: [{
        alias: '@',
        testFilesPatterns: ['**/*.test.ts', '**/*.test.tsx', '**/StoreDecorator.tsx']
      }],
    },
    {
      filename: '/home/vic/_study/bomberman/src/frontend/entities/forbidden.ts',
      code: "import { addCommentFormActions, addCommentFormReducer } from '@/entities/Article/testing'",
      errors: [{message: 'Тестовые данные необходимо импортировать из publicApi/testing.ts'}],
      options: [{
        alias: '@',
        testFilesPatterns: ['**/*.test.ts', '**/*.test.tsx', '**/StoreDecorator.tsx']
      }],
    }
  ],
});
