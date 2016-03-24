const replaceProperties = ['reduce', 'map', 'filter', 'forEach'];
const arrayReturn = ['map', 'filter'];
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

function isObjectCaller(t, property) {
  return t.isIdentifier(property)
    && property
    && replaceProperties.indexOf(property.name) >= 0;
}

function isFunctionTypeCastCaller(t, path, prop) {
  return t.isTypeCastExpression(path.parentPath.node)
    && !prop;
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

      CallExpression: {

        exit(path) {
          var annotation;
          var property = path.get('callee.property').node;
          if (!isObjectCaller(t, property)) {
            return;
          }

          var identifierPath = path.get("callee.object", true);
          if (!identifierPath.isNodeType("Identifier")
            && !identifierPath.isNodeType("TypeCastExpression")) {
              return;
          }

          annotation = identifierPath.getTypeAnnotation();

          if (!isArrayType(t, annotation)) {
            return;
          }
          var oldName = property.name;
          property.name = prefix + property.name;
          var callee = path.node.callee;
          var expression = t.callExpression(
            property,
            [callee.object].concat(path.node.arguments)
          );
          usedMethods[oldName] = true;
          if (arrayReturn.indexOf(oldName) >= 0) {
            path.replaceWith(t.typeCastExpression(
              expression,
              t.arrayTypeAnnotation('Any')
            ));
          } else {
            path.replaceWith(expression);
          }
        }
      }
    }
  };
}
