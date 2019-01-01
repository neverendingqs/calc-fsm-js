const assert = require('chai').assert;

const Cfsm = require('../lib/');
const { digits, ops, END } = require('../lib/enum');
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
        [digits.ZERO, ...digitsKeys]
      );
    });

    it('can transition from number to op', function() {
      this.cfsm.toDigit(digits.THREE);
      this.cfsm.toOp(ops.ADD);
      assert.sameOrderedMembers(
        this.cfsm.history,
        [digits.ZERO, digits.THREE, ops.ADD]
      );
    });

    it('can transition from op to number', function() {
      this.cfsm.toDigit(digits.TWO);
      this.cfsm.toOp(ops.ADD);
      this.cfsm.toDigit(digits.ONE);
      assert.sameOrderedMembers(
        this.cfsm.history,
        [digits.ZERO, digits.TWO, ops.ADD, digits.ONE]
      );
    });

    it('can transition frop number to \'end\'', function() {
      this.cfsm.toDigit(digits.NINE);
      this.cfsm.end();
      assert.sameOrderedMembers(
        this.cfsm.history,
        [digits.ZERO, digits.NINE, END]
      );
    });
  });

  describe('it can calculate expressions', function() {
    it('can add', function() {
      this.cfsm.toDigit(digits.ONE);
      this.cfsm.toOp(ops.ADD);
      this.cfsm.toDigit(digits.ONE);
      this.cfsm.end();
      
      const sum = this.cfsm.calculate();
      assert.equal(sum, 2);
    });


    it('can subtract', function() {
      this.cfsm.toDigit(digits.ONE);
      this.cfsm.toDigit(digits.FIVE)
      this.cfsm.toOp(ops.SUBTRACT);
      this.cfsm.toDigit(digits.THREE);
      this.cfsm.end();
      
      const difference = this.cfsm.calculate();
      assert.equal(difference, 12);
    });


    it('can multiply', function() {
      this.cfsm.toDigit(digits.THREE);
      this.cfsm.toOp(ops.MULTIPLY);
      this.cfsm.toDigit(digits.NINE);
      this.cfsm.end();
      
      const product = this.cfsm.calculate();
      assert.equal(product, 27);
    });


    it('can divide', function() {
      this.cfsm.toDigit(digits.THREE);
      this.cfsm.toDigit(digits.SEVEN);
      this.cfsm.toDigit(digits.EIGHT);
      this.cfsm.toOp(ops.DIVIDE);
      this.cfsm.toDigit(digits.TWO);
      this.cfsm.end();
      
      const quotient = this.cfsm.calculate();
      assert.equal(quotient, 189);
    });

    it('can handle the same digits in tandem', function() {
      this.cfsm.toDigit(digits.ONE);
      this.cfsm.toDigit(digits.ONE);
      this.cfsm.toOp(ops.ADD);
      this.cfsm.toDigit(digits.ONE);
      this.cfsm.end();

      const sum = this.cfsm.calculate();
      assert.equal(sum, 12);
    });

    it('returns value when no operator is present', function() {
      this.cfsm.toDigit(digits.FOUR);
      this.cfsm.toDigit(digits.SEVEN);
      this.cfsm.end();

      const value = this.cfsm.calculate();
      assert.equal(value, 47);
    });

    it('handles floats', function() {
      this.cfsm.toDigit(digits.ONE);
      this.cfsm.toOp(ops.DIVIDE);
      this.cfsm.toDigit(digits.THREE);
      this.cfsm.end();

      const value = this.cfsm.calculate();
      assert.equal(value, 1 / 3);
    });

    it('handles expressions with multiple operators', function() {
      this.cfsm.toDigit(digits.ONE);
      this.cfsm.toDigit(digits.ONE);
      // 11
      this.cfsm.toOp(ops.DIVIDE);
      this.cfsm.toDigit(digits.THREE);
      // 3 + (2 / 3)
      this.cfsm.toOp(ops.ADD);
      this.cfsm.toDigit(digits.SIX);
      // 9 + (2 / 3)
      this.cfsm.end();

      const value = this.cfsm.calculate();
      assert.equal(value, 9 + (2 / 3));
    });
  });
});
