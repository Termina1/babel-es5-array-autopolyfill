const replaceProperties = ['reduce', 'map', 'filter', 'forEach'];
const prefix = "es5";

export default function({ types: t }) {
  var usedMethods = {};
  return {
    visitor: {
      Program: {
        enter(path) {
         usedMethods = {};
        },
        exit(path, state) {
          const libName = state.opts.polyfill;
          var methods = Object.keys(usedMethods).sort();
          if (methods.length === 0) {
            return;
          }

          var specifiers = methods.map(el =>
            t.importSpecifier(
              t.identifier(prefix + el),
              t.identifier(el)
            )
          );

          var importDecl = t.importDeclaration(specifiers, t.stringLiteral(libName));

          path.node.body = [importDecl].concat(path.node.body);
        }
      },

      CallExpression(path) {
        var callee = path.node.callee;
        if (!t.isMemberExpression(callee)) {
          return;
        }
        var property = callee.property;
        if (t.isIdentifier(property)
          && replaceProperties.indexOf(property.name) >= 0) {
            usedMethods[property.name] = true;
            property.name = prefix + property.name;
            path.replaceWith(t.callExpression(
              property,
              [callee.object].concat(path.node.arguments)
            ));
          }
      }
    }
  };
}
