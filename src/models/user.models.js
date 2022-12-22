import joi from "joi"

export const userSchema = joi.object({
    name: joi.string().required().min(3).max(50),
    email: joi.string().required().email().min(7).max(50),
    password: joi.string().required().min(6).max(50),
    confirmPassword: joi.string().required().min(6).max(50)
})

export const loginSchema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().required()
})