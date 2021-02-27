const dbConfig=require('./dbConfig');
const dbSchema=require('./dbSchema');

module.exports={
    usersModel: dbConfig.mongoose.models.users || dbConfig.mongoose.model('users',dbSchema.usersSchema),
    coursesModel: dbConfig.mongoose.models.courses || dbConfig.mongoose.model('courses',dbSchema.coursesSchema),
    objectivesModel: dbConfig.mongoose.models.objectives || dbConfig.mongoose.model('objectives',dbSchema.objectivesSchema)
}

// module.exports={
//     usersModel
// }