#!/usr/bin/env node

'use strict'

let program = require('commander')
let VERSION = require('./package.json').version
let request = require('request')
let cheerio = require('cheerio')
let prettyjson = require('prettyjson');
let rp = require('request-promise')
let humanize = require('humanize-number');


 program
 .version('0.0.1')
 .arguments('<pack>')
 .action( function(pack) {
   getNpmPage(pack).then((res) => {
     turnResponseIntoCheerioObj(pack, res)
   }).catch(err => err)
 });

const turnResponseIntoCheerioObj = (pack, res) => {
  let $ = cheerio.load(res)
  let obj = {}
  let timeFrames = ['daily', 'weekly', 'monthly']
  timeFrames.forEach(timeFrame => obj = Object.assign(obj, {
    [timeFrame]: humanize($(`.${timeFrame}-downloads`).text())
  }))
  obj = Object.assign({}, {[pack]: obj})
  printToCo(obj)

}
program.parse(process.argv);

const printToCo = (obj) => {
  console.log(prettyjson.render(obj, {
    keysColor: 'blue',
    dashColor: 'magenta',
    stringColor: 'white'
  }))
}

async function getNpmPage (pack) {
  return await rp(`https://www.npmjs.com/package/${pack}`)
}
