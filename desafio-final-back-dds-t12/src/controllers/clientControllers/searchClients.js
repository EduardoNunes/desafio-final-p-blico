const knex = require("../../database/config");

async function searchClients(req, res) {
  const { id } = req.user;
  const { searchTerm, orderBy, typeOrderBy } = req.query;

  try {
    let clientsQuery = knex("clientes")
      .select("id", "nome", "cpf", "email", "telefone", "status")
      .where((builder) => {
        const translateName = knex.raw(`TRANSLATE(LOWER(nome),
        'ÁÀÂÃÄáàâãäÉÈÊËéèêëÍÌÎÏíìîïÓÒÕÔÖóòôõöÚÙÛÜúùûüÇç',
        'AAAAAaaaaaEEEEeeeeIIIIiiiiOOOOOoooooUUUUuuuuÇc')`);

        const filterName =
          knex.raw(`TRANSLATE(LOWER('%${searchTerm}%'), 'ÁÀÂÃÄáàâãäÉÈÊËéèêëÍÌÎÏíìîïÓÒÕÔÖóòôõöÚÙÛÜúùûüÇç',
        'AAAAAaaaaaEEEEeeeeIIIIiiiiOOOOOoooooUUUUuuuuÇc')`);

        if (searchTerm) {
          builder
            .whereILike(translateName, filterName)
            .orWhereILike("cpf", `%${searchTerm}%`)
            .orWhereILike("email", `%${searchTerm}%`);
        }
      })
      .andWhere("usuario_id", id);

    if (orderBy === "nome") {
      const orderByType = typeOrderBy ? typeOrderBy : "asc";
      clientsQuery = clientsQuery.orderBy("nome", orderByType);
    }

    const clients = await clientsQuery;

    return res.status(200).json(clients);
  } catch (error) {
    return res.status(500).json({
      mensagem: "Algo inesperado aconteceu ao realizar a busca",
      erro: error.message,
    });
  }
}

module.exports = searchClients;
