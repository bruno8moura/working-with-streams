const flushContent = fn => {
    if (!fn) throw new Error("fn is not a function")

    return flush => {
        if (!flush) throw new Error("'flush' param cannot be undefined")
        return fn(flush)
    }
}

module.exports = flushContent