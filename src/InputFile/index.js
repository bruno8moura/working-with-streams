const crypto = require('crypto')
const { writeFile, readFile } = require('fs/promises')
class InputFile {
    constructor(name) {
        this.name = name
    }

    async create() {
        await writeFile(this.name, crypto.randomBytes(1e9))
    }

    async exists() {
        const file = await readFile(this.name)

        return undefined !== file
    }
}

module.exports=InputFile