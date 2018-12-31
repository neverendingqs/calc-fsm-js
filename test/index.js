const assert = require('chai').assert;

const Cfsm = require('../lib/');
const { digits, ops, START, END } = require('../lib/enum');
const digitsKeys = Object.values(digits);

describe('calc-fsm', function() {
  beforeEach(function() {
    this.cfsm = new Cfsm;
  });

  describe('managing state', function() {
    it('can transition from number to number', function() {
      digitsKeys.forEach( i => this.cfsm.toDigit(i) );
      assert.sameOrderedMembers(
        this.cfsm.history,
        [START, ...digitsKeys]
      );
    });

    it('can transition from number to op', function() {
      this.cfsm.toDigit(digits.zero);
      this.cfsm.toOp(ops.ADD);
      assert.sameOrderedMembers(
        this.cfsm.history,
        [START, digits.zero, ops.ADD]
      );
    });

    it('can transition from op to number', function() {
      this.cfsm.toDigit(digits.zero);
      this.cfsm.toOp(ops.ADD);
      this.cfsm.toDigit(digits.one);
      assert.sameOrderedMembers(
        this.cfsm.history,
        [START, digits.zero, ops.ADD, digits.one]
      );
    });

    it('can transition frop number to \'end\'', function() {
      this.cfsm.toDigit(digits.nine);
      this.cfsm.end();
      assert.sameOrderedMembers(
        this.cfsm.history,
        [START, digits.nine, END]
      );
    });
  });

  describe('it can calculate expressions', function() {
    it('can add', function() {
      this.cfsm.toDigit(digits.one);
      this.cfsm.toOp(ops.ADD);
      this.cfsm.toDigit(digits.one);
      this.cfsm.end();
      
      const sum = this.cfsm.calculate();
      assert.equal(sum, 2);
    });


    it('can subtract', function() {
      this.cfsm.toDigit(digits.one);
      this.cfsm.toDigit(digits.five)
      this.cfsm.toOp(ops.SUBTRACT);
      this.cfsm.toDigit(digits.three);
      this.cfsm.end();
      
      const difference = this.cfsm.calculate();
      assert.equal(difference, 12);
    });


    it('can multply', function() {
      this.cfsm.toDigit(digits.three);
      this.cfsm.toOp(ops.MULTIPLY);
      this.cfsm.toDigit(digits.nine);
      this.cfsm.end();
      
      const product = this.cfsm.calculate();
      assert.equal(product, 27);
    });


    it('can divide', function() {
      this.cfsm.toDigit(digits.three);
      this.cfsm.toDigit(digits.seven);
      this.cfsm.toDigit(digits.eight);
      this.cfsm.toOp(ops.DIVIDE);
      this.cfsm.toDigit(digits.two);
      this.cfsm.end();
      
      const quotient = this.cfsm.calculate();
      assert.equal(quotient, 189);
    });
  });
});
