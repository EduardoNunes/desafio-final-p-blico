const express = require("express");
const routes = express();

const validateRequest = require("../middlewares/user/validateRequest.js");
const loginSchema = require("../validations/user/loginSchema.js");
const login = require("../controllers/userControllers/userAuth.js");
const registerUser = require("../controllers/userControllers/registerUser.js");
const validateUser = require("../middlewares/user/validateUser.js");
const userSchema = require("../validations/user/userSchema.js");
const updateUser = require("../controllers/userControllers/updateUser.js");
const validateUpdateUser = require("../middlewares/user/validateUpdateUser.js");
const schemaUpdateUser = require("../validations/user/schemaUpdateUser.js");
const filterAuthorization = require("../middlewares/filterAuthorization.js");
const userDetails = require("../controllers/userControllers/userDetails.js");

routes.post("/signup", validateUser(userSchema), registerUser);
routes.post("/login", validateRequest(loginSchema), login);

routes.use(filterAuthorization);
routes.get("/userDetails/:id", userDetails);
routes.put("/updateUser", validateUpdateUser(schemaUpdateUser), updateUser);

module.exports = routes;
