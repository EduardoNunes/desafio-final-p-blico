const joi = require("joi");

const userSchema = joi.object({
  nome: joi.string().trim().strict().required().messages({
    "any.required": "Por favor preencha todos os campos",
    "string.empty": "O preenchimento do nome é obrigatório",
    "string.trim": "O campo nome não pode conter espaços em branco",
    "string.base": "Insira um nome válido",
  }),
  email: joi.string().email().trim().strict().required().messages({
    "any.required": "Por favor preencha todos os campos",
    "string.empty": "O preenchimento do e-mail é obrigatório",
    "string.email": "Digite um e-mail válido",
    "string.base": "Insira um e-mail válido",
    "string.trim": "O campo e-mail não pode conter espaços em branco",
  }),
  senha: joi
    .string()
    .trim()
    .strict()
    .pattern(
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%?&])[0-9a-zA-Z@$!%?&]{8,}$/
    )
    .min(8)
    .required()
    .messages({
      "any.required": "Por favor preencha todos os campos",
      "string.empty": "O preenchimento da senha é obrigatório",
      "string.min": "A senha precisa conter, no mínimo, 8 caracteres",
      "string.base": "Insira uma senha válida",
      "string.pattern.base":
        "Sua senha deverá conter no mínimo 8 caracteres sendo eles: 1 letra maiúscula, 1 número e 1 símbolo @,$,!,%,? ou &",
      "string.trim": "O campo senha não pode conter espaços em branco",
    }),
});

module.exports = userSchema;
