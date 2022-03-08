const chai = require('chai')
const File = require('../File')
const fileType = require('./fileType')
const createStreamContent = require('./createStreamContent')
const crypto = require('crypto')

const folder = 'temp'
describe('File', function () {
    this.timeout(Infinity)

    it('should create empty file', async () => {
        const fileName = `emptyfile-${Date.now()}`
        const expected = {
            file: {
                created: true
            }
        }

        const file = new File({ folder, name: fileName })
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

        const streamContent = createStreamContent(
            flush => {
                for (let index = 0; index < 1e5; index++) {
                    const person = { id: Date.now() + index, name: `Bruno-${index}` }
                    flush(person)
                }
            })

        const file = new File({ folder, name: fileName, extension: fileType.JSON } )
        await file.create(streamContent)

        chai.assert((await file.exists()) === expected.file.created)
    })

    it('should delete file', async () => {
        const fileName = `must-be-deleted-${Date.now()}`
        const expected = {
            fileCreated: true,
            fileDeleted: true
        }

        const file = new File({ folder, name: fileName })

        await file.create()
        chai.assert((await file.exists()) === expected.fileCreated)

        await file.delete()
        chai.assert((!await file.exists()) === expected.fileDeleted)
    })

    it("should return undefined when there isn't a file", async () => {
        const fileName = `file-not-exists-${Date.now()}`

        const file = new File({ folder, name: fileName })
        
        chai.expect((await file.length())).to.be.deep.equal(undefined)
        
    })

    it("should return 'false' when file not exists", async () => {
        const fileName = `file-not-exists-${Date.now()}`
        const expected = false
        const file = new File({ folder, name: fileName }, )
        
        chai.expect((await file.exists())).to.be.deep.equal(expected)
        
    })

    it("should return file size when there is a very large file", async () => {
        const fileName = `big-file-${Date.now()}`

        const streamContent = createStreamContent(
            flush => {
                for (let index = 0; index < 3; index++) {
                    const _1gb_data = crypto.randomBytes(1e9)
                    flush(_1gb_data)
                }
            })

        const file = new File({ folder, name: fileName } )
        await file.create(streamContent)
        
        chai.expect((await file.length())).to.be.deep.equal(3000000000)        
    })
    
})