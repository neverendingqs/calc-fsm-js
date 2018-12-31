const CfsmBase = require('./cfsmBase');
const { ops } = require('./enum');
const opValues = Object.values(ops);

function intArrayToFloat(a) {
  return parseFloat(a.join(''));
}

class Cfsm extends CfsmBase{
  calculate() {
    const expression = this.history.slice(1, -1);

    for(let i = 0; i < opValues.length; i++) {
      const op = opValues[i];
      const opIndex = expression.indexOf(op);

      if(opIndex !== -1) {
        const left = intArrayToFloat(expression.slice(0, opIndex));
        const right = intArrayToFloat(expression.slice(opIndex + 1));

        switch(expression[opIndex]) {
          case ops.ADD:
            return left + right;

          case ops.SUBTRACT:
            return left - right;

          case ops.MULTIPLY:
            return left * right;

          case ops.DIVIDE:
            return left / right;

          default:
            throw new Error('Unsupported operator. Please implement.');
        }
      }
    }

    throw new Error('Inconsistent state. Please debug.');
  }
}

module.exports = Cfsm;
