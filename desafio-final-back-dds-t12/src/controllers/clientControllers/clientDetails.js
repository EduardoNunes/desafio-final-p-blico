const knex = require("../../database/config");

async function clientDetails(req, res) {
  const { id } = req.user;
  const { clientId } = req.params;

  try {
    const client = await knex("clientes")
      .select(
        "nome",
        "cpf",
        "email",
        "telefone",
        "endereco",
        "complemento",
        "cep",
        "bairro",
        "cidade",
        "uf",
        "status",
        "usuario_id"
      )
      .where({ id: clientId, usuario_id: id })
      .first();

    if (!client) {
      return res.status(404).json({ mensagem: "Cliente não encontrado" });
    }

    const charges = await knex("cobrancas")
      .select(
        "id_cob",
        "descricao",
        "data_venc",
        "valor",
        knex.raw(`CASE
        WHEN cobrancas.status = 'Paga' THEN 'Paga'
        WHEN cobrancas.status != 'Paga' AND CURRENT_DATE > cobrancas.data_venc THEN 'Vencida'
        WHEN CURRENT_DATE = cobrancas.data_venc THEN 'Pendente'
        ELSE cobrancas.status
    END as "status"`)
      )
      .where("cliente_id", clientId);

    return res.status(200).json({ client, charges });
  } catch (error) {
    return res.status(500).json({
      mensagem: "Algo inesperado aconteceu ao carregar as informações",
      erro: error.message,
    });
  }
}

module.exports = clientDetails;
