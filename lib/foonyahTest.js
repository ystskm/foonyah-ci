// [foonyah-ci] foonyahTest
// The test feature
// (c) 2012-2019 Yoshitaka Sakamoto <sakamoto@startup-cloud.co.jp> 
// All right reserved.
// Licensed under Liberty Technology Commercial License. 
//  + Startup Cloud Commercial License. 
// 
(function() {
  
  var NULL = null, TRUE = true, FALSE = false, UNDEF = undefined;
  var protos;
  // foonyahTest.prototype
  Object.keys(protos = { 
    _ok: T_ok,
    _eq: T_eq,
    _equal: T_eq,
    _equals: T_eq,
    _deepEqual: T_same,
    _deepEquals: T_same,
    _same: T_same,
    _expect: T_expect,
    _done: T_done,
    _fail: T_fail,
    _out: T_out,
    _err: T_err
  }).forEach(k=>foonyahTest.prototype[k] = protos[k]);
  module.exports = foonyahTest;
  function foonyahTest(nm, sw, rsl, rej) {
    var t = this;
    t.name = nm;
    t.suite = sw;
    t.box = sw.results[ nm ];
    t.resolve = rsl;
    t.reject = rej;
    Object.keys(protos).forEach(function(n) {
      t[ n.substr(1) ] = function() { return t[n].apply(t, arguments); }; // _ok => ok mappings
    });
  }
  // ----- 
  // foonyahTest.prototype
  function T_out(msg, ty) {
    var t = this, sw = t.suite;
    var sig = { time: new Date(), type: ty || 'out', msg: msg };
    t.box.assert.push(sig);
    return sig;
  }
  function T_err(msg) {
    var t = this, sw = t.suite;
    t.box.ng.push(t.out(msg, 'err'));
  }
  function T_ok(j, msg, ty) {
    var t = this, sw = t.suite;
    var sig = t.out({ type: ty || 'ok', write: msg });
    t.box[j === TRUE ? 'ok': 'ng'].push(sig);
  }
  function T_eq(actual, expected, msg) {
    var t = this, sw = t.suite, j = actual == expected;
    var write = [j ? '': 'Error!', msg, j ? '': '(actual=' + actual + ', expected=' + expected + ')'].join('');
    t.ok(j, write, 'equals');
  }
  function T_same(actual, expected, msg) {
    var t = this, sw = t.suite, j = actual === expected;
    var write = [j ? '': 'Error!', msg, j ? '': '(actual=' + actual + ', expected=' + expected + ')'].join('');
    t.ok(j, write, 'same');
  }
  function T_expect(n, msg) {
    var t = this, sw = t.suite;
    if(t.expected != NULL)
      t.fail('already expected');
    t.expected = { n: n, msg: msg };
  }
  function T_done(msg) {
    var t = this, sw = t.suite;
    if(t.expected != NULL) {
      t.equal(t.box.assert.length, t.expected.n, t.expected.msg);
    }
    if(msg != NULL) {
      t.out(msg);
    }
    t.resolve();
  }
  function T_fail(e) {
    var t = this, sw = t.suite;
    t.err(e);
    t.reject(e);
  }

  // ----- //
  function outLog() {
    console.log.apply(console, _args(arguments));
  }
  function _args(a) {
    var args = Array.from(a);
    args.unshift(new Date().toGMTString() + ' - [foonyah-ci:foonyahSuite]');
    return args;
  }
  
})( );
