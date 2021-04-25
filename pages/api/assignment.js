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
        const {isTeacher}=req.query;
        if(isTeacher){
            dbModel.assignmentsModel.find({owner: req.headers.authorization}).populate('classId').populate('quizId').populate('assignees.studentId').populate('assignees.historyId').exec((err,assignments)=>{
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
                        const updateCourseWork=await updateAssignmentCourseWork({assignmentId: result._id, courseWorkId: assignResult.data.payload.id})
                        res.status(assignResult.statusCode).json({...assignResult,...updateCourseWork})
                    })
                })
            })
        })
    })
}

const updateAssignmentCourseWork=async(data)=>{
    return new Promise((resolve,reject)=>{
        dbModel.assignmentsModel.findOneAndUpdate({_id: data.assignmentId},{
            courseWorkId: data.courseWorkId
        },{new: true},(err,res)=>{
            if(err){
                return reject(err)
            }
            return resolve(res)
        })
    })
}

const updateAndTurnIn=(data)=>{
    return new Promise((resolve,reject)=>{
        dbModel.assignmentsModel.findOneAndUpdate({_id: data.assignmentId, 'assignees.studentId': data.studentId},{
            $set:{
                'assignees.$.status': 'done',
                'assignees.$.lastUpdate': moment().format(),
                'assignees.$.score': data.score,
                'assignees.$.totalScore': data.totalScore
            }
        },{new: true},(err,res)=>{
            if(err){
                response.statusCode=400;
                response.data.payload=err;
                return reject(response)
            }
            getGoogleClassId(res.classId).then(async(gClassId)=>{
                const url=`${API}/googleCourseWork`;
                const turnInRes=await fetch(url,{
                    method: 'PUT',
                    headers:{
                        authorization: data.studentId
                    },
                    body: JSON.stringify({courseId: gClassId, courseWorkId: res.courseWorkId})
                })
                const turnIn=await turnInRes.json();
                response.data.payload={...res,...turnIn};
                return resolve(response)
            })
        })
    })
}

const updateStatus=(data)=>{
    return new Promise((resolve,reject)=>{
        dbModel.assignmentsModel.findOneAndUpdate({_id: data.assignmentId, 'assignees.studentId': data.studentId},{
            $set:{
                'assignees.$.status': data.status,
                'assignees.$.lastUpdate': moment().format(),
            }
        },{new: true},(err,res)=>{
            if(err){
                return reject(err)
            }
            return resolve(res)
        })
    })
}

const updateAndReturn=(data,uid)=>{
    return new Promise((resolve,reject)=>{
        Promise.all(
            data.userId.map(user=>
                updateStatus({assignmentId: data.assignmentId, studentId: user._id, status: 'graded'}).then(async(status)=>{
                    const url=`${API}/googleCourseWork?isTeacher=1`
                    const result=await fetch(url,{
                        method: 'PUT',
                        headers:{
                            authorization: uid
                        },
                        body: JSON.stringify({courseId: data.courseId, courseWorkId: data.courseWorkId, userId: user.email, score: user.score})
                    })
                })
            )
        ).then(result=>{
            response.data.payload='OK'
            return resolve(response)
        }).catch(err=>{
            response.statusCode=400;
            response.data.payload=err;
            return reject(response)
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
            case 'GET': getAssignments(req,res); break;
            case 'PUT': 
                const data=JSON.parse(req.body)
                if(data.state=='markAsDone'&&data.assignmentId){
                    updateAndTurnIn({assignmentId: data.assignmentId, score: data.score, totalScore: data.totalScore, studentId: req.headers.authorization}).then(result=>{
                        res.status(result.statusCode).json(result)
                    }).catch(err=>{
                        res.status(err.statusCode).json(err)
                    })
                }else if(data.state=='returnAndPatch'){
                    updateAndReturn(data, req.headers.authorization).then(result=>{
                        res.status(result.statusCode).json(result)
                    }).catch(err=>{
                        res.status(err.statusCode).json(err)
                    })
                }else {
                    res.status(200).json({err:'Method Not Allowed'});
                }
                break;
            case 'POST': insertAssignment(req,res); break;
            default: res.status(200).json({err:'Method Not Allowed'}); break;
        }
    })
}

export default withMiddleware(handleRequest);
