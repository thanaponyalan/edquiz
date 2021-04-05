import withMiddleware from "../../middlewares";
import {serialize} from 'cookie';
import moment from 'moment'
const dbModel=require('../../database/dbModel');

let response={
    statusCode: 200,
    data:{
        payload: {}
    }
}

const getCourses=async(req,res)=>{
    return new Promise((resolve, reject)=>{
        if(req.headers.authorization===undefined){
            response.statusCode=403;
            response.data.message="Permission Denied!";
            res.status(response.statusCode).json(response);
            return reject(response);
        }
        dbModel.coursesModel.find({owner: req.headers.authorization}).populate('objectives').exec((err,courses)=>{
            if(!err){
                response.data.payload=courses
                res.status(response.statusCode).json(response);
                return resolve();
            }
            return reject(err);
        })
    })
}

const updateCourse=async(req,res)=>{
    return new Promise((resolve,reject)=>{
        if(req.headers.authorization===undefined){
            response.statusCode=403;
            response.data.message="Permission Denied!";
            res.status(response.statusCode).json(response);
            return reject(response);
        }
        let course=JSON.parse(req.body)
        dbModel.coursesModel.findByIdAndUpdate(course._id,{
            courseName: course.courseName,
            courseNo: course.courseNo,
            courseDescription: course.courseDescription
        },{upsert: true, new: true},(err,result)=>{
            if(!err){
                response.data.payload=result;
                res.status(response.statusCode).json(response)
                return resolve();
            }
            response.data.payload=err;
            response.statusCode=400;
            res.status(response.statusCode).json(response);
            return reject(err);
        })
        
    })
}

const insertHistory=async(req,res)=>{
    return new Promise((resolve,reject)=>{
        if(req.headers.authorization===undefined||!req.headers.authorization.match(/^[0-9a-fA-F]{24}$/)){
            response.statusCode=403;
            response.data.message="Permission Denied!";
            res.status(response.statusCode).json(response);
            return reject(response);
        }
        let history=JSON.parse(req.body)
        let lastUpdate=moment(new Date()).format();
        dbModel.historiesModel.create({...history, lastUpdate: lastUpdate},(err,result)=>{
            if(err){
                response.statusCode=400;
                response.data.payload=err.message||err.toString();
                res.status(response.statusCode).json(response)
                return reject(err);
            }
            dbModel.assignmentsModel.findOneAndUpdate({_id: history.assignmentId, 'assignees.studentId': req.headers.authorization},{
                $set:{
                    'assignees.$.status': 'done',
                    'assignees.$.historyId': result._id,
                    'assignees.$.lastUpdate': lastUpdate
                }
            },{new: true},(assignmentErr,assignmentResult)=>{
                if(assignmentErr){
                    response.statusCode=400;
                    response.data.payload=assignmentErr.message||assignmentErr.toString();
                    res.status(response.statusCode).json(response)
                    return reject(err);
                }
                response.data.payload=assignmentResult;
                res.status(response.statusCode).json(response);
                return resolve();
            })
        })
    })
}

const handleRequest=(req,res)=>{
    return new Promise((resolve,reject)=>{
        switch(req.method){
            // case 'GET': getCourses(req,res); break;
            // case 'PUT': updateCourse(req,res); break;
            case 'POST': insertHistory(req,res); break;
            default: res.status(200).json({err:'Method not allow'}); break;
        }
    })
}

export default withMiddleware(handleRequest);