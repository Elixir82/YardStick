let express =require('express');
let mongoose =require('mongoose');
let app=express();
let dotenv=require('dotenv');
let cors = require("cors");
const budgetRoutes = require('./routes/budgetRoutes');
const transactionRoutes=require('./routes/transactionRoutes')
app.use(cors());
app.use(express.json());
dotenv.config();

app.use('/',budgetRoutes);
app.use("/", transactionRoutes); 
let connection=async ()=>{
  try {
    let resp=await mongoose.connect(process.env.Mongo_URL,{
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    if(resp){
      console.log(`MongoDB connected: ${mongoose.connection.host}`);
    }else{
      console.log(`Cannot get response from MongoDB`);
    }
  } catch (error) {
    console.error("MongoDB connection failed:", error)
  }
}
connection();
app.listen(process.env.PORT||5000,()=>{
  console.log("Server listening on ",process.env.PORT);
})

