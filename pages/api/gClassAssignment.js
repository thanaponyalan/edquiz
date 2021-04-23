import withMiddleware from "../../middlewares";
import googleMiddleware from '../../middlewares/google';
import { google } from 'googleapis';
import { API } from "../../constant/ENV";
import moment from "moment";

let response = {
    statusCode: 200,
    data: {}
}

const insertAssignment=async(req,res,oAuth2Client)=>{
    let body={
        "title": "QuizName",
        "description": "จงทำข้อสอบให้แล้วเสร็จภายในเวลาที่กำหนด",
        "workType": "ASSIGNMENT",
        "materials": [
            {
                "link": {
                    "url": "https://edquiz.vercel.app",
                    "title": "TEST"
                }
            }
        ],
        "state": "PUBLISHED",
        "dueDate": {
            "day": 6,
            "month": 4,
            "year": 2021
        },
        "dueTime": {
            "hours": 23,
            "minutes": 59,
            "seconds": 59
        },
        "associatedWithDeveloper": true
    }
    const assignment=JSON.parse(req.body)
    body.title=assignment.quizName;
    body.dueDate={
        day: moment.utc(assignment.dueDate).format('D'),
        month: moment.utc(assignment.dueDate).format('M'),
        year: moment.utc(assignment.dueDate).format('YYYY')
    }
    body.dueTime={
        hours: moment.utc(assignment.dueDate).hours(),
        minutes: moment.utc(assignment.dueDate).minutes(),
        seconds: moment.utc(assignment.dueDate).seconds()
    }
    if(moment()<moment(assignment.scheduled)){
        body.scheduledTime=assignment.scheduled
        body.state="DRAFT"
    }
    const classroom = google.classroom({ version: 'v1', auth: oAuth2Client });
    const result = await classroom.courses.courseWork.create({
        courseId: req.query.courseId,
        requestBody: body
    });
    response.statusCode=result.status;
    response.data.payload=result.data
    res.status(response.statusCode).json(response)
}

const handleRequest=(req,res,oAuth2Client)=>{
    return new Promise((resolve,reject)=>{
        switch(req.method){
            //case 'GET': listClass(req,res,oAuth2Client); break;
            case 'POST': insertAssignment(req,res,oAuth2Client); break;
            // case 'PUT': updateQuestion(req,res); break;
            default: res.status(200).json({err:'Method Not Allowed'}); break;
        }
    })
}

export default withMiddleware(googleMiddleware.setOAuth2Client(handleRequest));