const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const fs = require("fs");
const moment = require("moment");
const { v4: uuidv4 } = require("uuid");

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set("view engine", "pug");
app.set("views", "./views");
app.use(express.static("public"));

const PORT = 3003;
const transactionsFilePath = path.join(__dirname, "data", "transactions.json");


app.get("/transactions", (req, res) => {
  fs.readFile(transactionsFilePath, (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Internal Server Error");
    }
    const transactions = JSON.parse(data);
    transactions.forEach((transaction) => {
      transaction.date = moment(transaction.date).format("MMMM Do, YYYY");
      transaction.title =
        transaction.title.length > 25
          ? transaction.title.slice(0, 25) + "..."
          : transaction.title;
      transaction.description =
        transaction.description.length > 25
          ? transaction.description.slice(0, 10) + "..."
          : transaction.description;
    });
    res.render("transactions", { transactions });
  });
});

app.post("/transactions", (req, res) => {
  const { date, title, description, category, amount } = req.body;
  const newTransaction = {
    id: uuidv4(),
    date: moment(date),
    title,
    description,
    category,
    amount: parseFloat(amount),
  };
  
  const transactionsFileData = fs.readFileSync(transactionsFilePath, "utf8");
  const transactions = JSON.parse(transactionsFileData);

  transactions.push(newTransaction);

  fs.writeFileSync(transactionsFilePath, JSON.stringify(transactions));

  res.redirect("/");
});

app.delete("/transactions/:id", (req, res) => {
  const id = req.params.id;
  fs.readFile(transactionsFilePath, (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Internal Server Error");
    }
    const transactions = JSON.parse(data);
    const updatedTransactions = transactions.filter(
      (transaction) => transaction.id !== id
    );

    if (transactions.length === updatedTransactions.length) {
      res.status(404).send("Transaction not found");
    } else {
      fs.writeFileSync(transactionsFilePath, JSON.stringify(updatedTransactions));
      res.status(200).send({ message: 'Transaction deleted successfully' });
      res.redirect('/transactions')
    }
  });
});

app.get("/", (req, res) => {
  res.render("index");
});

app.listen(PORT, () => {
  console.log(`Spending app listening at http://localhost:${PORT}`);
});
