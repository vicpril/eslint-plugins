/**
 * @fileoverview layer-imports
 * @author vicpril
 */
"use strict";

const path = require('path');
const micromatch = require("micromatch");
const { isPathRelative, getNormalPath } = require('../helpers');

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem', // `problem`, `suggestion`, or `layout`
    docs: {
      description: "Check correct layer imports",
      recommended: false,
      url: null, // URL to the documentation page for this rule
    },
    fixable: null, // Or `code` or `whitespace`
    schema: [
      {
        type: 'object',
        properties: {
          alias: {
            type: 'string',
          },
          srcPath: {
            type: 'string'
          },
          ignoreImportPatterns: {
            type: 'array',
          },
          // es: {'features': ['shared', 'entities']}
          customLayerRules: {
            type: 'object',
          }
        }
      }
    ], // Add a schema if the rule has options
    messages: {
      shouldBeCorrectLayer: 'Слой может импортировать в себя только нижележащие слои (shared, entities, features, widgets, pages, app)',
    }
  },

  create(context) {
    const {
      alias = '', 
      srcPath = 'src',
      ignoreImportPatterns = [],
      customLayerRules = {}
    } = context.options[0] || {}

    const layersRules = {
      'app': ['pages', 'widgets', 'features', 'shared', 'entities'],
      'pages': ['widgets', 'features', 'shared', 'entities'],
      'widgets': ['features', 'shared', 'entities'],
      'features': ['shared', 'entities'],
      'entities': ['shared', 'entities'],
      'shared': ['shared'],
      ...customLayerRules
    }

    const availableImportLayers = {
      'app': 'app',
      'entities': 'entities',
      'features': 'features',
      'shared': 'shared',
      'pages': 'pages',
      'widgets': 'widgets',
    }

    const getCurrentFileLayer = (filePath) => {
      const normalizedPath = getNormalPath(filePath)
      const projectPath = normalizedPath?.split(srcPath)[1]
      const segments = projectPath?.split('/')

      return segments?.[1];

    }

    const getCurrentImportLayer = (value) => {
      const importPath = alias ? value.replace(`${alias}/`, '') : value;
      const segments = importPath?.split('/')
      return segments?.[0]
    }
    // variables should be defined here

    //----------------------------------------------------------------------
    // Helpers
    //----------------------------------------------------------------------

    // any helper functions should go here or else delete this section

    //----------------------------------------------------------------------
    // Public
    //----------------------------------------------------------------------

    return {
      ImportDeclaration(node) {
        const currentFilePath = context.filename
        const fileLayer = getCurrentFileLayer(currentFilePath)

        const importPath = node.source.value
        const importLayer = getCurrentImportLayer(importPath)

        if (isPathRelative(importPath)) {
          return;
        }

        if (!availableImportLayers[importLayer] || !availableImportLayers[fileLayer]) {
          return;
        }

        const isIgnored = ignoreImportPatterns.some(pattern => {
          return micromatch.isMatch(importPath, pattern)
        })

        if (isIgnored) {
          return;
        }

        if (!layersRules[fileLayer]?.includes(importLayer)) {
          context.report({node, messageId: 'shouldBeCorrectLayer'})
        }
        
      }
    };
  },
};
