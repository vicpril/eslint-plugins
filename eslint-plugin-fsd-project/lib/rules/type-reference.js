/**
 * @fileoverview layer-imports
 * @author vicpril
 */
"use strict";

const path = require('path');
const { getNormalPath } = require('../helpers');
// const { ESLintUtils, TSTypeReference } = require('@typescript-eslint/utils')

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------


/** @type {import('eslint').Rule.RuleModule} */
/** @type {import('@typescript-eslint/utils')} */
module.exports = {
  meta: {
    type: 'problem', // `problem`, `suggestion`, or `layout`
    docs: {
      description: "Check correct types modules using",
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
          ignoreModules: {
            type: 'array',
          },
        }
      }
    ], // Add a schema if the rule has options
    messages: {
      shouldBeCorrectLayerForType: 'Запрещено использовать глобальные типы из других слайсов (entities, features, widgets, pages, app)',
    }
  },

  create(context) {
    const {
      alias = '', 
      srcPath = 'src',
      ignoreModules = [],
    } = context.options[0] || {}

    const availableLayers = {
      'app': 'app',
      'entities': 'entities',
      'features': 'features',
      'shared': 'shared',
      'pages': 'pages',
      'widgets': 'widgets',
    }

    //----------------------------------------------------------------------
    // Helpers
    //----------------------------------------------------------------------

    // any helper functions should go here or else delete this section

    const getCurrentFileLayerAndSlice = (filePath) => {
      const normalizedPath = getNormalPath(filePath)
      const projectPath = normalizedPath?.split(srcPath)[1]
      const segments = projectPath?.split('/')
      return {
        fileLayer: segments?.[1],
        fileSlice: segments?.[2]
      }
    }

    const idChainedTypeReferenceNode = (node) => {
      if (node.type === 'TSTypeReference' && node.typeName?.left && node.typeName?.right) return true
      return false
    }

    const getTypeReferenceFirstChain = (node) => {
      if (!node.typeName?.left) return
      let identifier = node.typeName.left
      while (identifier.left) {
        identifier = identifier.left
      }
      return identifier.name
    }

    //----------------------------------------------------------------------
    // Public
    //----------------------------------------------------------------------
        
    const currentFilePath = context.getFilename()
    const {fileLayer, fileSlice} = getCurrentFileLayerAndSlice(currentFilePath)

    const ignoreIdentifiers = new Set(ignoreModules)
    
    const nodesForCheck = new Map() // {node, firstChain}
    
    return {
      ImportDeclaration(node) {
        if (!availableLayers[fileLayer]) return;
        if (node.importKind === "type") {
          node.specifiers?.forEach(specifier => {
            if(specifier.local.name) ignoreIdentifiers.add(specifier.local.name)
          }
        )}
      },
      TSEnumDeclaration(node) {
        if (!availableLayers[fileLayer]) return;
        ignoreIdentifiers.add(node.id.name)
      },
      TSTypeReference(node) {
        if (!availableLayers[fileLayer]) return;

        if (idChainedTypeReferenceNode(node)) {
          const firstChain = getTypeReferenceFirstChain(node)

          if (firstChain !== fileSlice) {
            nodesForCheck.set(node, firstChain)
          }
        }
      },
      'Program:exit'() {
        for (const [node, firstChain] of nodesForCheck.entries()) {
          if (!ignoreIdentifiers.has(firstChain)) {
            context.report({node, messageId: 'shouldBeCorrectLayerForType'})
          }
        }
      },

    };
  },
};
