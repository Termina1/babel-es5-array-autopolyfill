const replaceProperties = ['reduce', 'map', 'filter', 'forEach'];
const arrayReturn = ['map', 'filter', 'concat', 'slice', 'sort', 'splice'];
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
  return t.isIdentifier(property) && property;
}

function isReplacable(name) {
  return replaceProperties.indexOf(name) >= 0
}

function isArrayReturn(name) {
  return arrayReturn.indexOf(name) >= 0
}

function isObjectKeysExpression(path, prop) {
  return path.node.name === 'Object'
    && prop.name === 'keys'
    && !path.scope.getBinding('Object');
}

function replaceObjectKeys(t, path, property, usedMethods) {
  usedMethods[property.name] = true;
  property.name = prefix + property.name;
  path.replaceWith(t.typeCastExpression(
    t.callExpression(
      property,
      path.node.arguments
    ),
    t.arrayTypeAnnotation(t.identifier('String'))
  ));
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

          var callee = path.node.callee;

          if (isObjectKeysExpression(identifierPath, property)) {
            return replaceObjectKeys(t, path, property, usedMethods);
          }

          annotation = identifierPath.getTypeAnnotation();

          if (!isArrayType(t, annotation)) {
            return;
          }

          if (isArrayReturn(property.name)
            && !isReplacable(property.name)
            && !t.isTypeCastExpression(path.parentPath.node)) {
              path.replaceWith(t.typeCastExpression(
                t.callExpression(
                  callee,
                  path.node.arguments
                ),
                t.arrayTypeAnnotation(t.identifier('Any'))
              ));
              return;
          }

          if (!isReplacable(property.name)) {
            return;
          }

          var oldName = property.name;
          property.name = prefix + property.name;

          var expression = t.callExpression(
            property,
            [callee.object].concat(path.node.arguments)
          );

          usedMethods[oldName] = true;
          if (arrayReturn.indexOf(oldName) >= 0) {
            path.replaceWith(t.typeCastExpression(
              expression,
              t.arrayTypeAnnotation(t.identifier('Any'))
            ));
          } else {
            path.replaceWith(expression);
          }
        }
      }
    }
  };
}
