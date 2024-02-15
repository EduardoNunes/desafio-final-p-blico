const knex = require("../../database/config");
const { isAfter, parseISO, startOfDay } = require("date-fns");

async function addCharge(req, res) {
  const { cliente_id, status, data_venc } = req.body;

  try {
    const locateChargeById = await knex("clientes")
      .where({ id: cliente_id })
      .first();

    if (!locateChargeById) {
      return res.status(400).json({ mensagem: "Cliente não encontrado" });
    }

    if (!["Pendente", "Paga"].includes(status)) {
      return res.status(400).json({ mensagem: "Status de cobrança inválido" });
    }

    const currentDate = startOfDay(new Date());
    const dueDate = startOfDay(parseISO(data_venc));

    if (isAfter(currentDate, dueDate) && status !== "Paga") {
      req.body.status = "Vencida";

      await knex("clientes")
        .where({ id: cliente_id })
        .update({ status: "Inadimplente" });
    }

    const newCharge = await knex("cobrancas").insert(req.body).returning("*");

    if (!newCharge) {
      return res.status(400).json({ mensagem: "Cobrança não cadastrada" });
    }

    return res.status(201).json({
      mensagem: "Cobrança cadastrada com sucesso",
      cobranca: newCharge,
    });
  } catch (error) {
    return res.status(500).json({
      mensagem: "Algo inesperado aconteceu ao adicionar a cobrança",
      erro: error.message,
    });
  }
}

module.exports = addCharge;
