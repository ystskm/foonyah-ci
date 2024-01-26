/**
 * [foonyah-ci] foonyahTest
 * The test feature
 * テストを作成するクラス
 * (c) 2012-2024 Yoshitaka Sakamoto <sakamoto@startup-cloud.co.jp> 
 * All right reserved.
 * Licensed under Synquery Commercial License.
 *  + Startup Cloud Commercial License. 
 */
(()=>{
  
  const NULL = null, TRUE = true, FALSE = false, UNDEF = undefined;
  let protos;
  // foonyahTest.prototype
  Object.assign(foonyahTest.prototype, protos = { 
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
  });
  module.exports = foonyahTest;
  function foonyahTest(nm, sw, rsl, rej) {
    const t = this;
    t.name = nm;
    t.suite = sw;
    t.box = sw.results[ nm ];
    t.resolve = rsl;
    t.reject = rej;
    Object.keys(protos).forEach(n=>{
      t[ n.substr(1) ] = function() { return t[n].apply(t, arguments); }; // _ok => ok mappings
      // !! IMPORTANT !! DONNOT USE ARROW FUNCTION FOR USE "arguments"
    });
  }

  // ---
  // foonyahTest.prototype
  function T_out(msg, typ) {
    const t = this, sw = t.suite;
    const sig = { time: new Date(), type: typ || 'out', msg };
    t.box.assert.push(sig);
    if(typ === FALSE) {
      // (2024.01.23 sakamoto) ok に入れていないケースは ok を増やす必要がある。
      t.box.ok.push(sig);
    }
    return sig;
  }
  function T_err(msg) {
    const t = this, sw = t.suite;
    t.box.ng.push(t.out(msg, 'err'));
  }
  function T_ok(j, msg, ty) {
    const t = this, sw = t.suite;
    const sig = t.out({ type: ty || 'ok', write: msg });
    t.box[ j === TRUE ? 'ok': 'ng' ].push(sig);
  }
  function T_eq(actual, expected, msg) {
    const t = this, sw = t.suite, j = actual == expected;
    const write = [ j ? '': 'Error!', msg, j ? '': `(actual=${actual}, expected=${expected})` ].join('');
    t.ok(j, write, 'equals');
  }
  function T_same(actual, expected, msg) {
    const t = this, sw = t.suite, j = actual === expected;
    const write = [ j ? '': 'Error!', msg, j ? '': `(actual=${actual}, expected=${expected})` ].join('');
    t.ok(j, write, 'same');
  }
  function T_expect(n, msg) {
    const t = this, sw = t.suite;
    if(t.expected != NULL) {
      t.fail('already expected');
    }
    t.expected = { n, msg };
  }
  function T_done(msg) {
    const t = this, sw = t.suite;
    if(t.expected != NULL) {
      t.equal(t.box.assert.length, t.expected.n, t.expected.msg);
    }
    if(msg != NULL) {
      t.out(msg, FALSE); // => ok の数も増やす
    }
    t.resolve();
  }
  function T_fail(e) {
    const t = this, sw = t.suite;
    t.err(e);
    t.reject(e);
  }

  // ---
  function outLog() {
    console.log.apply(console, _args(arguments));
  }
  function _args(a) {
    const args = Array.from(a);
    args.unshift(`${new Date().toGMTString()} - [foonyah-ci:foonyahTest.js]`);
    return args;
  }
  
})( );
