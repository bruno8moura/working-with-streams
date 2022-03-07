const crypto = require('crypto')
const { rm } = require('fs/promises')
const fs = require('fs')

const { promisify } = require('util')
const { Readable, pipeline } = require('stream')
const pipelineAsync = promisify(pipeline)
const NUMBER = require('../constants/NUMBER')
class File {
    constructor( { folder, name } ) {
        this.name = name
        this.folder = folder
        this.size = NUMBER.ZERO_BIGINT
        this.filePath = `${this.folder}/${this.name}`
    }

    async create(createContent) {
        // const buff = Buffer.from( content, 'utf-8')
        await this.#write(createContent)  
    }

    async #write( createContent ){
        const readableStream = Readable({
            read(){
                const flush = (data) => this.push(JSON.stringify(data), 'utf-8')
                if(createContent){
                    createContent(flush)                    
                }
                
                const finished = null
                this.push(finished)
            }
        })

        await pipelineAsync(
            readableStream,
            fs.createWriteStream(this.filePath)
        )
    }

    async length() {
        return new Promise( ( resolve, reject ) => {
            fs.createReadStream(this.filePath).on('data', (chunk) => {
                this.size = this.size + BigInt(chunk.length)
            })
            .on('end', () => resolve(this.size))
            .on('error', (e) => {
                resolve(undefined)
                // implements logs here
                // console.error(e)
            })
        })
    }

    async exists() {
        try {
            return fs.existsSync(this.filePath)
        } catch (error) {
            //log here            
        }

        return false
    }

    async delete() {
        await rm(this.filePath)
    }
}

module.exports=File