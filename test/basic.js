/**
 * [foonyah-ci/test] basic.js
 * 基礎的なモジュールテスト
 */
const ci = require('foonyah-ci');
module.exports = ci.testCase({
  'README': t=>{
    
    t.ok(true, 'start test');
    setTimeout(()=>{ t.equals(1, 1, 'async ok'); t.done(); }, 3000);
    
  },
  'methods': t=>{

    const fncs = ['done', 'fail', 'ok', 'eq', 'equals', 'deepEqual', 'deepEquals', 'same', 'expect'];
    t.eq(fncs.length, 9, 'foonyah-ci have 9 interfaces for test');
    fncs.forEach(k=>t.eq(typeof t[k], 'function'));
    t.done();

  }
}, 'basic.js');
