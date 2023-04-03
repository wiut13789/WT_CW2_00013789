const express = require("express");
const bodyParser = require("body-parser");
const transactionsRouter = require("./routes/transactions");

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set("view engine", "pug");
app.set("views", "./views");
app.use(express.static("public"));

const PORT = 3003;

app.use("/transactions", transactionsRouter);

app.get("/", (req, res) => {
  res.render("index");
});

app.listen(PORT, () => {
  console.log(`Spending app listening at http://localhost:${PORT}`);
});
