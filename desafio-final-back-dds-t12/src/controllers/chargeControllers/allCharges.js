const knex = require("../../database/config");

async function allCharges(req, res) {
  const { id } = req.user;
  const { status } = req.query;
  try {
    await knex.raw(`UPDATE cobrancas
    SET status = CASE
        WHEN cobrancas.status = 'Paga' THEN 'Paga'
        WHEN cobrancas.status != 'Paga' AND CURRENT_DATE > cobrancas.data_venc THEN 'Vencida'
        WHEN CURRENT_DATE = cobrancas.data_venc THEN 'Pendente'
        ELSE cobrancas.status
    END;
    `);

    if (status) {
      const charges = await knex
        .select(
          "clientes.nome",
          "cobrancas.id_cob",
          "cobrancas.valor",
          "cobrancas.data_venc",
          "cobrancas.status",
          "cobrancas.descricao",
          "clientes.usuario_id",
          "clientes.id"
        )
        .from("cobrancas")
        .join("clientes", "clientes.id", "cobrancas.cliente_id")
        .where("clientes.usuario_id", id)
        .andWhere("cobrancas.status", status);

      return res.status(200).json(charges);
    }

    const charges = await knex
      .select(
        "clientes.nome",
        "cobrancas.id_cob",
        "cobrancas.valor",
        "cobrancas.data_venc",
        "cobrancas.status",
        "cobrancas.descricao",
        "clientes.usuario_id",
        "clientes.id"
      )
      .from("cobrancas")
      .join("clientes", "clientes.id", "cobrancas.cliente_id")
      .where("clientes.usuario_id", id);

    return res.status(200).json(charges);
  } catch (error) {
    return res.status(500).json({
      mensagem: "Algo inesperado aconteceu ao carregar as cobranças",
      erro: error.message,
    });
  }
}

module.exports = allCharges;
