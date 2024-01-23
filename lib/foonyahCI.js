/**
 * [foonyah-ci] fonnyahCI.js
 * パッケージのメインモジュール
 */
(g=>{
  
  const NULL = null, TRUE = true, FALSE = false, UNDEF = undefined;
  foonyahCI.run = CI_run;
  foonyahCI.testCase = CI_testCase;
  
  const foonyahSuite = foonyahCI.suite = require('./foonyahSuite');
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
    process.chdir(ci.cwd = directory);
    ci.proc = Promise.resolve();
    [ ].concat(filenames).forEach(fp=>{
      ci.proc = ci.proc.then(sw=>{
        
        outLog('foonyahCI require: ' + fp, ci.cwd);
        const racers = [ ];
        racers.push(new Promise( (rsl, rej)=>{
          timeout = timeout || 10000;
          ci.timer = setTimeout(()=>{ ci.timeoutError(); rej('timeout (' + timeout + 'ms)') }, timeout = timeout || 10000);
        }) );
        racers.push(Promise.resolve( require(`${ci.cwd}/${fp}.js`) ));
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
      return ( new foonyahSuite(objects, fileName) ).proc;
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
    args.unshift(`${new Date().toGMTString()} - [foonyah-ci]`);
    return args;
  }
  
})(this);
