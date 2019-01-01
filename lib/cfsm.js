const CfsmBase = require('./cfsmBase');
const { ops } = require('./enum');
const opsSet = new Set(Object.values(ops));

function getFirstOp(expression) {
  for(let i = 0; i < expression.length; i++) {
    if(opsSet.has(expression[i])) {
      return { op: expression[i], opIndex: i }
    }
  }

  return {};
}

function intArrayToFloat(a) {
  return parseFloat(a.join(''));
}

function calculate(expression) {
  const { op, opIndex } = getFirstOp(expression);

  if(!op) {
    return intArrayToFloat(expression);
  }

  const left = intArrayToFloat(expression.slice(0, opIndex));
  const right = intArrayToFloat(expression.slice(opIndex + 1));

  switch(op) {
    case ops.ADD:
      return left + right;

    case ops.SUBTRACT:
      return left - right;

    case ops.MULTIPLY:
      return left * right;

    case ops.DIVIDE:
      return left / right;

    default:
      throw new Error(`Unsupported operator '${op}'.`);
  }
}

class Cfsm extends CfsmBase{
  calculate() {
    const expression = this.history.slice(0, -1);
    return calculate(expression);
  }
}

module.exports = Cfsm;
