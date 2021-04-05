const mongoose=require('./dbConfig');
const dbSchema=require('./dbSchema');

module.exports={
    usersModel: mongoose.models.users || mongoose.model('users',dbSchema.usersSchema),
    coursesModel: mongoose.models.courses || mongoose.model('courses',dbSchema.coursesSchema),
    objectivesModel: mongoose.models.objectives || mongoose.model('objectives',dbSchema.objectivesSchema),
    questionsModel: mongoose.models.questions || mongoose.model('questions',dbSchema.questionSchema),
    quizzesModel: mongoose.models.quizzes||mongoose.model('quizzes', dbSchema.quizSchema),
    classesModel: mongoose.models.classes||mongoose.model('classes',dbSchema.classesSchema),
    assignmentsModel: mongoose.models.assignments||mongoose.model('assignments',dbSchema.assignmentsSchema),
    historiesModel: mongoose.models.histories||mongoose.model('histories',dbSchema.historiesSchema)
}

// module.exports={
//     usersModel
// }