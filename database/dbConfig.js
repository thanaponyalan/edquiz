const mongoose=require('mongoose');
const {Schema}=mongoose;

var mongo_uri="mongodb+srv://admin:L22eEAiviL90nwuF@cluster0.7jcb8.mongodb.net/Quizzes?retryWrites=true&w=majority"
mongoose.Promise=global.Promise
mongoose.connect(mongo_uri,{useNewUrlParser: true, useUnifiedTopology: true}).then(()=>{
    console.log("[success] task 2 : connected to the database ");
},error=>{
    console.log("[failed] task 2 : "+error);
})

module.exports={
    mongoose,
    Schema
}