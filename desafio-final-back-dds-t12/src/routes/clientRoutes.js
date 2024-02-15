const express = require("express");
const routes = express();

const registerClient = require("../controllers/clientControllers/registerClient.js");
const consultClient = require("../controllers/clientControllers/consultClient.js");
const schemaClient = require("../validations/client/schemaClient.js");
const validateRegisterClient = require("../middlewares/client/validateRegisterClient.js");
const filterAuthorization = require("../middlewares/filterAuthorization.js");
const schemaUpdateClient = require("../validations/client/schemaUpdateClient.js");
const validateUpdateClient = require("../middlewares/client/validateUpdateClient.js");
const updateClient = require("../controllers/clientControllers/updateClient.js");
const clientDetails = require("../controllers/clientControllers/clientDetails.js");
const dashboardClients = require("../controllers/clientControllers/dashboardClients.js");
const searchClients = require("../controllers/clientControllers/searchClients.js");


routes.use(filterAuthorization);
routes.post(
  "/registerClient",
  validateRegisterClient(schemaClient),
  registerClient
);
routes.get("/consultClient", consultClient);
routes.get("/clientDetails/:clientId", clientDetails);
routes.get("/searchClients", searchClients);
routes.put(
  "/updateClient/:clientId",
  validateUpdateClient(schemaUpdateClient),
  updateClient
);
routes.get("/dashboardClients", dashboardClients);

module.exports = routes;
