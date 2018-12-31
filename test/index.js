const assert = require('chai').assert;

const Cfsm = require('../lib/');
const { digits, ops, START, END } = require('../lib/enum');
const digitsKeys = Object.values(digits);

describe('calc-fsm', function() {
  beforeEach(function() {
    this.cfsm = new Cfsm
  });

  describe('toDigit()', function() {
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
});
