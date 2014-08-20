var test = require('tape')

test('readme', function (t) {
  t.plan(1)

  var meatloaf = require('../')
    , table2string = require('../lib/table2string')
    , grammar
    , parseTable

  grammar = {
    nonTerminals: ['S', 'A', 'B']
  , terminals: ['a', 'b', '-1']
  , rules: [
      ['S', ['A']]
    , ['A', ['a', 'A']]
    , ['A', ['b', 'B']]
    , ['B', ['b']]
    ]
  }

  parseTable = meatloaf(grammar)

  t.ok(table2string(parseTable))
})
