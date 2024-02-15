const knex = require("../database/config");

async function saveUser(user) {
  const userCreated = await knex("usuarios").insert(user).returning("*");

  return userCreated[0];
}

async function findUser(column) {
  const userFound = await knex("usuarios")
    .where({ ...column })
    .first();

  return userFound;
}

module.exports = { saveUser, findUser };
