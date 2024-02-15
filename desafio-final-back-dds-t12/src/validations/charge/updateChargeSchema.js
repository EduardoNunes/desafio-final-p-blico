const joi = require("joi");

const updateChargeSchema = joi.object({
  cliente_id: joi.number().positive().required().messages({
    "any.required": "Por favor preencha todos os campos",
    "number.base": "Por favor informe um número válido",
    "number.positive": "Por favor informe um valor positivo",
  }),
  id_cob: joi.string().required().messages({
    "any.required": "Por favor preencha todos os campos",
    "string.empty": "O preenchimento do id da cobrança é obrigatório",
    "string.base": "Insira uma descrição a sua cobrança",
  }),

  descricao: joi.string().strict().optional().messages({
    "string.base": "Insira uma descrição a sua cobrança",
  }),
  data_venc: joi.date().optional().messages({
    "date.base": "Por favor informe uma data no seguinte formato: AAAA-MM-DD",
  }),
  valor: joi.number().positive().optional().messages({
    "number.base": "Por favor informe um número válido",
    "number.positive": "Por favor informe um valor positivo",
  }),
  status: joi
    .string()
    .valid("Paga", "Pendente", "Vencida")
    .optional()
    .messages({
      "any.only": "O campo status deve ser: 'Paga', 'Pendente' ou 'Vencida'",
    }),
});

module.exports = updateChargeSchema;
