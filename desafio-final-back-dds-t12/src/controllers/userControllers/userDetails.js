const knex = require("../../database/config");

async function userDetails(req, res) {
  const { id } = req.params;

  try {
    const user = await knex("usuarios")
      .select("nome", "email", "cpf", "telefone")
      .where({ id })
      .first();
    if (!user) {
      return res.status(404).json({ mensagem: "Usuario não localizado" });
    }

    return res.status(200).json({ user });
  } catch (error) {
    return res.status(500).json({
      mensagem: "Algo inesperado aconteceu ao carregar as informações",
      erro: error.message,
    });
  }
}

module.exports = userDetails;
