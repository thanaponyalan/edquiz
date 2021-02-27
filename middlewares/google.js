import {google} from 'googleapis';
import googleConfig from './google_config';
import {serialize} from 'cookie';
const dbModel=require('../database/dbModel');

const SCOPES = [
    'https://www.googleapis.com/auth/classroom.rosters.readonly',
    'https://www.googleapis.com/auth/classroom.profile.emails',
    'https://www.googleapis.com/auth/classroom.profile.photos',
    'https://www.googleapis.com/auth/classroom.courses.readonly',
    'https://www.googleapis.com/auth/classroom.coursework.me',
    'https://www.googleapis.com/auth/classroom.coursework.me.readonly',
    'https://www.googleapis.com/auth/classroom.coursework.students', 
    'https://www.googleapis.com/auth/classroom.coursework.students.readonly',
    'https://www.googleapis.com/auth/classroom.student-submissions.me.readonly', 
    'https://www.googleapis.com/auth/classroom.student-submissions.students.readonly'
];

const {client_secret, client_id, redirect_uri}=googleConfig.google;
const oAuth2Client=new google.auth.OAuth2(client_id, client_secret, redirect_uri);

let response={
    statusCode: null,
    data: {}
}

const setOAuth2Client=next=>async(req,res)=>{
    return new Promise((resolve,reject)=>{
        if(req.headers.authorization===undefined){
            response.statusCode=403;
            response.data.message="Permission Denied!";
            res.status(response.statusCode).json(response);
            return;
        }
        dbModel.usersModel.findById(req.headers.authorization,(err,result)=>{
            if(err)res.status(403).send(err);
            else{
                if(Date.now()>result.tokens.expiry_date&&!result.tokens.refresh_token){
                    response.statusCode=400;
                    response.data.message="Token Expired!"
                    res.status(response.statusCode).send(response)
                }
                else{
                    oAuth2Client.setCredentials(result.tokens);
                    return next(req,res,oAuth2Client);
                }
            }
        })
    });
}

const genOAuth2Url=(req,res)=>{
    const url=oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
        // prompt: 'consent'
        prompt: 'select_account'
    })
    var ret={url: url}
    res.json(ret);
}

const updateToken=(req,res)=>{
    return new Promise((resolve,reject)=>{
        const code=req.query.code;
        oAuth2Client.getToken(code,(err,tokens)=>{
            if(err)res.status(500).send(err);
            else{
                oAuth2Client.setCredentials(tokens);
                const classroom=google.classroom({version: 'v1', auth: oAuth2Client});
                classroom.userProfiles.get({
                    userId: 'me'
                },async(err,resp)=>{
                    if(err){
                        response.statusCode=err.code;
                        response.data.payload=err;
                        res.status(response.statusCode).send(response);
                        return reject();
                    }else{
                        var data=resp.data;
                        var emailAddress=data.emailAddress;
                        var firstName=data.name.givenName;
                        var familyName=data.name.familyName;
                        var photoUrl=data.photoUrl;
                        const updateTokens={
                            access_token: tokens.access_token,
                            refresh_token: tokens.refresh_token,
                            expiry_date: tokens.expiry_date
                        }
                        const existing_usr=await dbModel.usersModel.findOne({email: emailAddress})
                        const usr=await dbModel.usersModel.findOneAndUpdate({email: emailAddress},{firstName:firstName, familyName:familyName, photoUrl:photoUrl},{upsert: true, new: false});
                        updateTokens.refresh_token=(updateTokens.refresh_token)?updateTokens.refresh_token:usr.tokens.refresh_token;
                        const pushToken=await dbModel.usersModel.findOneAndUpdate({email: emailAddress},{tokens: updateTokens},{upsert:false, new: true});
                        res.setHeader('Set-Cookie',serialize('uid',pushToken._id,{path: '/'}));
                        res.writeHead(301,{Location:'/'}).end();
                        // res.status(200).send(usr._id);
                        return resolve();
                    }
                })
            }
        })

    });
}

export default{
    setOAuth2Client,
    genOAuth2Url,
    updateToken
};
