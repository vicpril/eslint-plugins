/**
 * @fileoverview Check absolute imports in FSD
 * @author vicpril
 */
"use strict";

const path = require('path')

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem', // `problem`, `suggestion`, or `layout`
    docs: {
      description: "Check absolute imports in FSD",
      recommended: false,
      url: null, // URL to the documentation page for this rule
    },
    fixable: null, // Or `code` or `whitespace`
    schema: [
      {
        type: 'object',
        properties: {
          alias: {
            type: 'string'
          },
          srcPath: {
            type: 'string'
          },
        }
      }
    ], // Add a schema if the rule has options
    messages: {
      shouldBeRalative: 'В рамках одного слайса все пути должны быть относительными'
    }
  },

  create(context) {
    const alias = context.options[0]?.alias || '';
    const srcPath = context.options[0]?.srcPath || 'src';

    return {
      ImportDeclaration(node) {
        // example entities/Article
        const value = node.source.value
        const importTo = alias ? value.replace(`${alias}/`, '') : value;

        // example /home/vic/study/bomberman/src/frontend/pages/ArticlesDetailPage/ui/ArticlesDetailPage/ArticlesDetailPage.tsx
        const fromFilename = context.getFilename();

        if (shouldBeRelative(fromFilename, importTo, srcPath)) {
          context.report({node, messageId: 'shouldBeRalative'})
        }
      }
    };
  },
};


/**
 * @param {string} path 
 * @returns {boolean}
 */
function isPathRelative (path) {
  return path === '.' || path.startsWith('./') || path.startsWith('../')
}

const layers = {
  'entities': 'entities',
  'features': 'features',
  'shared': 'shared',
  'pages': 'pages',
  'widgets': 'widgets',
}

/**
 * 
 * @param {string} from 
 * @param {string} to 
 * @returns {boolean}
 */
function shouldBeRelative (from, to, srcPath = 'src') {
  if (isPathRelative(to)) {
    return false
  }

  // example entities/Article
  const toArray = to.split('/')
  const toLayer = toArray[0] //entities
  const toSlice = toArray[1] //Article

  if (!toLayer || !toSlice || !layers[toLayer]) {
    return false
  }

  // example /home/vic/study/bomberman/src/frontend/pages/ArticlesDetailPage/ui/ArticlesDetailPage/ArticlesDetailPage.tsx
  const normalizedPath = path.toNamespacedPath(from)
  const srcFrom = normalizedPath.split(srcPath)[1]

  if (!srcFrom) {
    return false
  }

  const fromArray = srcFrom.split('/')

  const fromLayer = fromArray[1]
  const fromSlice = fromArray[2]

  if (!fromLayer || !fromSlice || !layers[fromLayer]) {
    return false
  }

  if (fromLayer === 'shared' && fromLayer === 'shared') {
    return false
  }

  return fromSlice === toSlice && fromLayer === toLayer
}


// console.log(shouldBeRelative('/home/vic/study/bomberman/src/frontend/shared/ui/Text/Text.stories.tsx', '@/shared/ui/Text/Text'))
// console.log(shouldBeRelative('/home/vic/study/bomberman/src/frontend/pages/ArticlesPage/ui/ArticlesPage/ArticlesPage.tsx', '@/pages/ArticlesPage/model/services/fetchArticlesList/fetchArticlesList'))
// console.log(shouldBeRelative('/home/vic/study/bomberman/src/frontend/pages/Article/ui/ArticlesDetailPage/', '@/pages/Article/fasfasfas'))
// console.log(shouldBeRelative('C:\\Users\\tim\\Desktop\\javascript\\GOOD_COURSE_test\\src\\frontend\\entities\\Article', '@/entities/ASdasd/fasfasfas'))
// console.log(shouldBeRelative('C:\\Users\\tim\\Desktop\\javascript\\GOOD_COURSE_test\\src\\frontend\\entities\\Article', '@/features/Article/fasfasfas'))
// console.log(shouldBeRelative('C:\\Users\\tim\\Desktop\\javascript\\GOOD_COURSE_test\\src\\frontend\\features\\Article', '@/features/Article/fasfasfas'))
// console.log(shouldBeRelative('C:\\Users\\tim\\Desktop\\javascript\\GOOD_COURSE_test\\src\\frontend\\entities\\Article', '@/app/index.tsx'))
// console.log(shouldBeRelative('C:/Users/tim/Desktop/javascript/GOOD_COURSE_test/src/frontend/entities/Article', '@/entities/Article/asfasf/asfasf'))
// console.log(shouldBeRelative('C:\\Users\\tim\\Desktop\\javascript\\GOOD_COURSE_test\\src\\frontend\\entities\\Article', '../../model/selectors/getSidebarItems'))

