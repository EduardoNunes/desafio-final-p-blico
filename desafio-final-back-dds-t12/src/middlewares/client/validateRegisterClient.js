const validateRegisterClient = (joiSchema) => async (req, res, next) => {
  const { nome, email, cpf, telefone } = req.body;
  try {
    await joiSchema.validateAsync({ nome, email, cpf, telefone });

    next();
  } catch (error) {
    return res.status(400).json({ mensagem: error.message });
  }
};

module.exports = validateRegisterClient;
