/**
 * @fileoverview layer-imports
 * @author vicpril
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/layer-imports"),
  RuleTester = require("eslint").RuleTester;


//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parserOptions: {ecmaVersion: 6, sourceType: 'module'}
});

const aliasOptions = [
  {
    alias: '@'
  }
]
const aliasOptionsFront = [
  {
    alias: '@',
    srcPath: 'src/frontend'
  }
]

ruleTester.run("layer-imports", rule, {
  valid: [
    {
      filename: '/home/vic/_study/bomberman/src/game/server-side/routes.ts',
      code: "import { Socket } from 'socket.io'",
      errors: [],
      options: aliasOptionsFront,
    },
    {
      filename: '/home/vic/_study/bomberman/src/frontend/pages/ArticlesPage/ui/ArticlesPage/ArticlesPage.tsx',
      code: "import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch/useAppDispatch'",
      errors: [],
      options: aliasOptionsFront,
    },
    {
      filename: 'C:\\Users\\tim\\Desktop\\javascript\\production_project\\src\\features\\Article',
      code: "import { addCommentFormActions, addCommentFormReducer } from '@/shared/Button.tsx'",
      errors: [],
      options: aliasOptions,
    },
    {
      filename: 'C:\\Users\\tim\\Desktop\\javascript\\production_project\\src\\features\\Article',
      code: "import { addCommentFormActions, addCommentFormReducer } from '@/entities/Article'",
      errors: [],
      options: aliasOptions,
    },
    {
      filename: 'C:\\Users\\tim\\Desktop\\javascript\\production_project\\src\\app\\providers',
      code: "import { addCommentFormActions, addCommentFormReducer } from '@/widgets/Articl'",
      errors: [],
      options: aliasOptions,
    },
    {
      filename: 'C:\\Users\\tim\\Desktop\\javascript\\production_project\\src\\widgets\\pages',
      code: "import { useLocation } from 'react-router-dom'",
      errors: [],
      options: aliasOptions,
    },
    {
      filename: 'C:\\Users\\tim\\Desktop\\javascript\\production_project\\src\\app\\providers',
      code: "import { addCommentFormActions, addCommentFormReducer } from 'redux'",
      errors: [],
      options: aliasOptions,
    },
    {
      filename: 'C:\\Users\\tim\\Desktop\\javascript\\production_project\\src\\index.tsx',
      code: "import { StoreProvider } from '@/app/providers/StoreProvider';",
      errors: [],
      options: aliasOptions,
    },
    {
      filename: 'C:\\Users\\tim\\Desktop\\javascript\\production_project\\src\\entities\\Article.tsx',
      code: "import { StateSchema } from '@/app/providers/StoreProvider'",
      errors: [],
      options: [
        {
          alias: '@',
          ignoreImportPatterns: ['**/StoreProvider']
        }
      ],
    },
    {
      filename: 'C:\\Users\\tim\\Desktop\\javascript\\production_project\\src\\features\\User\\components\\User.tsx',
      code: "import { addCommentFormActions, addCommentFormReducer } from '@/features/Article'",
      errors: [],
      options: [
        {
          alias: '@',
          ignoreImportPatterns: ['**/StoreProvider'],
          customLayerRules: {'features': ['shared', 'entities', 'features'],}
        }
      ],
    },
  ],

  invalid: [
    {
      filename: 'F:\\test\\src\\shared\\api\\old\\apiWrapper.ts',
      code: 'import { useAuthStore } from "@/entities/Auth";',
      errors: [{ message: "Слой может импортировать в себя только нижележащие слои (shared, entities, features, widgets, pages, app)"}],
      options: aliasOptions,
    },
    {
      filename: 'C:\\Users\\tim\\Desktop\\javascript\\production_project\\src\\entities\\providers',
      code: "import { addCommentFormActions, addCommentFormReducer } from '@/features/Articl'",
      errors: [{ message: "Слой может импортировать в себя только нижележащие слои (shared, entities, features, widgets, pages, app)"}],
      options: aliasOptions,
    },
    {
      filename: 'C:\\Users\\tim\\Desktop\\javascript\\production_project\\src\\features\\providers',
      code: "import { addCommentFormActions, addCommentFormReducer } from '@/widgets/Articl'",
      errors: [{ message: "Слой может импортировать в себя только нижележащие слои (shared, entities, features, widgets, pages, app)"}],
      options: aliasOptions,
    },
    {
      filename: 'C:\\Users\\tim\\Desktop\\javascript\\production_project\\src\\entities\\providers',
      code: "import { addCommentFormActions, addCommentFormReducer } from '@/widgets/Articl'",
      errors: [{ message: "Слой может импортировать в себя только нижележащие слои (shared, entities, features, widgets, pages, app)"}],
      options: aliasOptions,
    },
  ],
});
