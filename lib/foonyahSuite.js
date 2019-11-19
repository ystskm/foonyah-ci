/***/
// [foonyah-ci] foonyahSuite
// The test feature
// (c) 2012-2019 Yoshitaka Sakamoto <sakamoto@startup-cloud.co.jp> 
// All right reserved.
// Licensed under Liberty Technology Commercial License. 
//  + Startup Cloud Commercial License. 
// 
(function() {
  
  var NULL = null, TRUE = true, FALSE = false, UNDEF = undefined;
  var foonyahTest = foonyahSuite.test = require('./foonyahTest');
  module.exports = foonyahSuite;
  function foonyahSuite(objects, fileName) {
    
    var sw = this;
    sw.fileName = fileName || 'unknown';
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
      return Sw_testSummary('done', sw);
    })['catch'](e=>{
      return Sw_testSummary('fail', sw, e);
    }).then(()=>sw);
    
  }
  function Sw_testSummary(endingType, sw) {
    var summary, n_as = 0, n_ok = 0, n_ng = 0;
    sw.e_time = Date.now();
    sw.w_time = sw.e_time - sw.s_time;
    Object.keys(sw.results).forEach(testName=>{
      
      var box = sw.results[testName];
      n_as += box.assert.length;
      n_ok += box.ok.length;
      n_ng += box.ng.length;
      
    });
    sw.ratio = parseInt(n_ok / n_as * 10000) / 100;
    summary = sw.w_time + 'ms, ' + sw.ratio + '% [' + n_ok + '/' + n_as  + '], fail=' + n_ng + (sw.ratio == 100 ? ' perfect!': '');
    // show all asserts
    Object.keys(sw.results).forEach(testName=>{
      
      var box = sw.results[testName];
      box.assert.forEach((sig, as_idx)=>{
        var msg = sig.msg || { };
        var idx = '[' + ('     ' + (as_idx % 100000)).substr(-5) + ']';
        var tim = sig.time ? String((sig.time.getTime() - sw.s_time) % 100000 / 1000).split('.'): [ ];
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
