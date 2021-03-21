const mongoose=require('./dbConfig');
const dbSchema=require('./dbSchema');

module.exports={
    usersModel: mongoose.models.users || mongoose.model('users',dbSchema.usersSchema),
    coursesModel: mongoose.models.courses || mongoose.model('courses',dbSchema.coursesSchema),
    objectivesModel: mongoose.models.objectives || mongoose.model('objectives',dbSchema.objectivesSchema),
    questionsModel: mongoose.models.questions || mongoose.model('questions',dbSchema.questionSchema),
    quizzesModel: mongoose.models.quizzes||mongoose.model('quizzes', dbSchema.quizSchema)
}

// module.exports={
//     usersModel
// }