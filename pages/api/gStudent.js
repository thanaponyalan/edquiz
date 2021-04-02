import withMiddleware from "../../middlewares";
import googleMiddleware from '../../middlewares/google';
import { google } from 'googleapis';
import { API } from "../../constant/ENV";

let response = {
    statusCode: 200,
    data: {}
}

const listStudent = (req, res, oAuth2Client) => {
    return new Promise((resolve, reject) => {
        const {courseId}=req.query;
        const classroom = google.classroom({ version: 'v1', auth: oAuth2Client });
        classroom.courses.students.list({
            courseId: courseId
        },(err, studentRes)=>{
            if(err){
                response.statusCode = err.code;
                var errorMessage = err.errors;
                response.data.message = errorMessage[0].message;
                res.status(response.statusCode).json(response);
                return reject(response);
            }
            response.data={
                payload: studentRes.data.students
            }
            res.status(response.statusCode).json(response)
        })
    });
}

const handleRequest=(req,res,oAuth2Client)=>{
    return new Promise((resolve,reject)=>{
        switch(req.method){
            case 'GET': listStudent(req,res,oAuth2Client); break;
            // case 'POST': insertClass(req,res); break;
            // case 'PUT': updateQuestion(req,res); break;
            default: res.status(200).json({err:'Method Not Allowed'}); break;
        }
    })
}

export default withMiddleware(googleMiddleware.setOAuth2Client(handleRequest));