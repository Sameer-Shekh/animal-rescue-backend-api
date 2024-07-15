const asyncHandler = (requestHandler) =>{
    (req,res,next) => {
        promise.resolve(requestHandler).catch((err) => next(err))
    }
}

export default asyncHandler;