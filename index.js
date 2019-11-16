/***/
// [[foonyah-ci]]
// The test feature
// (c) 2012-2019 Yoshitaka Sakamoto <sakamoto@startup-cloud.co.jp> 
// All right reserved.
// Licensed under Liberty Technology Commercial License. 
//  + Startup Cloud Commercial License. 
// 
(function() {
  
  var NULL = null, TRUE = true, FALSE = false, UNDEF = undefined;
  var g = global, fs = require('fs');
  foonyahCI.run = CI_run;
  foonyahCI.testCase = CI_testCase;
  foonyahCI.suite = foonyahSuite;
  foonyahCI.test = foonyahTest;
  var protos;
  
  // foonyahCI.prototpe
  Object.keys(protos = { 
    timeoutError: C_timeoutError
  }).forEach(k=>foonyahCI.prototype[k] = protos[k]);
  
  // foonyahTest.prototype
  Object.keys(protos = { 
    ok: T_ok,
    eq: T_eq,
    equals: T_eq,
    deepEquals: T_same,
    same: T_same,
    expect: T_expect,
    done: T_done,
    fail: T_fail,
    out: T_out,
    err: T_err
  }).forEach(k=>foonyahTest.prototype[k] = protos[k]);
  
  module.exports = foonyahCI;
  function foonyahCI(filenames, directory, timeout) {
    
    var ci = this;
    ci.cwd_org = process.cwd();
    process.chdir(ci.cwd = directory);
    ci.proc = Promise.resolve();
    [ ].concat(filenames).forEach(fp=>{
      ci.proc = ci.proc.then(sw=>{
        
        outLog('foonyahCI require: ' + fp, ci.cwd);
        var racers = [ ];
        racers.push(new Promise( (rsl, rej)=>{
          timeout = timeout || 10000;
          ci.timer = setTimeout(()=>{ ci.timeoutError(); rej('timeout (' + timeout + 'ms)') }, timeout = timeout || 10000);
        }) );
        racers.push( (async function() {
          await require(ci.cwd + '/' + fp + '.js'); // function testCase is called and the return have to be a promise.
        })() );
        return Promise.race(racers);
        
      }).then(sw=>{
        if(ci.timer != NULL) clearTimeout(ci.timer);
        if(sw && sw.error.length !== 0) throw 'Error suite: ' + sw.fileName; // => Immediately fail summary and finish test.
      })['catch'](e=>{
        if(ci.timer != NULL) clearTimeout(ci.timer);
        throw e;
      });
    });
    ci.proc['catch'](e=>{
      outLog('Terminated reason?', e);
    }).then(()=>{
      
      process.chdir(ci.cwd_org);
      process.exit();
      // => force exit if any handler remains
      
    });
    
  }
  function foonyahSuite(objects) {
    
    var sw = this;
    sw.fileName = __filename.split('/').pop();
    sw.results = {
      
    };
    sw.proc = Promise.resolve().then(()=>{
      sw.s_time = Date.now();
    });
    Object.keys(objects).forEach(testName=>{
      var testFunc = objects[testName];
      var box = sw.results[ testName ] = { assert: [ ], ok: [ ], ng: [ ] };
      sw.proc = sw.proc.then(()=>{
        outLog('foonyahSuite execute: ' + testName + '@' + sw.fileName);
        return new Promise((rsl, rej)=>{
          
          // async / await available in the test if test func is with async description
          var t = new foonyahTest(testName, sw, rsl, rej);
          Promise.resolve( testFunc( t ) )['catch']( e=>t.fail(e) );
          
        }).then(()=>{
          console.log('[done] test "' + testName + '".');
        })['catch'](e=>{
          console.log('[fail] test "' + testName + '".', e);
          // throw e;
        });
      });
    });
    sw.proc = sw.proc.then(()=>{
      return CI_testSummary('done', sw);
    })['catch'](e=>{
      return CI_testSummary('fail', sw, e);
    }).then(()=>sw);
    
  }
  function foonyahTest(nm, sw, rsl, rej) {
    var t = this;
    t.name = nm;
    t.suite = sw;
    t.box = sw.results[ nm ];
    t.resolve = rsl;
    t.reject = rej;
  }
  function CI_run(filenames, directory, timeout) {
    var ci = this;
    if(!(ci instanceof foonyahCI)) {
      return ( new foonyahCI(filenames, directory, timeout) ).proc;
    }
  }
  function CI_testCase(objects) {
    var ci = this;
    if(!(ci instanceof foonyahSuite)) {
      return ( new foonyahSuite(objects) ).proc;
    }
  }
  function CI_testSummary(endingType, sw) {
    var summary, n_as = 0, n_ok = 0, n_ng = 0;
    sw.e_time = Date.now();
    sw.w_time = sw.e_time - sw.s_time;
    Object.values(sw.results).forEach(box=>{
      n_as += box.assert.length;
      n_ok += box.ok.length;
      n_ng += box.ng.length;
    });
    sw.ratio = parseInt(n_ok / n_as * 10000) / 100;
    summary = sw.w_time + 'ms, ' + sw.ratio + '% [' + n_ok + '/' + n_as  + '], fail=' + n_ng + (sw.ratio == 100 ? ' perfect!': '');
    // show all asserts
    Object.values(sw.results).forEach(box=>{
      box.assert.forEach((sig, as_idx)=>{
        var msg = sig.msg || { };
        var idx = '[' + ('     ' + (as_idx % 100000)).substr(-5) + ']';
        var tim = sig.time ? String((sig.time.getTime() - sw.s_time) % 100000 / 100).split('.'): [ ];
        if(tim.length) {
          tim = '[' + [ ('   ' + (tim[0] || 0)).substr(-3), ((tim[1] || 0) + '000').substr(0, 3) ].join('.') + ']';
        } else {
          tim = '';
        }
        switch(msg.type) {
        
        case 'err':
        case 'error':
          console.log('\t' + idx + tim, msg);
          break;
          
        default:
          if(msg.write == NULL) return;
          console.log('\t' + idx + tim + '[' + msg.type + ']', msg.write);
          
        }
      });
    });
    // show summary
    console.log('--------------------------');
    console.log(' [' + sw.fileName + '] Summary on Node:' + process.version + ', Arch:' + process.arch);
    console.log([ ' ' + new Date().toGMTString(), sw.fileName + ' (' + summary + ')' ].join(' - '));
    console.log('--------------------------');
    // show errors
    Object.keys(sw.results).forEach(testName=>{
      sw.results[ testName ].ng.forEach((sig, er_idx)=>{
        console.log(' failed#' + (er_idx + 1) + '@' + testName + ' - ', sig.msg);
      });
    });
  }
  
  // -----
  // foonyahCI.prototype
  function C_timeoutError() {
    
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
    args.unshift(new Date().toGMTString() + ' - [foonyah-ci]');
    return args;
  }
  
})();