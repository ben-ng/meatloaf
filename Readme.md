# Meatloaf

Generate an SLR parse table from a CFG.

[![Build Status](https://travis-ci.org/ben-ng/meatloaf.svg?branch=master)](https://travis-ci.org/ben-ng/meatloaf)

[![browser support](https://ci.testling.com/ben-ng/meatloaf.png)
](https://ci.testling.com/ben-ng/meatloaf)

## Usage

```javascript
var meatloaf = require('meatloaf')
var grammar = {
  nonTerminals: ['S', 'A', 'B']
, terminals: ['a', 'b', '-1']
, rules: [
    ['S', ['A']]
  , ['A', ['a', 'A']]
  , ['A', ['b', 'B']]
  , ['B', ['b']]
  ]
}

var parseTable = meatloaf(grammar)
```

Output:

```text
┌───────┬─────────────────┬───────────────┬───────────┬─────────────┬─────────────┐
│       │ a               │ b             │ -1        │ A           │ B           |
├───────┼─────────────────┼───────────────┼───────────┼─────────────┼─────────────┤
│ A,C,F │ [["s","C,D,F"]] │ [["s","G,I"]] │ []        │ [["g","B"]] │ []          |
├───────┼─────────────────┼───────────────┼───────────┼─────────────┼─────────────┤
│ G,I   │ []              │ [["s","J"]]   │ []        │ []          │ [["g","H"]] |
├───────┼─────────────────┼───────────────┼───────────┼─────────────┼─────────────┤
│ J     │ []              │ []            │ [["r",3]] │ []          │ []          |
├───────┼─────────────────┼───────────────┼───────────┼─────────────┼─────────────┤
│ H     │ []              │ []            │ [["r",2]] │ []          │ []          |
├───────┼─────────────────┼───────────────┼───────────┼─────────────┼─────────────┤
│ C,D,F │ [["s","C,D,F"]] │ [["s","G,I"]] │ []        │ [["g","E"]] │ []          |
├───────┼─────────────────┼───────────────┼───────────┼─────────────┼─────────────┤
│ E     │ []              │ []            │ [["r",1]] │ []          │ []          |
├───────┼─────────────────┼───────────────┼───────────┼─────────────┼─────────────┤
│ B     │ []              │ []            │ [["a"]]   │ []          │ []          |
└───────┴─────────────────┴───────────────┴───────────┴─────────────┴─────────────┘
```

## Features

 * 100% statement and branch coverage
 * Does *one* thing: it generates a parse table, leaving the conflicts to *you* to resolve
 * Comes with a pretty ASCII table generator so you can easily visualize tables
 * Names DFA states using comma-delimited NFA states for easier debugging

## Table Structure

`parseTable` is an object keyed by state. Each value is an object keyed by symbol.

```javascript
parseTable = {
  'A,C,F': {a:[inst, inst], b:[inst] /* etc... */}
, 'G,I': {}
  /* etc... */
}
```

Each `inst` (instruction) is a tuple `[action, destination]` with possible values:

 * Shift: `['s', state]`
 * Go: `['g', state]`
 * Reduce: `['r', i]`, where `grammar.rules[i]` is the matched production
 * Accept: `['a']`

If there are multiple instructions for a single state/symbol. Then you have a conflict and need to resolve it. Empty arrays mean that no transition is possible from that state via that symbol.

## Visualizing Tables

**You need to install `devDependencies` for this feature.**

The included table2string function outputs an ASCII table for easier debugging.

```javascript
// The output of this command can be seen in the "Usage" section of this Readme
var table2string = require('beefalo/lib/table2string')
console.log(table2string(parseTable))
```

 * Each row represents a DFA state
 * Columns are the symbols in the grammar
 * DFA states are combinations of NFA states, delimited by commas
