const chai = require('chai')
const InputFile = require('../InputFile')

describe('InputFile', function() {
    this.timeout(Infinity)
        
    it('should create file', async () => {
        const fileName = `big.file-${Date.now()}`
        const expected = true
        const inputFile = new InputFile(fileName)
        await inputFile.create()

        chai.assert((await inputFile.exists()) === expected)
    })

    it('should delete file', async () => {
        const fileName = `big.file-${Date.now()}`
        const expected = false
        const inputFile = new InputFile(fileName)
        await inputFile.create()
        await inputFile.delete()

        chai.assert((await inputFile.exists()) === expected)
    })
})