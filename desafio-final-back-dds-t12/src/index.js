require("dotenv").config();
const userRoutes = require("./routes/userRoutes");
const clientRoutes = require("./routes/clientRoutes");
const chargeRoutes = require("./routes/chargeRoutes");

const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());

app.use(express.json());
app.use(userRoutes);
app.use(clientRoutes);
app.use(chargeRoutes);

app.listen(process.env.PORT);
