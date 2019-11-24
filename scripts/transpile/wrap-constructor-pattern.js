
const t = require('@babel/types');

const buildIIFEClass = function (constructorPath, methodPaths) {
  const className = constructorPath.get('id.name').node;

  const methods = methodPaths.map((methodPath) => methodPath.node);

  const body = t.blockStatement(
    [constructorPath.node]
      .concat(methods)
      .concat(t.returnStatement(
        t.identifier(className),
      )),
  );

  return t.variableDeclaration(
    'var',
    [
      t.variableDeclarator(
        t.identifier(className),
        t.callExpression(
          t.functionExpression(
            null,
            [],
            body,
          ),
          [],
        ),
      ),
    ],
  );
};

/*
  before
  function _Set() {}
  _Set.prototype.add = function(item) { ... };
  _Set.prototype.has = function(item) { ... };
  after
  var _Set = (function(){
    function _Set() {}
    _Set.prototype.add = function(item) { ... };
    _Set.prototype.has = function(item) { ... };
    return _Set;
  }())
*/
const functionDeclarationVisitor = function (path) {
  if (!path.getStatementParent().parentPath.isProgram()) {
    return;
  }

  const maybeClassName = path.get('id.name').node;

  const methodPaths = path.getAllNextSiblings().filter((sibling) => {
    if (!sibling.isExpressionStatement()) {
      return false;
    }

    const expression = sibling.get('expression');

    if (!expression.isAssignmentExpression()) {
      return false;
    }

    const left = expression.get('left');

    if (!left.isMemberExpression()) {
      return false;
    }

    const leftObject = left.get('object');

    if (!leftObject.isMemberExpression()) {
      return false;
    }

    return leftObject.get('object').isIdentifier({ name: maybeClassName })
        && leftObject.get('property').isIdentifier({ name: 'prototype' });
  });

  if (methodPaths.length === 0) {
    return;
  }

  path.replaceWith(buildIIFEClass(path, methodPaths));
  methodPaths.forEach((methodPath) => {
    methodPath.remove();
  });
};

module.exports = function () {
  return {
    visitor: {
      FunctionDeclaration: functionDeclarationVisitor,
    },
  };
};
