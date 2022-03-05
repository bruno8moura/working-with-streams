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
        const expected = {
            fileCreated: true,
            fileDeleted: false
        }
        
        const inputFile = new InputFile(fileName)
        
        await inputFile.create()        
        chai.assert((await inputFile.exists()) === expected.fileCreated)
        
        await inputFile.delete()
        chai.assert((await inputFile.exists()) === expected.fileDeleted)
    })
})