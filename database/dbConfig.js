import { MONGO_URI } from "../constant/ENV";

const mongoose=require('mongoose');
const {Schema}=mongoose;

mongoose.Promise=global.Promise
mongoose.connect(MONGO_URI,{useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false}).then(()=>{
    console.log("[success] task 2 : connected to the database ");
},error=>{
    console.log("[failed] task 2 : "+error);
})

module.exports=mongoose;