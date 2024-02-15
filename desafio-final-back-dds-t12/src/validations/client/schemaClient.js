const joi = require("joi");

const schemaClient = joi.object({
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
  cpf: joi.string().trim().strict().required().messages({
    "string.empty": "O campo CPF é obrigatório",
    "string.trim": "Digite um CPF válido",
    "any.required": "Por favor preencha todos os campos",
  }),
  telefone: joi.string().trim().strict().required().messages({
    "string.empty": "O campo telefone é obrigatório",
    "string.trim": "Digite telefone válido",
    "any.required": "Por favor preencha todos os campos",
  }),
});

module.exports = schemaClient;
