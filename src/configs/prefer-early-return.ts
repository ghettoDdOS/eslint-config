import type { TypedFlatConfigItem } from '../types'

const defaultMaximumStatements = 1

const pluginPreferEarlyReturn = {
  rules: {
    'prefer-early-return': {
      create(context: any) {
        const options = context.options[0] || {
          maximumStatements: defaultMaximumStatements,
        }
        const maxStatements = options.maximumStatements

        function isLonelyIfStatement(statement: any): any {
          return statement.type === 'IfStatement' && statement.alternate == null
        }

        function isOffendingConsequent(consequent: any): any {
          return (
            (consequent.type === 'ExpressionStatement' && maxStatements === 0)
            || (consequent.type === 'BlockStatement'
              && consequent.body.length > maxStatements)
          )
        }

        function isOffendingIfStatement(statement: any): any {
          return (
            isLonelyIfStatement(statement)
            && isOffendingConsequent(statement.consequent)
          )
        }

        function hasSimplifiableConditionalBody(functionBody: any): any {
          const body = functionBody.body
          return (
            functionBody.type === 'BlockStatement'
            && body.length === 1
            && isOffendingIfStatement(body[0])
          )
        }

        function checkFunctionBody(functionNode: any): any {
          const body = functionNode.body

          if (hasSimplifiableConditionalBody(body)) {
            context.report(
              body,
              'Prefer an early return to a conditionally-wrapped function body',
            )
          }
        }

        return {
          ArrowFunctionExpression: checkFunctionBody,
          FunctionDeclaration: checkFunctionBody,
          FunctionExpression: checkFunctionBody,
        }
      },

      meta: {
        docs: {
          category: 'Best Practices',
          description:
            'Prefer early returns over full-body conditional wrapping in function declarations.',
          recommended: false,
          uri: 'https://github.com/Shopify/web-configs/blob/main/packages/eslint-plugin/docs/rules/prefer-early-return.md',
        },
        schema: [
          {
            additionalProperties: false,
            properties: {
              maximumStatements: {
                type: 'integer',
              },
            },
            type: 'object',
          },
        ],
      },
    },
  },
}

export async function preferEarlyReturn(): Promise<TypedFlatConfigItem[]> {
  return [
    {
      name: 'prefer-early-return/rules',
      plugins: {
        'prefer-early-return': pluginPreferEarlyReturn,
      },
      rules: {
        'prefer-early-return/prefer-early-return': 'error',
      },
    },
  ]
}
