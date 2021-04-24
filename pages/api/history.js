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

const getHistory=(params)=>{
    return new Promise((resolve,reject)=>{
        dbModel.historiesModel.findOne(params).populate('questions').exec((err,history)=>{
            if(err){
                response.statusCode=400;
                response.data.payload=err;
                return reject(response)
            }
            response.data.payload=history
            return resolve(response)
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

const updateHistoryQuestion=(data)=>{
    return new Promise((resolve,reject)=>{
        dbModel.historiesModel.findOneAndUpdate({assignmentId: data.assignmentId, studentId: data.studentId},{
            $push:{questions: data.question},
            lastUpdate: moment().format()
        },{upsert: true, new: true},(err,res)=>{
            if(err){
                return reject(err)
            }
            return resolve(res)
        })
    })
}

const updateAssigneeStatus=(data)=>{
    return new Promise((resolve,reject)=>{
        dbModel.assignmentsModel.findOneAndUpdate({_id: data.assignmentId, 'assignees.studentId': data.studentId},{
            $set:{
                'assignees.$.status': 'in-progress',
                'assignees.$.historyId': data.historyId,
                'assignees.$.lastUpdate': moment().format()
            }
        },{new: true},(err,res)=>{
            if(err){
                return reject(err)
            }
            return resolve(res)
        })
    })
}

const updateHistory=async(req)=>{
    return new Promise((resolve,reject)=>{
        const history=JSON.parse(req.body)
        updateHistoryQuestion(history).then(hist=>{
            updateAssigneeStatus({...history, historyId: hist._id}).then(ass=>{
                response.data.payload=ass
                return resolve(response)
            }).catch(err=>{
                response.statusCode=400
                response.data.payload=err;
                return reject(response)
            })
        })
    })
}

const handleRequest=(req,res)=>{
    return new Promise((resolve,reject)=>{
        if(req.headers.authorization===undefined||!req.headers.authorization.match(/^[0-9a-fA-F]{24}$/)){
            response.statusCode=403;
            response.data.message="Permission Denied!";
            res.status(response.statusCode).json(response);
            return reject(response);
        }
        switch(req.method){
            case 'GET': 
                const {assignmentId}=req.query
                getHistory({assignmentId: assignmentId, studentId: req.headers.authorization}).then(history=>{
                    res.status(history.statusCode).json(history)
                }).catch(err=>{
                    res.status(err.statusCode).json(err)
                })
                break;
            case 'PUT': 
                updateHistory(req).then(result=>{
                    res.status(result.statusCode).json({...result, data:{payload: 'ok'}})
                }).catch(err=>{
                    res.status(err.statusCode).json(err)
                }); 
                break;
            case 'POST': insertHistory(req,res); break;
            default: res.status(200).json({err:'Method not allow'}); break;
        }
    })
}

export default withMiddleware(handleRequest);