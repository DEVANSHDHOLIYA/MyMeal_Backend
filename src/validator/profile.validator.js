import { body } from "express-validator";

const stringvalidation =(field)=>{
    return body(field)
    .trim()
    .escape()
    .exists()
    .notEmpty()
    .withMessage(`${field} is required`)
}
export {stringvalidation};