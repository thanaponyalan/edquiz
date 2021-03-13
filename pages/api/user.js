import withMiddleware from "../../middlewares";
import {serialize} from 'cookie';
const dbModel=require('../../database/dbModel');

const getDetail=(req,res)=>{
    return new Promise((resolve,reject)=>{
        dbModel.usersModel.countDocuments({_id: req.query.uid},(err,count)=>{
            if(count>0){
                const usr=dbModel.usersModel.findById(req.query.uid,(err,user)=>{
                    if(!err){
                        // console.log(user);
                        res.json(user);
                    }else res.json(err)
                });
            }else res.json({})
        })
    });
}

export default withMiddleware(getDetail);