import HttpError from "../helpers/httpErrors.js";

const validateBody = schema => {
    const func = (req, res, next)=> {
        const {error} = schema.validate(req.body);
        if(error) {
            return next( new HttpError(400, error.message));
        }
        next();
    }

    return func;
}

export default validateBody;