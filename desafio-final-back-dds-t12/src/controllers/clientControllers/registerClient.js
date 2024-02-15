const { saveClient } = require("../../services/ClientQuery");
const knex = require("../../database/config");

async function registerClient(req, res) {
  const { id } = req.user;
  const { email, cpf } = req.body;
  try {
    const emailAlredyRegistered = await knex("clientes")
      .where({ email })
      .andWhere({ usuario_id: id })
      .first();

    if (emailAlredyRegistered) {
      return res.status(400).json({ mensagem: "O e-mail já cadastrado" });
    }

    const cpfAlredyRegistered = await knex("clientes")
      .where({ cpf })
      .andWhere({ usuario_id: id })
      .first();

    if (cpfAlredyRegistered) {
      return res.status(400).json({ mensagem: "O cpf já cadastrado" });
    }

    const newClient = await saveClient({
      ...req.body,
      usuario_id: id,
    });

    if (!newClient) {
      return res.status(400).json({ mensagem: "O cliente não foi cadastrado" });
    }

    return res.status(201).json({
      mensagem: "Cliente cadastrado com sucesso",
      Cliente: { ...newClient },
    });
  } catch (error) {
    return res.status(500).json({
      mensagem: "Algo inesperado aconteceu ao realizar o cadastro",
      erro: error.message,
    });
  }
}

module.exports = registerClient;
