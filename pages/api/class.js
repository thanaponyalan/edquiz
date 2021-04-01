import withMiddleware from "../../middlewares";
import googleMiddleware from '../../middlewares/google';
import {google} from 'googleapis';
import dbModel from "../../database/dbModel";

let response={
    statusCode: 200,
    data:{
        payload: {}
    }
}

const getClass=async(req,res)=>{
    return new Promise((resolve, reject)=>{
        if(req.headers.authorization===undefined||!req.headers.authorization.match(/^[0-9a-fA-F]{24}$/)){
            response.statusCode=403;
            response.data.message="Permission Denied!";
            res.status(response.statusCode).json(response);
            return reject(response);
        }
        dbModel.classesModel.find({owner: req.headers.authorization}).populate('courseId').populate('students').exec((err,classes)=>{
            if(!err){
                response.data.payload=classes;
                res.status(response.statusCode).json(response);
                return resolve();
            }
            return reject(err);
        })
    })
}

// const listClass=(req,res,oAuth2Client)=>{
//     return new Promise((resolve,reject)=>{
//         const classroom=google.classroom({version: 'v1', auth: oAuth2Client});  
//         classroom.courses.list({
//             courseStates: 'ACTIVE'
//         },(err,courseRes)=>{
//             if(err){
//                 response.statusCode=err.code;
//                 var errorMessage=err.errors;
//                 response.data.message=errorMessage[0].message;
//                 res.status(response.statusCode).json(response);
//                 console.log(response);
//                 return reject();
//                 // res.status(500).send(err);
//                 // throw err;
//                 // reject();
//             }else{
//                 const courses=courseRes.data.courses;
//                 let response={
//                     statusCode: 200,
//                     data:{
//                         payload: courses
//                     }
//                 }
//                 console.log(response);
//                 res.status(response.statusCode).json(response);
//                 // resolve();
//             }
//         })
//     });
// }

const handleRequest=(req,res)=>{
    return new Promise((resolve,reject)=>{
        switch(req.method){
            case 'GET': getClass(req,res); break;
            // case 'POST': insertQuestion(req,res); break;
            // case 'PUT': updateQuestion(req,res); break;
            default: res.status(200).json({err:'Method Not Allowed'}); break;
        }
    })
}


export default withMiddleware(handleRequest);

// export default withMiddleware(googleMiddleware.setOAuth2Client(listClass));

