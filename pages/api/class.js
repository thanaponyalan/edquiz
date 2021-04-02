import withMiddleware from "../../middlewares";
import googleMiddleware from '../../middlewares/google';
import {google} from 'googleapis';
import dbModel from "../../database/dbModel";
import { Mongoose } from "mongoose";
import { API } from "../../constant/ENV";

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
        const {isTeacher}=req.query;
        if(isTeacher){
            dbModel.classesModel.find({owner: req.headers.authorization}).populate('courseId').populate('students').exec((err,classes)=>{
                if(!err){
                    response.data.payload=classes;
                    res.status(response.statusCode).json(response);
                    return resolve();
                }
                return reject(err);
            })
        }else{
            dbModel.classesModel.find({students:req.headers.authorization}).populate('courseId').exec((err,classes)=>{
                if(!err){
                    console.log(classes);
                    response.data.payload=classes;
                    res.status(response.statusCode).json(response);
                    return resolve();
                }
                return reject(err);
            })
        }
    })
}

const getStudentsId=async(students)=>{
    return Promise.all(students.map(async(stdItem)=>{
        const usr=await dbModel.usersModel.findOneAndUpdate({email: stdItem.profile.emailAddress},{
            email: stdItem.profile.emailAddress,
            familyName: stdItem.profile.name.familyName,
            firstName: stdItem.profile.name.givenName,
            photoUrl: stdItem.profile.photoUrl,
        },{upsert: true, new: true})
        return Promise.resolve(usr._id)
    }))
}

const insertClass=async(classObject)=>{
    return new Promise((resolve,reject)=>{
        dbModel.classesModel.create(classObject,(err,result)=>{
            if(err){
                response.statusCode=400;
                response.data.payload=err.message||err.toString();
                // res.status(response.statusCode).json(response)
                return reject(err);
            }
            response.data.payload=result;
            // res.status(response.statusCode).json(response);
            return resolve(response);
        })
    })
}

const importClass=async(req,res)=>{
    const classes=JSON.parse(req.body);
    return Promise.all(
        classes.map(async(classItem)=>{
            const url=`${API}/gStudent?courseId=${classItem.gClassId}`;
            const std=await fetch(url,{
                method: 'GET',
                headers:{
                    authorization: req.headers.authorization
                }
            });
            const stdRes=await std.json();
            const students=stdRes.data.payload;
            if(students){
                return getStudentsId(students).then(studentsId=>{
                    return insertClass({...classItem, students: studentsId, owner: req.headers.authorization}).then(data=>{
                        return Promise.resolve(data)
                    })
                })
            }else{
                return insertClass({...classItem, students:[], owner:req.headers.authorization}).then(data=>{
                    return Promise.resolve(data);
                })
            }
        })
    )
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
            case 'POST': importClass(req,res).then(resp=>{
                const hasError=resp.filter(item=>item.statusCode!=200);
                if(hasError.length){
                    response.statusCode=500;
                    response.data.payload='somethings went wrong'
                }else{
                    response.data.payload='Created'
                    res.status(response.statusCode).json(response)
                }
            }); break;
            // case 'PUT': updateQuestion(req,res); break;
            default: res.status(200).json({err:'Method Not Allowed'}); break;
        }
    })
}


export default withMiddleware(handleRequest);

// export default withMiddleware(googleMiddleware.setOAuth2Client(listClass));

