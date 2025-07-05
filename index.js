const express=require("express");
const dotEnv=require('dotenv');
const mongoose=require('mongoose');
const bodyParser=require('body-parser');
const path=require('path');
const cors=require('cors');


const app=express()

const PORT=process.env.PORT || 5000;

dotEnv.config();
app.use(cors())

mongoose.connect(process.env.MONGO_URI)
    .then(()=>console.log("MONGODB connected successfully!"))
    .catch((error)=>console.log(error))

    app.use(bodyParser.json());


// Transaction Model
const Transaction = mongoose.model('Transaction', new mongoose.Schema({
    amount: Number,
    date: Date,
    description: String,
    category: { type: String, required: true }

  }));
  
  // Routes
  app.post('/transactions', async (req, res) => {
    const { amount, date, description,category } = req.body;
    
    // const transaction = new Transaction({ amount, date, description,category });
    // await transaction.save();
    // res.status(201).send(transaction);
    try {
      const newTransaction = new Transaction({
        amount,
        date,
        description,
        category,
      });
      await newTransaction.save();
      res.status(201).send(newTransaction);
    } catch (error) {
      res.status(400).send({ message: error.message });
    }
  });
  
  app.get('/transactions', async (req, res) => {
    const transactions = await Transaction.find();
    res.status(200).send(transactions);
  });

  // Edit a transaction by ID
app.put('/transactions/:id', async (req, res) => {
  const { id } = req.params;
  const { amount, date, description,category } = req.body;

  try {
  const updatedTransaction = await Transaction.findByIdAndUpdate(
    id,
    { amount, date, description,category },
    { new: true }
  );
  
  if (updatedTransaction) {
    res.status(200).send(updatedTransaction);
  } else {
    res.status(404).send({ message: 'Transaction not found' });
  }
} catch (error) {
  res.status(400).send({ message: error.message });

    
}

});

  
  app.delete('/transactions/:id', async (req, res) => {
    const { id } = req.params;
    await Transaction.findByIdAndDelete(id);
    res.status(200).send({ message: 'Transaction deleted' });
  });

  const Budget = require('./models/Budget');

// Create or Update a budget
app.post('/budgets', async (req, res) => {
  const { category, amount, month } = req.body;

  // Check if budget for category and month already exists
  let budget = await Budget.findOne({ category, month });

  if (budget) {
    // Update existing
    budget.amount = amount;
    await budget.save();
    res.send(budget);
  } else {
    // Create new
    budget = new Budget({ category, amount, month });
    await budget.save();
    res.send(budget);
  }
});

// Get all budgets
app.get('/budgets', async (req, res) => {
  const budgets = await Budget.find();
  res.send(budgets);
});
    
app.listen(PORT,()=>{
    console.log(`Server started and running at ${PORT}`);

});
app.use('/',(req,res)=>{
    res.send("<h1>Welcome to Finance Visualizer ");
})