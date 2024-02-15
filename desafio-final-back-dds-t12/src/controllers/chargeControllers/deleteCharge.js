const knex = require("../../database/config");
const { isAfter } = require("date-fns");

async function deleteCharge(req, res) {
  const { id } = req.user;
  const { idCharge } = req.params;

  try {
    const charge = await knex("cobrancas").where({ id_cob: idCharge }).first();

    if (!charge) {
      return res.status(404).json({ mensagem: "A cobrança não existe" });
    }

    const existingClient = await knex("clientes")
      .where({ id: charge.cliente_id, usuario_id: id })
      .first();

    if (!existingClient) {
      return res.status(404).json({ mensagem: "A cobrança não existe" });
    }

    if (charge.status != "Pendente") {
      return res
        .status(400)
        .json({ mensagem: "Essa cobrança não pode ser deletada" });
    }

    const currentDate = new Date();

    if (!isAfter(charge.data_venc, currentDate)) {
      return res.status(400).json({
        mensagem:
          "Essa cobrança não pode ser deletada, pois a data de vencimento já expirou.",
      });
    }

    await knex("cobrancas").where({ id_cob: idCharge }).del();

    return res.status(200).json({ mensagem: "Cobrança deletada com sucesso" });
  } catch (error) {
    return res.status(500).json({
      mensagem: "Algo inesperado aconteceu ao realizar essa exclusão",
      erro: error.message,
    });
  }
}

module.exports = deleteCharge;
