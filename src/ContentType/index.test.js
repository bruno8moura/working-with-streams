const sut = require('../ContentType')

const { describe, it } = require('mocha')
const chai = require('chai')


describe('ContentType', function() {
    this.timeout(Infinity)

    it('should ensure constant JSON has value "json"', () => {
        const expected = 'json'
        chai.assert(sut.JSON === expected)
    })

    it('should ensure constant TEXT has value "txt"', () => {
        const expected = 'txt'
        chai.assert(sut.TEXT === expected)
    })

    it('should ensure constant BINARY has value "binary"', () => {
        const expected = 'binary'
        chai.assert(sut.BINARY === expected)
    })
})
