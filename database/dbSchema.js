const { Schema } = require('mongoose');
const mongoose=require('./dbConfig');

const usersSchema=new mongoose.Schema({
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

const classesSchema=new mongoose.Schema({
    classId: {type: String, unique: true},
    className: String,
    subjectId: Schema.Types.ObjectId,
    studentId: [Schema.Types.ObjectId],
    teacherId: [Schema.Types.ObjectId]
});

const coursesSchema=new mongoose.Schema({
    courseName: String,
    courseNo: String,
    courseDescription: String,
    objectives: [{type: Schema.Types.ObjectId, ref: 'objectives'}],
    owner: Schema.Types.ObjectId
});

const objectivesSchema=new mongoose.Schema({
    bloomLevel: Number,
    courseId: {type:Schema.Types.ObjectId, ref: 'courses'},
    objective: String
})

const questionSchema=new mongoose.Schema({
    question:{
        title: String,
        pict: String,
        type: {type: Number}
    },
    choices:[{isTrue: Boolean, choice:String, pict: String}],
    params:{
        a: Number,
        b: Number,
        c: Number
    },
    courseId:[{type: Schema.Types.ObjectId}],
    objectiveId:[{type: Schema.Types.ObjectId}],
    owner: Schema.Types.ObjectId
})

module.exports={
    usersSchema,
    classesSchema,
    coursesSchema,
    objectivesSchema,
    questionSchema
}