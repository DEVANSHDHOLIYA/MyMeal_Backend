import {body, param, query} from 'express-validator';

const emailValidation = ()=>{
    return body('email')
    .trim()
    .escape()
    .notEmpty()
    .withMessage('Email is required')
    .bail()
    .isEmail()
    .withMessage('Please enter a valid email address')
    .bail()
    .isLength({
        min:5,
        max:100
    })
    .withMessage('Email address must be between 5 and 100 characters')
    .customSanitizer((email) => {
      return email.toLowerCase();
    });
};
const nameValidation = ()=>{
        return body('name')
        .trim()
        .escape()
        .notEmpty()
        .withMessage('Name is required')
        .bail()
        .isLength({
            min:2,
            max:50
        })
        .withMessage('Name must be between 2 and 50 characters')
        .bail()
        .matches(/^[a-zA-Z\s]+$/)
        .withMessage('Name must contain only letters and spaces');
}

const companynameValidation = ()=>{
    return body('companyname')
    .trim()
    .escape()
    .notEmpty()
    .withMessage('Company name is required')
    .bail()
    .isLength({
        min:2,
        max:100
    })
    .withMessage('Company name must be between 2 and 100 characters')
}
const phonenovalidation = ()=>{
    return body('phoneno')
    .trim()
    .escape()
    .notEmpty()
    .withMessage('Phone number is required')
    .bail()
    .isMobilePhone()
    .withMessage('Please enter a valid phone number')
    .bail()
    .isLength({
        min:10,
        max:10
    })
    .withMessage('Phone number must be exactly 10 characters');
}

const optionalResourceIds = (field, type) => {
  let validationType=null;

  switch (type) {
    case "param":
      validationType = param(field);
      break;
    case "body":
      validationType = body(field);
      break;
    case "query":
      validationType = query(field);
      break;
    default:
      throw new Error(`Invalid validation type: ${type}`); // ✅ prevents null crash
  }

  return validationType
    .exists()
    .withMessage(`${field} is required`)
    .bail()
    .notEmpty()
    .withMessage(`${field} cannot be empty`)
    .bail()
    .isMongoId()
    .withMessage(`${field} is not valid`);
};
const passwordvalidation=()=>{
    return body('password')
    .trim()
    .escape()
    .notEmpty()
    .withMessage('Password is required')
    .bail()
    .isLength({
        min:8,
        max:20
    })
    .withMessage('Password must be between 8 and 20 characters')
    .bail()
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character')
};


export { emailValidation,passwordvalidation,optionalResourceIds, nameValidation, companynameValidation, phonenovalidation};