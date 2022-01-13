const express = require("express");
const hbs = require("hbs");
const path = require("path");
const app = express();

app.use(express.urlencoded({ extended: true }));

app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "../website/views"));
hbs.registerPartials(path.join(__dirname, "../website/layouts"));

const appRoutes = require("../app/routes/routes");
app.use(appRoutes);

app.get("*", (req, res) => res.render("err404", { pageTitle: "error Page" }));

module.exports = app;
