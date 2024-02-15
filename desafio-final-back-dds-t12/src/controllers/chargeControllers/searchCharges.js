const knex = require("../../database/config");

async function searchCharges(req, res) {
  const { id } = req.user;
  const { searchTerm } = req.query;

  try {
    const charges = await knex("cobrancas")
      .select(
        "clientes.nome as nome",
        "clientes.id",
        "cobrancas.id_cob",
        "cobrancas.valor",
        "cobrancas.data_venc",
        "cobrancas.status",
        "cobrancas.descricao"
      )
      .join("clientes", "cobrancas.cliente_id", "clientes.id")
      .where((builder) => {
        const translateName = knex.raw(`TRANSLATE(LOWER(clientes.nome),
        'ÁÀÂÃÄáàâãäÉÈÊËéèêëÍÌÎÏíìîïÓÒÕÔÖóòôõöÚÙÛÜúùûüÇç',
        'AAAAAaaaaaEEEEeeeeIIIIiiiiOOOOOoooooUUUUuuuuÇc')`);

        const filterName =
          knex.raw(`TRANSLATE(LOWER('%${searchTerm}%'), 'ÁÀÂÃÄáàâãäÉÈÊËéèêëÍÌÎÏíìîïÓÒÕÔÖóòôõöÚÙÛÜúùûüÇç',
        'AAAAAaaaaaEEEEeeeeIIIIiiiiOOOOOoooooUUUUuuuuÇc')`);

        builder.whereILike(translateName, filterName);
        builder.orWhereILike(
          knex.raw(`cast(cobrancas.id_cob as text)`),
          `%${searchTerm}%`
        );
      })

      .andWhere("clientes.usuario_id", id);

    return res.status(200).json(charges);
  } catch (error) {
    return res.status(500).json({
      mensagem: "Algo inesperado aconteceu ao realizar a busca",
      erro: error.message,
    });
  }
}

module.exports = searchCharges;
