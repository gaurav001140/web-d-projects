const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Task = require('./models/Task');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/todoDb')
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));
  app.get("/", (req, res) => {
    res.send("Server is working!");
});


app.get('/tasks' , async (req , res)=>{
  const tasks = await Task.find();
  res.json(tasks);
})

app.post('/tasks' , async (req , res)=>{
  const newtask = new Task(req.body);
  await newtask.save();
  res.json(newtask);
})

app.put('/tasks/:id' , async(req , res)=>{
  const updatetask = await Task.findByIdAndUpdate(req.params.id , req.body , {new: true});
  res.json(updatetask);
});

app.delete('/tasks/:id' , async (req , res)=>{
  await Task.findByIdAndDelete(req.params.id);
  res.json({massage:'task deleted'});
})
const port = 3000;
app.listen(port, () => {
    console.log(`🚀 Server is running at http://localhost:${port}`);
});
