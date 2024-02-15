const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { findUser } = require("../../services/UserQueries");

const hash = process.env.JWT_HASH;

async function login(req, res) {
  const { email, senha } = req.body;

  try {
    const user = await findUser({ email });

    if (!user) {
      return res.status(404).json({ mensagem: "Usuário não encontrado" });
    }

    const correctPassword = await bcrypt.compare(senha, user.senha);

    if (!correctPassword) {
      return res.status(401).json({ mensagem: "E-mail ou senha inválida" });
    }

    const token = jwt.sign({ id: user.id }, hash, { expiresIn: "8h" });

    const { senha: _, ...userData } = user;

    return res.status(200).json({ user: userData, token });
  } catch (error) {
    return res.status(401).json({ mensagem: "Não autorizado" });
  }
}

module.exports = login;
