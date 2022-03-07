const chai = require('chai')
const File = require('../File')

const folder = 'temp'
describe('File', function() {
    this.timeout(Infinity)
        
    it('should create empty file', async () => {
        const fileName = `emptyfile-${Date.now()}`
        const expected = {
            file: {
                created: true
            }
        }

        const file = new File({folder, name: fileName})
        await file.create()

        chai.assert((await file.exists()) === expected.file.created)
    })

    it('should create a file with content', async () => {
        const fileName = `filewithcontent-${Date.now()}`
        const expected = {
            file: {
                created: true                
            }
        }

        const createContent = (flush) => () => {
            for (let index = 0; index < 1e5; index++) {
                const person = { id: Date.now() + index, name: `Bruno-${index}`}
                const data = JSON.stringify(person)
                flush(data)
            }
        }

        const file = new File({folder, name: fileName})
        await file.create(createContent)

        chai.assert((await file.exists()) === expected.file.created)
    })

    it('should delete file', async () => {
        const fileName = `must-be-deleted-${Date.now()}`
        const expected = {
            fileCreated: true,
            fileDeleted: true
        }
        
        const file = new File( { folder, name: fileName } )
        
        await file.create()
        chai.assert((await file.exists()) === expected.fileCreated)
        
        await file.delete()
        chai.assert((!await file.exists()) === expected.fileDeleted)
    })
})