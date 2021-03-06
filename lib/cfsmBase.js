const StateMachine = require('javascript-state-machine');
const StateMachineHistory = require('javascript-state-machine/lib/history')

const { digits, ops, END } = require('./enum');
const digitsKeys = Object.values(digits);
const opsKeys = Object.values(ops);

const CfsmBase = StateMachine.factory({
  init: digits.ZERO,
  transitions: [
    { name: 'toDigit', from: [...digitsKeys, ...opsKeys], to: n => n },
    { name: 'toOp', from: digitsKeys, to: op => op },
    { name: 'end', from: digitsKeys, to: END },
    { name: 'reset', from: '*', to: digits.ZERO }
  ],
  methods: {
    /*
    ...digitsKeys.reduce((acc, n) => { acc[`on${n}`] = () => console.log(n); return acc; }, {} ),
    ...opsKeys.reduce((acc, op) => { acc[`on${op}`] = () => console.log(op); return acc; }, {} )
    */
  },
  plugins: [ new StateMachineHistory() ],
  observeUnchangedState: true
});

module.exports = CfsmBase;
