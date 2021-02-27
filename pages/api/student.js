import withMiddleware from "../../middlewares";
import googleMiddleware from '../../middlewares/google';
import {google} from 'googleapis';

const listStudent=(req,res,oAuth2Client)=>{
    return new Promise((resolve,reject)=>{
        const classroom=google.classroom({version: 'v1', auth: oAuth2Client});
        classroom.courses.students.list({
            courseId: req.body.courseId
        },(err,studentRes)=>{
            if(err){
                console.log(err)
                res.status(500).send(err);
                reject();
            }else{
                const students=studentRes.data.students;
                res.status(200).json(students);
                resolve();
            }
        })
    });
}

export default withMiddleware(googleMiddleware.setOAuth2Client(listStudent));

