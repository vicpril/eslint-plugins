/**
 * @fileoverview descr
 * @author public-api-imports
 */
"use strict";
// const path = require('path')
const { isPathRelative } = require('../helpers')
const micromatch = require("micromatch");
const path = require('path')

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem', // `problem`, `suggestion`, or `layout`
    docs: {
      description: "Check public api imports in FSD",
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
          testFilesPatterns: {
            type: 'array'
          }
        }
      }
    ], // Add a schema if the rule has options
    messages: {
      shouldBePublicApi: 'Абсолютный импорт разрешен только из Public API (index.ts)',
      shouldBeTestingApi: 'Тестовые данные необходимо импортировать из publicApi/testing.ts'
    }
  },

  create(context) {
    const { 
      alias = '', 
      testFilesPatterns = []
    } = context.options[0] || {}

    const checkingLayers = {
      'entities': 'entities',
      'features': 'features',
      'pages': 'pages',
      'widgets': 'widgets',
    }

    return {
      ImportDeclaration(node) {
        // example entities/Article
        const value = node.source.value
        const importTo = alias ? value.replace(`${alias}/`, '') : value;

        if (isPathRelative(importTo)) {
          return false
        }
      
        // [entities, article, model, types]
        const segments = importTo.split('/')
        const layer = segments[0] //entities

        if(!checkingLayers[layer]) {
          return;
        }

        const isImportNotFromPublicApi = segments.length > 2;

        // [entities, article, testing]
        const isTestingPublicApi = segments[2] === 'testing' && segments.length < 4

        if(isImportNotFromPublicApi && !isTestingPublicApi) {
          context.report({node, messageId: 'shouldBePublicApi'});
        }

        if(isTestingPublicApi) {
          const currentFilePath = context.getFilename();
          const normalizedPath = path.toNamespacedPath(currentFilePath);
          // const srcFrom = normalizedPath.split(srcPath)[1]


          const isCurrentFileTesting = testFilesPatterns.some(
              pattern => micromatch.isMatch(normalizedPath, pattern)
          )

          if(!isCurrentFileTesting) {
            context.report({node, messageId: 'shouldBeTestingApi'});
          }
        }
      }
    };
  },
};
