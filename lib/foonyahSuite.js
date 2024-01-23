/**
 * [foonyah-ci] foonyahSuite
 * The test feature
 * テストスイートを作成するクラス
 * (c) 2012-2024 Yoshitaka Sakamoto <sakamoto@startup-cloud.co.jp> 
 * All right reserved.
 * Licensed under Synquery Commercial License.
 *  + Startup Cloud Commercial License. 
 */
(()=>{
  
  const NULL = null, TRUE = true, FALSE = false, UNDEF = undefined;
  const foonyahTest = foonyahSuite.test = require('./foonyahTest');
  module.exports = foonyahSuite;
  function foonyahSuite(objects, fileName) {
    
    const sw = this;
    sw.fileName = fileName || 'unknown';
    sw.results = {
      
    };
    sw.proc = Promise.resolve().then(()=>{
      sw.s_time = Date.now();
    });
    Object.keys(objects).forEach(testName=>{
      const testFunc = objects[testName];
      // (2024.01.23 sakamoto) t.assert や t.done などメッセージを残すだけの時はテスト結果数に含めないようにする。
      const box = sw.results[ testName ] = { assert: [ ], ok: [ ], ng: [ ] };
      sw.proc = sw.proc.then(()=>{
        outLog(`foonyahSuite execute: ${testName}@${sw.fileName}`);
        return new Promise((rsl, rej)=>{
          
          // async / await available in the test if test func is with async description
          const t = new foonyahTest(testName, sw, rsl, rej);
          Promise.resolve( testFunc( t ) )['catch']( e=>t.fail(e) );
          
        }).then(()=>{
          console.log(`[done] test "${testName}".`);
        })['catch'](e=>{
          console.log(`[fail] test "${testName}".`, e);
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
    let summary, n_as = 0, n_ok = 0, n_ng = 0;
    sw.e_time = Date.now();
    sw.w_time = sw.e_time - sw.s_time;
    Object.keys(sw.results).forEach(testName=>{
      
      const box = sw.results[testName];
      n_as += box.assert.length;
      n_ok += box.ok.length;
      n_ng += box.ng.length;
      
    });
    sw.ratio = parseInt(n_ok / n_as * 10000) / 100;
    summary = `${sw.w_time}ms, ${sw.ratio}% [${n_ok}/${n_as}], fail=${n_ng}${sw.ratio == 100 ? ' perfect!': ''}`;
    // show all asserts
    Object.keys(sw.results).forEach(testName=>{
      
      const box = sw.results[testName];
      box.assert.forEach((sig, as_idx)=>{
        let msg = sig.msg || { };
        let idx = '[' + ('     ' + (as_idx % 100000)).substr(-5) + ']';
        let tim = sig.time ? String((sig.time.getTime() - sw.s_time) % 100000 / 1000).split('.'): [ ];
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
    const args = Array.from(a);
    args.unshift(`${new Date().toGMTString()} - [foonyah-ci:foonyahSuite]`);
    return args;
  }
  
})( );
