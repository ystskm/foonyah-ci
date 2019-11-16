foonyah-ci
-

#### Simplest test framework dedicated by nodeunit
Nodeunit (https://github.com/caolan/nodeunit#nodeunit) is very simple and worth architecture for test but 
it has already been a DEPRECATED PROJECT. That is why I made foonyah-ci.

Install
-

To install the most recent release from npm, run:

    npm install foonyah-ci

Usage
-


#### runner
```
// test-suites, root-directory and timeout for each suite
require('foonyah-ci').run(['basic'], __dirname, 5000 + 100 * 800);
```


#### executor (e.g. basic.js)
```
var ci = require('foonyah-ci');
module.exports = ci.testCase({
  '_': function(t) {

    db = new Mongodb( [env.host, env.port].join(':') );

    db.drop(env.databaseName, function(er, r) {
      console.log('drop:', arguments);
      if(er)
        console.warn('Drop error. Already dropped?');
      console.log(er, r);
      t.ok(true, 'Initializing Successfully.');
      t.done();
    });

  }
})
```

  
API
-

#### t.ok(j, msg)

#### t.eq(actual, expected, msg)

#### t.same(actual, expected, msg)

#### t.expect(n, msg)

#### t.done(msg)

#### t.fail(msg)

Change Log
-

- 2019/11/15

    0.0.1 release
    first commit
