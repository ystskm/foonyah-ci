/**
 * [foonyah-ci] fonnyahCI.js
 * パッケージのメインモジュール
 */
(g=>{
  
  console.log('NOW, LOADING THE LATEST MODULE!');
  const NULL = null, TRUE = true, FALSE = false, UNDEF = undefined;
  Object.assign(foonyahCI, {
    run: CI_run,
    testCase: CI_testCase
  });
  
  const foonyahSuite = foonyahCI.suite = require('./foonyahSuite');
  const Default = {
    Timeout: 10000
  };
  let protos;
  // foonyahCI.prototpe
  Object.assign(foonyahCI.prototype, protos = { 
    timeoutError: C_timeoutError
  });

  module.exports = foonyahCI;
  function foonyahCI(filenames, directory, timeout) {
    
    const ci = this;
    let failure = NULL;
    ci.cwd_org = process.cwd();
    ci.cwd = directory;
    // (2024.01.24 sakamoto) Bad change
    // process.chdir(ci.cwd = directory);
    ci.proc = Promise.resolve();
    [ ].concat(filenames).forEach(fp=>{
      ci.proc = ci.proc.then(sw=>{
        
        outLog('foonyahCI require: ' + fp, ci.cwd);
        const racers = [ ];
        racers.push(new Promise((rsl, rej)=>{
          ci.timer = setTimeout(()=>{ ci.timeoutError(); rej(`timeout (${timeout}ms)`) }, timeout = timeout || Default.Timeout);
        }));
        const suite = require(`${ci.cwd}/${fp}.js`);
        // (2023.01.24 sakamoto) どうやら（確信ではないが） suite が new で execute されていると、require コマンドが完了せずに npm コマンドが全面的に動作しなくなる。
        // => 関係がなかった。
        racers.push( Promise.resolve().then(()=>suite.execute()) );
        // function testCase is called and the return have to be a promise.
        return Promise.race(racers);
        
      }).then(a=>{
        const sw = a[1];
        if(ci.timer != NULL) clearTimeout(ci.timer);
        if(sw && sw.ng.length !== 0) throw `Error suite: ${sw.fileName}`; // => Immediately fail summary and finish test.
      })['catch'](e=>{
        if(ci.timer != NULL) clearTimeout(ci.timer);
        throw e;
      });
    });
    ci.proc['catch'](e=>{
      outLog('Terminated reason?', failure = e);
    }).then(()=>{
      
      process.chdir(ci.cwd_org);
      process.exit(failure ? 1: 0);
      // => force exit if any handler remains
      
    });
    
  }

  function CI_run(filenames, directory, timeout) {
    const ci = this;
    if(!(ci instanceof foonyahCI)) {
      return ( new foonyahCI(filenames, directory, timeout) ).proc;
    }
  }
  function CI_testCase(objects, fileName) {
    const ci = this;
    if(!(ci instanceof foonyahSuite)) {
      return ( new foonyahSuite(objects, fileName) );
    }
  }

  // ---
  // foonyahCI.prototype
  function C_timeoutError() {
    
  }

  // ---
  function outLog() {
    console.log.apply(console, _args(arguments));
  }
  function _args(a) {
    const args = Array.from(a);
    args.unshift(`${new Date().toGMTString()} - [foonyah-ci:foonyahCI.js]`);
    return args;
  }
  
})(this);
