import withMiddleware from "../../middlewares";
import googleMiddleware from '../../middlewares/google';
import { google } from 'googleapis';
import { API } from "../../constant/ENV";
import moment from "moment";

let response = {
    statusCode: 200,
    data: {}
}

const fakeData={
    courseId: '299060908498',
    courseWorkId: '330364076452',
}

const listCourseWork=async(req,oAuth2Client)=>{
    return new Promise(async(resolve,reject)=>{
        const classroom=google.classroom({version: "v1", auth: oAuth2Client});
        const list=await classroom.courses.courseWork.studentSubmissions.list({
            ...fakeData,
            userId: 'me'
        })
        response.data.payload=list.data;
        return resolve(response)
    })
}

const patchCourseWork=async(req,oAuth2Client)=>{
    return new Promise(async(resolve,reject)=>{
        const classroom=google.classroom({version: 'v1', auth: oAuth2Client});
        const patch=await classroom.courses.courseWork.studentSubmissions.patch({
            
        })
    })
}

const getCourseWorkId=(payload, classroom)=>{
    return new Promise(async(resolve,reject)=>{
        try{
            const listCourseWork=await classroom.courses.courseWork.studentSubmissions.list({
                courseId: payload.courseId,
                courseWorkId: payload.courseWorkId,
                userId: payload.userId||'me' 
            })
            return resolve(listCourseWork.data.studentSubmissions[0].id)
        }catch(err){
            return reject(err)
        }
    })
}

const turnIn=async(req,oAuth2Client)=>{
    const assignmentDetail=JSON.parse(req.body)
    return new Promise((resolve,reject)=>{
        const classroom=google.classroom({version: 'v1', auth: oAuth2Client});
        getCourseWorkId(assignmentDetail, classroom).then(async(submissionId)=>{
            const turnInStudentSubmit=await classroom.courses.courseWork.studentSubmissions.turnIn({
                ...courseDetail,
                id: submissionId
            })
            response.data.payload=turnInStudentSubmit
            return resolve(response)
        }).catch(err=>{
            response.statusCode=400;
            response.data.payload=err
            return reject(response)
        })
    })
}

const patchAndReturn=async(req,oAuth2Client)=>{
    //const assignmentDetail=JSON.parse(req.body)
    return new Promise(async(resolve,reject)=>{
        const classroom=google.classroom({version: 'v1', auth: oAuth2Client});
        getCourseWorkId({courseId: '299060908498', courseWorkId: '326478127859', userId: 'thanaponyalan@gmail.com'}, classroom).then(async(submissionId)=>{
            const patch=await classroom.courses.courseWork.studentSubmissions.patch({
                courseId: '299060908498',
                courseWorkId: '326478127859',
                id: submissionId,
                updateMask: 'assignedGrade',
                requestBody:{
                    assignedGrade: 5,
                }
            })
            const ret=await classroom.courses.courseWork.studentSubmissions.return({
                courseId: '299060908498',
                courseWorkId: '326478127859',
                id: submissionId,
            })
            response.data.payload=ret.data;
            resolve(response)
        })
    })
}

const handleRequest=(req,res,oAuth2Client)=>{
    return new Promise((resolve,reject)=>{
        switch(req.method){
            case 'GET': patchAndReturn(req,oAuth2Client).then(data=>{
                res.status(data.statusCode).json(data)
            }); break;
            case 'PUT': 
                turnIn(req, oAuth2Client).then(result=>{
                    res.status(result.statusCode).json(result)
                }).catch(err=>{
                    res.status(err.statusCode).json(err)
                })
                break;
            default: res.status(200).json({err:'Method Not Allowed'}); break;
        }
    })
}

export default withMiddleware(googleMiddleware.setOAuth2Client(handleRequest));