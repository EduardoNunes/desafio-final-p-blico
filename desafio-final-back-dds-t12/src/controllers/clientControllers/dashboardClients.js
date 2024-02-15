const knex = require("../../database/config");

async function dashboardClients(req, res) {
  const { id } = req.user;

  try {
    const clientsUpToDate = await knex("clientes")
      .where({ usuario_id: id, status: "Em dia" })
      .select("id", "nome", "cpf")
      .limit(4);

    const [amountClientsUpToDate] = await knex("clientes")
      .where({
        usuario_id: id,
        status: "Em dia",
      })
      .count({ count: ["id"] });

    const defaultingClients = await knex("clientes")
      .where({
        usuario_id: id,
        status: "Inadimplente",
      })
      .select("id", "nome", "cpf")
      .limit(4);

    const [amountDefaultingClients] = await knex("clientes")
      .where({
        usuario_id: id,
        status: "Inadimplente",
      })
      .count({ count: ["id"] });

    res.status(200).json({
      clientesEmdia: {
        clientes: clientsUpToDate,
        quantidade: amountClientsUpToDate.count,
      },
      clientesInadimplentes: {
        clientes: defaultingClients,
        quantidade: amountDefaultingClients.count,
      },
    });
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao tentar consultar os clientes",
      erro: error.message,
    });
  }
}

module.exports = dashboardClients;
