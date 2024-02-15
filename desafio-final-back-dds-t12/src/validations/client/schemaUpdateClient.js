const joi = require("joi");

const schemaUpdateClient = joi
  .object({
    nome: joi.string().trim().strict().required().messages({
      "any.required": "O campo Nome é obrigatório.",
      "string.empty": "O preenchimento do nome é obrigatório.",
      "string.trim": "O campo Nome não pode conter espaços em branco.",
      "string.base": "Insira um nome válido.",
    }),
    email: joi.string().email().trim().strict().required().messages({
      "any.required": "O campo E-mail é obrigatório.",
      "string.empty": "O preenchimento do e-mail é obrigatório.",
      "string.email": "Digite um e-mail válido.",
      "string.base": "Insira um e-mail válido.",
      "string.trim": "O campo E-mail não pode conter espaços em branco.",
    }),
    cpf: joi.string().trim().strict().required().messages({
      "any.required": "O campo CPF é obrigatório.",
      "string.trim": "Digite um CPF válido.",
    }),
    telefone: joi.string().trim().strict().required().messages({
      "any.required": "O campo Telefone é obrigatório.",
      "string.trim": "Digite um telefone válido.",
    }),
    cep: joi.string().trim().strict().optional().allow(""),
    endereco: joi.string().trim().strict().optional().allow(""),
    complemento: joi.string().strict().trim().allow('').optional(),
    bairro: joi.string().strict().trim().optional().allow(""),
    cidade: joi.string().strict().trim().optional().allow(""),
    uf: joi.string().strict().trim().optional().allow(""),
  })
  .messages({
    "string.min": "A senha precisa conter, no mínimo, 8 caracteres.",
    "string.pattern.base":
      "Sua senha deverá conter no mínimo 8 caracteres sendo eles: 1 letra maiúscula, 1 número e 1 símbolo $*@&#.",
    "string.trim": "Os campos não podem conter espaços em branco.",
  });

module.exports = schemaUpdateClient;
