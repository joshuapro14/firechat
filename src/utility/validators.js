import {object, string} from 'yup';

const emailSchema = object().shape({
    email: string().email().required()
})

const nonEmptyTextSchema = object().shape({
    text: string().trim().min(1)
})

const validateObject = (obj, schema) => {
    return new Promise(res => {
        schema.validate(obj)
            .then(castObject => res({isValid: true, castObject}))
            .catch(err => res({isValid: false, reason: err.errors}))
    })
}

const isEmailValid = (email) => {
    return validateObject({email}, emailSchema);
}

const isNonEmptyText = (text) => {
    return validateObject({text}, nonEmptyTextSchema); 
}

export {
    isEmailValid,
    isNonEmptyText
}