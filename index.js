const complexity = require('eslint/lib/rules/complexity');

function reduxComplexity() {
  return {
    ...complexity,
    create: context => {
      const api = complexity.create(context);
      return {
        ...api,
        SwitchCase: node => {
          api.FunctionDeclaration(node);
        },
        'SwitchCase:exit': node => {
          api['FunctionDeclaration:exit'](node);
        },
      };
    },
  };
}

const attrName = name => attr => (attr.name ? attr.name.name === name : false);
const attrNames = names => attr => (attr.name ? names.includes(attr.name.name) : false);

function requireAttributes() {
  return {
    create: context => {
      const config = context.options[0] || {};
      const { required, tags, props } = config;
      const attrProps = attrNames(props);
      const attrRequired = attrNames(required);
      return {
        JSXOpeningElement(node) {
          const isTag = Array.isArray(tags) && tags.includes(node.name.name);
          const isProps = Array.isArray(props) && node.attributes.find(attrProps);
          if (isTag || isProps) {
            if (!node.attributes.some(attrRequired)) {
              context.report({
                node: node.name,
                message: 'no "testID" prop',
              });
            }
          }
        },
      };
    },
  };
}

module.exports = {
  rules: {
    'redux-complexity': reduxComplexity(),
    'require-attributes': requireAttributes(),
  },
};
