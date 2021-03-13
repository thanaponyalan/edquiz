import withMiddleware from "../../middlewares";
const dbModel=require('../../database/dbModel');

let response={
    statusCode: 200,
    data:{
        payload: {}
    }
}

const getQuestion=async(req,res)=>{
    return new Promise((resolve, reject)=>{
        if(req.headers.authorization===undefined){
            response.statusCode=403;
            response.data.message="Permission Denied!";
            res.status(response.statusCode).json(response);
            return reject(response);
        }
        dbModel.questionsModel.find({owner: req.headers.authorization},(err,questions)=>{
            if(!err){
                response.data.payload=questions
                res.status(response.statusCode).json(response);
                return resolve();
            }
            return reject(err)
        })
    })
}

const handleRequest=(req,res)=>{
    return new Promise((resolve,reject)=>{
        switch(req.method){
            case 'GET': getQuestion(req,res); break;
            default: res.status(200).json({err:'Method Not Allowed'}); break;
        }
    })
}

export default withMiddleware(handleRequest);
