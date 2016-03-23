const replaceProperties = ['reduce', 'map', 'filter', 'forEach'];
const prefix = "es5";

function isArrayType(t, node) {
  if (t.isArrayTypeAnnotation(node)) {
    return true;
  }

  if (t.isGenericTypeAnnotation(node) && node.id.name === 'Array') {
    return true;
  }

  return false;
}

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
        var identifierPath = path.get("callee.object", true);

        if (!identifierPath.isNodeType("Identifier")
          && !identifierPath.isNodeType("TypeCastExpression")) {
            return;
        }

        var annotation = identifierPath.getTypeAnnotation();
        if (!isArrayType(t, annotation)) {
          return;
        }

        var property = path.get('callee.property').node;
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
