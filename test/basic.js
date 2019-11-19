/***/
var nodeunit = require('foonyah-ci');
module.exports = nodeunit.testCase({
  'methods': function(t) {

    var fncs = ['done', 'fail', 'ok', 'eq', 'equals', 'deepEqual', 'deepEquals', 'same', 'expect'];
    t.eq(fncs.length, 9, 'foonyah-ci have 9 interfaces for test');
    fncs.forEach(k=>{
      t.eq(typeof t[k], 'function');
    });
    t.done();

  }
}, 'basic.js');
