const { Schema } = require('mongoose');
const dbConfig=require('./dbConfig');


const usersSchema=new dbConfig.Schema({
    email: {type: String, lowercase: true, unique: true, required: [true, "can't be blank"], match: [/\S+@\S+\.\S+/, 'is invalid'], index: true},
    tokens: {
        access_token: String,
        refresh_token: String,
        expiry_date: String
    },
    firstName: String,
    familyName: String,
    photoUrl: String
});

const classesSchema=new dbConfig.Schema({
    classId: {type: String, unique: true},
    className: String,
    subjectId: Schema.Types.ObjectId,
    studentId: [Schema.Types.ObjectId],
    teacherId: [Schema.Types.ObjectId]
});

const coursesSchema=new dbConfig.Schema({
    courseName: String,
    courseNo: String,
    courseDescription: String,
    objectives: [{type: Schema.Types.ObjectId, ref: 'objectives'}],
    owner: Schema.Types.ObjectId
});

const objectivesSchema=new dbConfig.Schema({
    bloomLevel: Number,
    courseId: {type:Schema.Types.ObjectId, ref: 'courses'},
    objective: String
})

module.exports={
    usersSchema,
    classesSchema,
    coursesSchema,
    objectivesSchema
}