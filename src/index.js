const replaceProperties = ['reduce', 'map', 'filter', 'forEach'];

export default function({ types: t }) {
  return {
    visitor: {
      CallExpression(path) {
        var callee = path.node.callee;
        if (!t.isMemberExpression(callee)) {
          return;
        }
        var property = callee.property;
        if (t.isIdentifier(property)
          && replaceProperties.indexOf(property.name) >= 0) {
            path.replaceWith(t.callExpression(
              property,
              [callee.object].concat(path.node.arguments)
            ));
          }
      }
    }
  };
}
