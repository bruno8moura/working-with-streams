const crypto = require('crypto')
const { rm } = require('fs/promises')
const fs = require('fs')

const { promisify } = require('util')
const { Readable, pipeline } = require('stream')
const pipelineAsync = promisify(pipeline)
class InputFile {
    constructor(name) {
        this.name = name
        this.size = BigInt(0)
    }

    async create() {
        const readableStream = Readable({
            read(){
                const finished = null
                const oneGb = 1e9
                const threeGb = [ oneGb, oneGb, oneGb ]

                for (let i = 0; i < threeGb.length; i++) {
                    const data = crypto.randomBytes(threeGb[i])
                    this.push(data)
                }

                this.push(finished)
            }
        })

        await pipelineAsync(
            readableStream,
            fs.createWriteStream(this.name)
        )
    }

    async length() {
        return new Promise( ( resolve, reject ) => {
            fs.createReadStream(this.name).on('data', (chunk) => {
                this.size = this.size + BigInt(chunk.length)
            })
            .on('end', () => resolve(this.size))
            .on('error', (e) => reject(e))            
        })
    }

    async exists() {
        try {
            return (await this.length()) > 0
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