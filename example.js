const exec = require('child_process').exec
const prettyjson = require('prettyjson');
const rp = require('request-promise');

exec('n-stats request', ((err, stdout, stderr) => {
  if(stderr) return stderr
  console.log(stdout)
}))
