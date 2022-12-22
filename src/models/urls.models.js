import joi from "joi";

export const urlShortenSchema = joi.object({
    url: joi.string().uri().required()
})