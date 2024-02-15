const knex = require("../database/config");

async function searchForClient(column) {
  const data = await knex("clientes")
    .where({ ...column })
    .returning("*");

  return data;
}

async function saveClient(client) {
  const newClient = await knex("clientes").insert(client).returning("*");

  return newClient[0];
}

async function updateClient(id, newData) {
  const updatedClient = await knex("clientes")
    .where({ id })
    .update(newData)
    .returning("*");

  return updatedClient[0];
}

module.exports = { searchForClient, saveClient, updateClient };
