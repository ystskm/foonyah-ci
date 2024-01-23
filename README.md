# foonyah-ci

[![Rank](https://nodei.co/npm/foonyah-ci.png?downloads=true&amp;downloadRank=true&amp;stars=true)](https://nodei.co/npm/foonyah-ci/)  
[![Version](https://badge.fury.io/js/foonyah-ci.png)](https://npmjs.org/package/foonyah-ci)
[![Build status](https://travis-ci.org/ystskm/foonyah-ci.png)](https://travis-ci.org/ystskm/foonyah-ci)  

#### Simplest test framework dedicated to nodeunit
Nodeunit (https://github.com/caolan/nodeunit#nodeunit) is very simple and worth architecture for test but 
it has already been a DEPRECATED PROJECT. That is why I made foonyah-ci.

## Install


To install the most recent release from npm, run:

    npm install foonyah-ci

## Usage

#### runner
```
// test-suites, root-directory and timeout for each suite
require('foonyah-ci').run(['basic'], __dirname, 5000);
```


#### executor (e.g. basic.js)
```
module.exports = require('foonyah-ci').testCase({
  'README': function(t) {

    t.ok(true, 'start test');
    setTimeout(()=>{ t.equals(1, 1, 'async ok'); t.done(); }, 3000);

  }
}, 'basic.js');
```

#### the result example
```console
$ npm test

> foonyah-ci@0.1.0 test /root/foonyah-ci
> node test/_runner.js

Tue, 19 Nov 2019 14:27:52 GMT - [foonyah-ci] foonyahCI require: basic /root/foonyah-ci/test
Tue, 19 Nov 2019 14:27:52 GMT - [foonyah-ci:foonyahSuite] foonyahSuite execute: README@basic.js
[done] test "README".
  [    0][  0.001][ok] start test
  [    1][  3.007][equals] async ok
--------------------------
 [basic.js] Summary on Node:v12.13.0, Arch:x64
 Tue, 19 Nov 2019 14:27:55 GMT - basic.js (3007ms, 100% [2/2], fail=0 perfect!)
--------------------------
```
  
## API

#### t.ok(j, msg)

#### t.eq(actual, expected, msg)
- alias: t.equals

#### t.same(actual, expected, msg)
- alias: t.deepEquals

#### t.expect(n, msg)

#### t.done(msg)

#### t.fail(msg)

## Change Log

- 2024/01/23

    0.1.2 release
    fix counting

- 2019/11/19

    0.1.0 release
    start recursive ci
    
- 2019/11/16

    0.0.2 release
    first commit
