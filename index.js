#!/usr/bin/env node

'use strict';

const program = require('commander');
const cheerio = require('cheerio');
const prettyjson = require('prettyjson');
const rp = require('request-promise');
const humanize = require('humanize-number');

const printToCo = obj => {
  console.log(prettyjson.render(obj, {
    keysColor: 'blue',
    dashColor: 'magenta',
    stringColor: 'white'
  }))
}

const turnResponseIntoCheerioObj = (pack, res) => {
  const $ = cheerio.load(res);
  let obj = {};
  const timeFrames = ['daily', 'weekly', 'monthly'];
  timeFrames.forEach((timeFrame) => {
    obj = Object.assign(obj, {[timeFrame]: humanize($(`.${timeFrame}-downloads`).text())})
  })
  obj = Object.assign({}, {[pack]: obj});
  printToCo(obj);
}

program
.version('0.0.1')
.arguments('<pack>')
.action( function(pack) {
  getNpmPage(pack).then((res) => {
    if(res.hasOwnProperty('statusCode')) {
      if(res.statusCode == 404) {
        throw new Error(`Did not find a packaged name ${pack}. Try searching for another one.`)
      }
      else {
          throw new Error(res.statusCode)
      }
    }
    else {
      turnResponseIntoCheerioObj(pack, res);
    }
  }).catch((err) => {
    console.error(err)
    process.exit()
  })
});

program.parse(process.argv);

async function getNpmPage(pack) {
  try {
    let res = await rp(`https://www.npmjs.com/package/${pack}`);
    return res
  }
  catch(err) {
    return err
  }
}
