const knex = require("../../database/config");

async function dashboardCharges(req, res) {
  const { id } = req.user;
  const arrayStatus = ["Pendente", "Paga", "Vencida"];

  try {
    const dashboardCharges = {};

    for (const status of arrayStatus) {
      const charges = await knex
        .select(
          "clientes.nome",
          "cobrancas.id_cob",
          "cobrancas.valor",
          "cobrancas.status"
        )
        .from("cobrancas")
        .join("clientes", "clientes.id", "cobrancas.cliente_id")
        .where("clientes.usuario_id", id)
        .andWhere("cobrancas.status", status);

      const fourCharges = await knex
        .select(
          "clientes.nome",
          "cobrancas.id_cob",
          "cobrancas.valor",
          "cobrancas.status"
        )
        .from("cobrancas")
        .join("clientes", "clientes.id", "cobrancas.cliente_id")
        .where("clientes.usuario_id", id)
        .andWhere("cobrancas.status", status)
        .limit(4);

      const total = charges.reduce(
        (accumulator, charge) => accumulator + charge.valor,
        0
      );

      dashboardCharges[status] = {
        charges: fourCharges,
        total: total,
        quantidade: charges.length,
      };
    }

    return res.status(200).json(dashboardCharges);
  } catch (error) {
    return res.status(500).json({
      mensagem: "erro ao tentar buscar as cobranças",
      erro: error.message,
    });
  }
}

module.exports = dashboardCharges;
