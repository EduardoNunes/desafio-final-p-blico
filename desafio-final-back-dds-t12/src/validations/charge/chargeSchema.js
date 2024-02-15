const joi = require("joi");

const chargeSchema = joi.object({
  cliente_id: joi.number().required().messages({
    "number.base": "Por favor informe um número válido",
    "any.required": "Por favor preencha todos os campos",
  }),

  descricao: joi.string().strict().required().messages({
    "any.required": "Por favor preencha todos os campos",
    "string.empty": "O preenchimento da descrição é obrigatório",
    "string.base": "Insira uma descrição a sua cobrança",
  }),
  data_venc: joi.date().required().messages({
    "any.required": "Por favor preencha todos os campos",
    "date.base": "Por favor informe uma data no seguinte formato: AAAA-MM-DD",
  }),
  valor: joi.number().positive().required().messages({
    "any.required": "Por favor preencha todos os campos",
    "number.base": "Por favor informe um número válido",
    "number.positive": "Por favor informe um valor positivo",
  }),
  status: joi
    .string()
    .valid("Paga", "Pendente", "Vencida")
    .required()
    .messages({
      "any.only": "O campo status deve ser: 'Paga', 'Pendente' ou 'Vencida'",
      "any.required": "O campo status é obrigatório",
      "string.empty": "O campo status não pode estar vazio",
    }),
});

module.exports = chargeSchema;
