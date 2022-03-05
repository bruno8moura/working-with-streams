const crypto = require('crypto')
const { writeFile, readFile, rm } = require('fs/promises')
class InputFile {
    constructor(name) {
        this.name = name
    }

    async create() {
        await writeFile(this.name, crypto.randomBytes(1e9))
    }

    async exists() {
        try {
            const file = await readFile(this.name)    
            return undefined !== file            
        } catch (error) {
            //log here
        }

        return false
    }

    async delete() {
        await rm(this.name)
    }
}

module.exports=InputFile