/**
 * [foonyah-ci](test) _runner.js
 * npm test => npm run test で実行するファイルを決定する。
 */
const tests = ['basic'];
require('foonyah-ci').run(tests, __dirname, 5000);