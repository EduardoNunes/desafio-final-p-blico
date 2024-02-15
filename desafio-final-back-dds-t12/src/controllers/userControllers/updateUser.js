const knex = require("../../database/config");
const { hash } = require("bcrypt");
const { findUser } = require("../../services/UserQueries");

async function updateUser(req, res) {
  const { id } = req.user;
  const { nome, email, cpf, telefone, senha } = req.body;

  try {
    const existingUser = await findUser({ id });

    if (!existingUser) {
      return res.status(404).json({ erro: "Usuario não encontrado" });
    }

    if (cpf) {
      const cpfExists = await knex("usuarios")
        .where("cpf", cpf)
        .whereNot("id", id)
        .first();

      if (cpfExists) {
        return res.status(409).json({ mensagem: "CPF já cadastrado!" });
      }
    }

    const emailExists = await knex("usuarios")
      .where("email", email)
      .whereNot("id", id)
      .first();
    if (emailExists) {
      return res.status(409).json({ mensagem: "E-mail já cadastrado!" });
    }

    if (senha) {
      const encryptedPass = await hash(senha, 10);

      await knex("usuarios").where({ id }).update({ senha: encryptedPass });
    }

    const { senha: _, ...userData } = req.body;

    await knex("usuarios")
      .where({ id })
      .update({ ...userData });

    return res.status(203).json({
      mensagem: "Atualizado com sucesso",
      usuario: { id, nome, cpf, telefone, email },
    });
  } catch (error) {
    return res.status(500).json({
      mensagem: "Algo inesperado aconteceu ao atualizar as informações",
      erro: error.message,
    });
  }
}

module.exports = updateUser;
