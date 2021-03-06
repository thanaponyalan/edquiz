import withMiddleware from "../../middlewares";
import googleMiddleware from '../../middlewares/google';
import { google } from 'googleapis';
import { API } from "../../constant/ENV";

let response = {
    statusCode: null,
    data: {}
}

const listClass = (req, res, oAuth2Client) => {
    return new Promise((resolve, reject) => {
        const classroom = google.classroom({ version: 'v1', auth: oAuth2Client });
        classroom.courses.list({
            teacherId: 'me',
            courseStates: 'ACTIVE'
        }, (err, courseRes) => {
            if (err) {
                response.statusCode = err.code;
                var errorMessage = err.errors;
                response.data.message = errorMessage[0].message;
                res.status(response.statusCode).json(response);
                return reject(response);
                // res.status(500).send(err);
                // throw err;
                // reject();
            } else {
                // const courses = courseRes.data.courses;
                const url=`${API}/class?isTeacher=1`
                fetch(url,{
                    method: 'GET',
                    headers:{
                        authorization: req.headers.authorization
                    }
                }).then(response=>response.json()).then((resp)=>{
                    if(resp.statusCode!=200){
                        return resp;
                    }
                    const classes=resp.data.payload;
                    const existingClass=classes.map((item)=>{return item.gClassId})
                    let courses=[]
                    if(courseRes.data.courses){
                        courses=courseRes.data.courses.filter(item=>!existingClass.includes(item.id));
                    }
                    let response = {
                        statusCode: 200,
                        data: {
                            payload: courses
                        }
                    }
                    res.status(response.statusCode).json(response);
                });
                // resolve();
            }
        })
    });
}

const handleRequest=(req,res,oAuth2Client)=>{
    return new Promise((resolve,reject)=>{
        switch(req.method){
            case 'GET': listClass(req,res,oAuth2Client); break;
            // case 'POST': insertClass(req,res); break;
            // case 'PUT': updateQuestion(req,res); break;
            default: res.status(200).json({err:'Method Not Allowed'}); break;
        }
    })
}

export default withMiddleware(googleMiddleware.setOAuth2Client(handleRequest));