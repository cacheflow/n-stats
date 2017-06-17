'use strict'

const assert = require('assert');
const chai = require('chai')
const expect = chai.expect
const should = require('chai').should();
const {promisify} = require('util');
const exec = promisify(require('child_process').exec)


describe('n-stats function', function() {

  it('should show the number of monthly downloads', function(done) {
      exec('n-stats read-this').then((res) => {
        expect(res['stdout']).to.include('monthly:')
      }).then(done, done).catch(err => err)
  })

  it('should show the number of daily downloads', function(done) {
      exec('n-stats read-this').then((res) => {
        expect(res['stdout']).to.include('daily:')
      }).then(done, done).catch(err => err)
  })

  it('should show the number of weekly downloads', function(done) {
      exec('n-stats read-this').then((res) => {
        expect(res['stdout']).to.include('weekly:')
      }).then(done, done).catch(err => err)
  })

  it('should throw an error when a user searches for a non-existant package', function(done) {
      exec('n-stats randompackagethatisnotreal').then((res) => {
        let pack = "randompackagethatisnotreal"
        let err = 'Error: Did not find a packaged name randompackagethatisnotreal. Try searching for another one.'
        expect(res['stderr']).to.include(err)
      }).then(done, done).catch(err => err)
  })
})
