import withMiddleware from "../../middlewares";
import {serialize} from 'cookie';
const dbModel=require('../../database/dbModel');

const getCourses=async(req,res)=>{
    let response={}
    return new Promise((resolve, reject)=>{
        if(req.headers.authorization===undefined){
            response.statusCode=403;
            response.data.message="Permission Denied!";
            res.status(response.statusCode).json(response);
            return reject();
        }
        dbModel.coursesModel.find({owner: req.headers.authorization}).populate('objectives').exec((err,courses)=>{
            if(!err){
                response={
                    statusCode: 200,
                    data:{
                        payload: courses
                    }
                }
                res.status(response.statusCode).json(response);
                return resolve();
            }
            return reject();
        })
    })
}

const handleRequest=(req,res)=>{
    return new Promise((resolve,reject)=>{
        switch(req.method){
            case 'GET': getCourses(req,res); break;
            default: res.status(200).json({test:'test'}); break;
        }
    })
}

export default withMiddleware(handleRequest);
