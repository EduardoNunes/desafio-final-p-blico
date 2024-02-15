const { updateClient } = require("../../services/ClientQuery");
const knex = require("../../database/config");

async function updateClientData(req, res) {
  const { id } = req.user;
  const { clientId } = req.params;
  const {
    nome,
    email,
    cpf,
    telefone,
    cep,
    endereco,
    complemento,
    bairro,
    cidade,
    uf,
  } = req.body;

  try {
    const existingClient = await knex("clientes")
      .where({ id: clientId, usuario_id: id })
      .first();

    if (!existingClient) {
      return res.status(404).json({ mensagem: "Cliente não encontrado" });
    }

    const emailExists = await knex("clientes")
      .whereNot({ id: clientId })
      .andWhere({ email })
      .first();

    if (emailExists) {
      return res
        .status(400)
        .json({ mensagem: "O e-mail já está cadastrado para outro cliente" });
    }

    const cpfExists = await knex("clientes")
      .whereNot({ id: clientId })
      .andWhere({ cpf })
      .andWhere({ usuario_id: id })
      .first();

    if (cpfExists) {
      return res
        .status(400)
        .json({ mensagem: "O CPF já está cadastrado para outro cliente" });
    }

    const updatedClient = await updateClient(clientId, {
      nome,
      email,
      cpf,
      telefone,
      cep,
      endereco,
      complemento,
      bairro,
      cidade,
      uf,
    });

    return res.status(200).json({
      mensagem: "Cliente atualizado com sucesso",
      Cliente: { ...updatedClient },
    });
  } catch (error) {
    return res.status(500).json({
      mensagem: "Algo inesperado aconteceu ao atualizar as informações",
      erro: error.message,
    });
  }
}

module.exports = updateClientData;
