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
        const {quizId}=req.query;
        if(quizId){
            dbModel.questionsModel.find({quizId: quizId}).populate('courseId').populate('objectiveId').populate('quizId').exec((err,questions)=>{
                if(!err){
                    response.data.payload=questions
                    res.status(response.statusCode).json(response);
                    return resolve();
                }
                return reject(err)
            })
        }else{
            dbModel.questionsModel.find({owner: req.headers.authorization}).populate('courseId').populate('objectiveId').populate('quizId').exec((err,questions)=>{
                if(!err){
                    response.data.payload=questions
                    res.status(response.statusCode).json(response);
                    return resolve();
                }
                return reject(err)
            })
        }
    })
}

const insertQuiz=(data)=>{
    return new Promise((resolve,reject)=>{
        dbModel.quizzesModel.create(data,(err,res)=>{
            if(err){
                return reject(err)
            }
            return resolve(res._id)
        })
    })
}

const insertQuizzes=async(quizzes,question)=>{
    return new Promise((resolve,reject)=>{
        Promise.all(
            quizzes.map(async(quiz)=>{
                if(quiz.id!=0)return quiz.id
                return insertQuiz({courseId: question.courseId, quizName: quiz.title, owner: question.owner})
            })
        )
        .then(quizzesRes=>resolve(quizzesRes))
        .catch(err=>reject(err))
    })
}

const updateQuiz=(quizId,questionId)=>{
    return new Promise((resolve,reject)=>{
        dbModel.quizzesModel.findByIdAndUpdate(quizId,{
            $push: {questionId: questionId}
        },{new: true},(err,result)=>{
            if(err){
                return reject(err)
            }
            return resolve(result._id)
        })
    })
}

const updateQuizzes=async(quizzesId,questionId)=>{
    return new Promise((resolve,reject)=>{
        Promise.all(
            quizzesId.map(async(quiz)=>updateQuiz(quiz,questionId))
        )
        .then(res=>resolve(res))
        .catch(err=>reject(err))
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
        let quizzes=question.quizzes;

        if(quizzes.length){
            insertQuizzes(quizzes,question).then(quizzesId=>{
                question.quizId=quizzesId
                dbModel.questionsModel.create(question,(err,questionRes)=>{
                    if(err){
                        response.statusCode=400;
                        response.data.payload=err.message||err.toString();
                        res.status(response.statusCode).json(response)
                        return reject(response)
                    }
                    updateQuizzes(quizzesId,questionRes._id).then(quizResult=>{
                        response.data.payload={...questionRes,...quizResult}
                        res.status(response.statusCode).json(response)
                        resolve(response)
                    }).catch(err=>{
                        response.data.payload=err.message||err.toString();
                        response.statusCode=400;
                        res.status(response.statusCode).json(response)
                        reject(response)
                    })
                })
            })
        }else{
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
        }
    })
}

const removeFromQuiz=(questionId)=>{
    return new Promise((resolve,reject)=>{
        dbModel.quizzesModel.updateMany({questionId: questionId},{$pull:{questionId: questionId}},(err,res)=>{
            if(err)return reject(err);
            return resolve(res)
        })
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
        let quizzes=question.quizzes;
        delete question.id;
        removeFromQuiz(id).then(quizRes=>{
            if(quizzes.length){
                insertQuizzes(quizzes,question).then(quizzesId=>{
                    question.quizId=quizzesId
                    dbModel.questionsModel.findByIdAndUpdate(id,question,{upsert: true, new: true},(err,questionRes)=>{
                        if(err){
                            response.statusCode=400;
                            response.data.payload=err.message||err.toString();
                            res.status(response.statusCode).json(response)
                            return reject(response)
                        }
                        updateQuizzes(quizzesId,questionRes._id).then(quizResult=>{
                            response.data.payload={...questionRes,...quizResult}
                            res.status(response.statusCode).json(response)
                            resolve(response)
                        }).catch(err=>{
                            response.data.payload=err.message||err.toString();
                            response.statusCode=400;
                            res.status(response.statusCode).json(response)
                            reject(response)
                        })
                    })
                })
            }else{
                question.quizId=undefined
                dbModel.questionsModel.findByIdAndUpdate(id,question,{upsert: true, new: true},(err,questionRes)=>{
                    if(err){
                        response.statusCode=400;
                        response.data.payload=err.message||err.toString();
                        res.status(response.statusCode).json(response)
                        return reject(response)
                    }
                    response.data.payload=questionRes
                    res.status(response.statusCode).json(response)
                    return resolve(response)
                })
            }
        })
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
        sizeLimit: '10mb',
      },
    },
  }
