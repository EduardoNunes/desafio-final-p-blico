const knex = require("../../database/config");

async function chargeDetails(req, res) {
  const { id } = req.user;
  const { idCharge } = req.params;

  try {
    const charge = await knex("cobrancas")
      .select(
        "clientes.nome as cliente_nome",
        "cobrancas.id_cob",
        "cobrancas.valor",
        "cobrancas.data_venc",
        "cobrancas.status",
        "cobrancas.descricao"
      )
      .join("clientes", "cobrancas.cliente_id", "clientes.id")
      .where({ "cobrancas.id_cob": idCharge, "clientes.usuario_id": id })
      .first();

    if (!charge) {
      return res.status(404).json({ mensagem: "A cobrança não existe" });
    }

    return res.status(200).json(charge);
  } catch (error) {
    return res.status(500).json({
      mensagem:
        "Algo inesperado aconteceu ao carregar as informações da cobrança",
      erro: error.message,
    });
  }
}

module.exports = chargeDetails;
