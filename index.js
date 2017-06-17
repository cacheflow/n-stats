#!/usr/bin/env node

'use strict'

let program = require('commander')
let VERSION = require('./package.json').version
let request = require('request')
let fs = require('fs')
let path = require('path')
let readline = require('readline')
let cheerio = require('cheerio')
let prettyjson = require('prettyjson');


 program
 .version('0.0.1')
 .command('check')
 .action( function(env) {
    fs.access(path.resolve(process.cwd() + "/temp"), fs.constants.F_OK, (err) => {
      if(err) {
        promptUserForUserName()
      }
      else {
        scrapePackages()
      }
    })
 });

program.parse(process.argv);

// const getUsernameFromFile = () => {
//
// }

const createReadlineInterface = () => {
  const rl = readline.createInterface({
 	  input: process.stdin,
 	   output: process.stdout
   })
   return rl
}

const createTempFolder = (ghUsername) => {
  let dirPath =  process.cwd() + "/temp"
  let fileName = "username.txt"
  fs.mkdir(dirPath, function(err) {
    fs.appendFile(path.resolve(dirPath, fileName), ghUsername, (err) => {
      if(err) {
        console.log(err)
      }
    })
    scrapePackages()
  })
}

const scrapePackages = () => {
  fs.readFile('./temp/username.txt', 'utf-8', (err, data) => {
    if (err) throw err;
    let username = data
    let $;
    let npmModuleUrl;
    let $$;
    let obj = {}
    let packageName;
    request(`https://www.npmjs.com/~${username}`, (err, res) => {
      $ = cheerio.load(res.body)
      let packageLinks = $('.collaborated-packages').children('li').children('a')
      packageLinks.each(function(i, elem) {
        // console.log($(elem).attr('href'))
        npmModuleUrl = $(elem).attr('href')
        request(`https://www.npmjs.com${npmModuleUrl}`, (err, res) => {
          $$ = cheerio.load(res.body)
          // console.log(res.body)
          packageName = $(elem).attr('href').split('/package')[1].split('/')[1]
          obj = Object.assign(obj, {[packageName]: {
              daily: $$('.daily-downloads').text(),
              weekly: $$('.weekly-downloads').text(),
              monthly: $$('.monthly-downloads').text()
          }})
          if(Object.keys(obj).length  >= 98 ) {
            for(var i = 0; i < packageLinks.length; i+=1) {
              console.log(Object.keys(obj)[i], packageLinks[i].attr('href').split('/package')[1].split('/'))
            }
          }
        })
      })
    })
  });
}


const promptUserForUserName = () => {
  let rl = createReadlineInterface()
  rl.question('Could you provide me with your Github username, so I can check your npm stats?\n', (ghUsername) => {
     ghUsername = ghUsername.trim()
    createTempFolder(ghUsername)
  })
}


const askUserWhichPackagesToDisplay = (packages) => {
  let rl = createReadlineInterface()
  console.log(packages)
  rl.question('Which package do you want to see stats for?. I\'ll show you all by default. \n', (answer) => {
     answer = answer.trim()
     if(packages.hasOwnProperty(answer)) {
       console.log(prettyjson.render(Object.assign({}, {[answer]: packages[answer]}), {
         keysColor: 'blue',
         dashColor: 'magenta',
         stringColor: 'white'
       }))
       rl.close()
     }
     else {
       console.error('Didn\'t find any package with that name. Printing all instead.')
       console.log(prettyjson.render(packages, {
         keysColor: 'blue',
         dashColor: 'magenta',
         stringColor: 'white'
       }))
       rl.close()
     }
  })
}
