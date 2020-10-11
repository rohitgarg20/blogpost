class ApiError extends Error {
    errorMessage
    statusCode
    errorStatus
    constructor(msg: string, statusCode: number) {
        super(msg)
        this.errorMessage = msg,
        this.statusCode = statusCode,
        this.errorStatus = statusCode.toString().startsWith('5') ? 'error' : 'failure'

    }
}

export {
    ApiError
}