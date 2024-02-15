const { searchForClient } = require("../../services/ClientQuery");
const knex = require("../../database/config");

async function consultClient(req, res) {
  const { id } = req.user;
  const { status } = req.query;

  try {
    const clients = await searchForClient({ usuario_id: id });

    if (!clients) {
      return res.status(404).json({ mensagem: "Nenhum cliente encontrado" });
    }

    await knex.raw(`UPDATE clientes
    SET status = CASE
        WHEN EXISTS (SELECT 1 FROM cobrancas WHERE cobrancas.cliente_id = clientes.id
          AND cobrancas.status = 'Vencida') THEN 'Inadimplente'
        WHEN EXISTS (SELECT 1 FROM cobrancas WHERE cobrancas.cliente_id = clientes.id 
          AND cobrancas.status = 'Pendente') THEN 'Em dia'
        ELSE 'Em dia'
    END;`);

    if (status) {
      const clients = await knex("clientes")
        .where({ usuario_id: id, status })
        .returning("*");

      return res.status(200).json(clients);
    }

    return res.status(200).json(clients);
  } catch (error) {
    return res.status(500).json({
      mensagem: "Algo inesperado aconteceu ao carregar as informações",
      erro: error.message,
    });
  }
}

module.exports = consultClient;
