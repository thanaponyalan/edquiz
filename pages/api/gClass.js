import withMiddleware from "../../middlewares";
import googleMiddleware from '../../middlewares/google';
import { google } from 'googleapis';

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
                console.log(response);
                return reject();
                // res.status(500).send(err);
                // throw err;
                // reject();
            } else {
                const courses = courseRes.data.courses;
                let response = {
                    statusCode: 200,
                    data: {
                        payload: courses
                    }
                }
                console.log(response);
                res.status(response.statusCode).json(response);
                // resolve();
            }
        })
    });
}

export default withMiddleware(googleMiddleware.setOAuth2Client(listClass));