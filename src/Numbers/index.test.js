const sut = require('../Numbers')

const { describe, it } = require('mocha')
const chai = require('chai')


describe('Numbers', function() {
    it('should ensure constant ZERO_BIGINT has value BigInt(0)', () => {
        chai.assert(sut.ZERO_BIGINT === BigInt(0))
    })
})
