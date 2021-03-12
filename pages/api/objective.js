import withMiddleware from "../../middlewares";
const dbModel=require('../../database/dbModel');

let response={
    statusCode: 200,
    data:{
        payload: {}
    }
}

const updateObjective=async(req,res)=>{
    return new Promise((resolve,reject)=>{
        // if(req.headers.authorization===undefined){
        //     response.statusCode=403;
        //     response.data.message="Permission Denied!";
        //     res.status(response.statusCode).json(response);
        //     return reject(response);
        // }
        let objective=JSON.parse(req.body)
        dbModel.objectivesModel.findByIdAndUpdate(objective._id,{
            objective: objective.objective,
            bloomLevel: objective.bloomLevel
        },{upsert: true, new: true},(err,result)=>{
            if(!err){
                response.data.payload=result;
                res.status(response.statusCode).json(response)
                return resolve();
            }
            response.data.payload=err;
            response.statusCode=400;
            res.status(response.statusCode).json(response);
            return reject(err);
        })
    })
}

const insertObjective=async(req,res)=>{
    return new Promise((resolve,reject)=>{
        // if(req.headers.authorization===undefined){
        //     response.statusCode=403;
        //     response.data.message="Permission Denied!";
        //     res.status(response.statusCode).json(response);
        //     return reject(response);
        // }
        let objective=JSON.parse(req.body);
        dbModel.objectivesModel.create(objective,(err,result)=>{
            if(err){
                response.statusCode=400;
                response.data.payload=err.message||err.toString();
                res.status(response.statusCode).json(response)
                return reject(err);
            }
            dbModel.coursesModel.findByIdAndUpdate(objective.courseId,{
                $push: {objectives: result._id}
            },{new: true},(courseErr,courseResult)=>{
                if(courseErr){
                    response.statusCode=400;
                    response.data.payload=err.message||err.toString();
                    res.status(response.statusCode).json(response)
                    return reject(err);
                }
                response.data.payload=courseResult;
                res.status(response.statusCode).json(response);
                return resolve();
            })
        })
    })
}

const handleRequest=(req,res)=>{
    return new Promise((resolve,reject)=>{
        switch(req.method){
            case 'PUT': updateObjective(req,res); break;
            case 'POST': insertObjective(req,res); break;
            default: res.status(400).json({res:'Method Not Allow'}); break;
        }
    })
}

export default withMiddleware(handleRequest);
