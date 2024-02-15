const joi = require("joi");

const loginSchema = joi
  .object({
    email: joi.string().email().trim().strict().required().messages({
      "any.required": "Por favor preencha todos os campos",
      "string.empty": "O preenchimento do e-mail é obrigatório",
      "string.email": "Digite um e-mail válido",
      "string.base": "Insira um e-mail válido",
      "string.trim": "O campo e-mail não pode conter espaços em branco",
    }),

    senha: joi.string().min(8).trim().required().messages({
      "any.required": "Por favor preencha todos os campos",
      "string.empty": "O preenchimento da senha é obrigatório",
      "string.min": "A senha precisa conter, no mínimo, 8 caracteres",
      "string.base": "Insira uma senha válida",
      "string.trim": "O campo senha não pode conter espaços em branco",
    }),
  })
  .min(2);

module.exports = loginSchema;
