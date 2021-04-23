import withMiddleware from "../../middlewares";
import {serialize} from 'cookie';
const dbModel=require('../../database/dbModel');
import moment from "moment";
import { API } from "../../constant/ENV";

let response={
    statusCode: 200,
    data:{
        payload: {}
    }
}

const getAssignments=async(req,res)=>{
    return new Promise((resolve, reject)=>{
        if(req.headers.authorization===undefined||!req.headers.authorization.match(/^[0-9a-fA-F]{24}$/)){
            response.statusCode=403;
            response.data.message="Permission Denied!";
            res.status(response.statusCode).json(response);
            return reject(response);
        }
        const {isTeacher}=req.query;
        if(isTeacher){
            dbModel.assignmentsModel.find({owner: req.headers.authorization}).populate('classId').populate('quizId').exec((err,assignments)=>{
                if(!err){
                    // console.log(assignments);
                    response.data.payload=assignments;
                    res.status(response.statusCode).json(response);
                    return resolve();
                }
                return reject(err)
            })
        }else{
            dbModel.assignmentsModel.find({'assignees.studentId': req.headers.authorization}).populate('classId').populate('quizId').exec((err,assignments)=>{
                if(!err){
                    response.data.payload=assignments;
                    res.status(response.statusCode).json(response);
                    return resolve();
                }
                return reject(err)
            })
        }
    })
}

const getStudents=async(classId)=>{
    return new Promise(async(resolve,reject)=>{
        try{
            const classDetail=await dbModel.classesModel.findById(classId);
            const students=await classDetail.students;
            return resolve(students)
        }catch(err){
            console.log(err);
            return reject(err)
        }
    })

}

const getGoogleClassId=async(classId)=>{
    return new Promise(async(resolve,reject)=>{
        try{
            const classDetail=await dbModel.classesModel.findById(classId);
            const gClassId=await classDetail.gClassId
            return resolve(gClassId)
        }catch(err){
            console.log(err);
            return reject(err)
        }
    })
}

const getQuizName=async(quizId)=>{
    return new Promise(async(resolve,reject)=>{
        try{
            const quizDetail=await dbModel.quizzesModel.findById(quizId);
            const quizName=await quizDetail.quizName;
            return resolve(quizName)
        }catch(err){
            console.log(err);
            return reject(err);
        }
    })
}

const insertAssignment=async(req,res)=>{
    return new Promise((resolve,reject)=>{
        if(req.headers.authorization===undefined||!req.headers.authorization.match(/^[0-9a-fA-F]{24}$/)){
            response.statusCode=403;
            response.data.message="Permission Denied!";
            res.status(response.statusCode).json(response);
            return reject(response);
        }
        let assignment=JSON.parse(req.body);
        getStudents(assignment.classId).then((students)=>{
            const assignees=students.map((item)=>({studentId: item, status: 'assigned'}))
            dbModel.assignmentsModel.create({
                ...assignment,
                assignees: assignees,
                assignedDate: moment()<moment(assignment.scheduled)?moment(assignment.scheduled).format():moment().format(),
                owner: req.headers.authorization
            },(err,result)=>{
                if(err){
                    response.statusCode=400;
                    response.data.payload=err.message||err.toString();
                    res.status(response.statusCode).json(response)
                    return reject(err);
                }
                getGoogleClassId(assignment.classId).then(gClassId=>{
                    getQuizName(assignment.quizId).then(async(quizName)=>{
                        const assignToGClass=await fetch(`${API}/gClassAssignment?courseId=${gClassId}`,{
                            method: 'POST',
                            headers:{
                                authorization: req.headers.authorization
                            },
                            body: JSON.stringify({...assignment, quizName})
                        });
                        const assignResult=await assignToGClass.json();
                        res.status(assignResult.statusCode).json(assignResult)
                    })
                })
            })
        })
    })
}

const handleRequest=(req,res)=>{
    return new Promise((resolve,reject)=>{
        switch(req.method){
            case 'GET': getAssignments(req,res); break;
            // case 'PUT': updateCourse(req,res); break;
            case 'POST': insertAssignment(req,res); break;
            default: res.status(200).json({err:'Method Not Allowed'}); break;
        }
    })
}

export default withMiddleware(handleRequest);
