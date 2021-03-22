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
        if(req.headers.authorization===undefined||!req.headers.authorization.match(/^[0-9a-fA-F]{24}$/)){
            response.statusCode=403;
            response.data.message="Permission Denied!";
            res.status(response.statusCode).json(response);
            return reject(response);
        }
        dbModel.questionsModel.find({owner: req.headers.authorization}).populate('courseId').populate('objectiveId').populate('quizId').exec((err,questions)=>{
            if(!err){
                response.data.payload=questions
                res.status(response.statusCode).json(response);
                return resolve();
            }
            return reject(err)
        })
    })
}

const insertQuestion=async(req,res)=>{
    return new Promise((resolve,reject)=>{
        // if(req.headers.authorization===undefined){
        //     response.statusCode=403;
        //     response.data.message="Permission Denied!";
        //     res.status(response.statusCode).json(response);
        //     return reject(response);
        // }
        let question=JSON.parse(req.body);
        let quiz=question.quiz;

        if(quiz.id==0){
            dbModel.quizzesModel.create({courseId: question.courseId, quizName: quiz.title, owner: question.owner},(quizErr,quizResult)=>{
                if(quizErr){
                    response.statusCode=400;
                    response.data.payload=quizErr.message||quizErr.toString();
                    res.status(response.statusCode).json(response)
                    return reject(quizErr)
                }
                question.quizId=quizResult._id;
                dbModel.questionsModel.create(question,(questionErr,questionResult)=>{
                    if(questionErr){
                        response.statusCode=400;
                        response.data.payload=questionErr.message||questionErr.toString();
                        res.status(response.statusCode).json(response)
                        return reject(questionErr)
                    }
                    dbModel.quizzesModel.findByIdAndUpdate(question.quizId,{
                        $push: {questionId: questionResult._id}
                    },{new: true},(err,result)=>{
                        if(err){
                            response.statusCode=400;
                            response.data.payload=err.message||err.toString();
                            res.status(response.statusCode).json(response)
                            return reject(err)
                        }
                        response.data.payload={...result,...questionResult}
                        res.status(response.statusCode).json(response)
                    })
                })
            })
        }else if(quiz.id==-1){
            delete question.quizId;
            dbModel.questionsModel.create(question,(err,result)=>{
                if(err){
                    response.statusCode=400;
                    response.data.payload=err.message||err.toString();
                    res.status(response.statusCode).json(response)
                    return reject(questionErr)
                }
                response.data.payload=result;
                res.status(response.statusCode).json(response)
            })
        }else{
            dbModel.questionsModel.create(question,(questionErr,questionResult)=>{
                if(questionErr){
                    response.statusCode=400;
                    response.data.payload=questionErr.message||questionErr.toString();
                    res.status(response.statusCode).json(response)
                    return reject(questionErr)
                }
                dbModel.quizzesModel.findByIdAndUpdate(question.quizId,{
                    $push: {questionId: questionResult._id}
                },{new: true},(err,result)=>{
                    if(err){
                        response.statusCode=400;
                        response.data.payload=err.message||err.toString();
                        res.status(response.statusCode).json(response)
                        return reject(err)
                    }
                    response.data.payload={...result,...questionResult}
                    res.status(response.statusCode).json(response)
                })
            })
        }
    })
}

const updateQuestion=async(req,res)=>{
    return new Promise((resolve,reject)=>{
        // if(req.headers.authorization===undefined){
        //     response.statusCode=403;
        //     response.data.message="Permission Denied!";
        //     res.status(response.statusCode).json(response);
        //     return reject(response);
        // }
        let question=JSON.parse(req.body);
        let id=question.id;
        let quiz=question.quiz;
        delete question.id;
        if(quiz.id==-1){
            delete question.quizId;
            dbModel.questionsModel.findByIdAndUpdate(id,question,{upsert: true, new: true},(err,result)=>{
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
        }else{
            dbModel.questionsModel.findByIdAndUpdate(id,question,{upsert: true, new: true},(err,result)=>{
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
        }
    })
}

const handleRequest=(req,res)=>{
    return new Promise((resolve,reject)=>{
        switch(req.method){
            case 'GET': getQuestion(req,res); break;
            case 'POST': insertQuestion(req,res); break;
            case 'PUT': updateQuestion(req,res); break;
            default: res.status(200).json({err:'Method Not Allowed'}); break;
        }
    })
}

export default withMiddleware(handleRequest);

export const config = {
    api: {
      bodyParser: {
        sizeLimit: '5mb',
      },
    },
  }
