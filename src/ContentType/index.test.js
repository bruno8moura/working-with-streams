const sut = require('../ContentType')

const { describe, it } = require('mocha')
const chai = require('chai')


describe.only('Numbers', function() {
    this.timeout(Infinity)

    it('should ensure constant JSON has value "json"', () => {
        const expected = 'json'
        chai.assert(sut.JSON === expected)
    })

    it('should ensure constant TEXT has value "txt"', () => {
        const expected = 'txt'
        chai.assert(sut.TEXT === expected)
    })
})
