const CfsmBase = require('./cfsmBase');
const { ops } = require('./enum');
const opsSet = new Set(Object.values(ops));

function getLastOp(expression) {
  for(let i = expression.length - 1; i >= 0; i--) {
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
  const { op, opIndex } = getLastOp(expression);
  if(!opIndex) {
    return intArrayToFloat(expression);
  }

  const right = intArrayToFloat(expression.slice(opIndex + 1));
  const left = calculate(expression.slice(0, opIndex));

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

class Cfsm extends CfsmBase {
  calculate() {
    super.end();
    const expression = this.history.slice(0, -1);
    return calculate(expression);
  }

  reset() {
    super.clearHistory();
    super.reset();
  }
}

module.exports = Cfsm;
