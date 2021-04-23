import withMiddleware from "../../middlewares";
const dbModel=require('../../database/dbModel');

let response={
    statusCode: 200,
    data:{
        payload: {}
    }
}

const getQuiz=async(req,res)=>{
    return new Promise((resolve, reject)=>{
        if(req.headers.authorization===undefined||!req.headers.authorization.match(/^[0-9a-fA-F]{24}$/)){
            response.statusCode=403;
            response.data.message="Permission Denied!";
            res.status(response.statusCode).json(response);
            return reject(response);
        }
        dbModel.quizzesModel.find({owner: req.headers.authorization}).populate('courseId').populate('questionId').exec((err,quizzes)=>{
            if(!err){
                response.data.payload=quizzes;
                res.status(response.statusCode).json(response);
                return resolve();
            }
            return reject(err)
        })
    })
}

const removeQuizId=async(questionId)=>{
    return new Promise(async(resolve,reject)=>{
        try{
            const updated=await dbModel.questionsModel.updateMany({_id: questionId},{
                quizId: undefined
            })
            return resolve(updated)
        }catch(err){
            console.log(err);
            return reject(err)
        }
    })
}

const updateQuizId=async(questionId, quizId)=>{
    return new Promise(async(resolve,reject)=>{
        try{
            const updated=await dbModel.questionsModel.updateMany({_id: questionId},{
                quizId: quizId
            })
            return resolve(updated)
        }catch(err){
            console.log(err);
            return reject(err)
        }
    })
}

const updateQuestionInQuiz=async(quizId, questionId)=>{
    return new Promise(async(resolve,reject)=>{
        try{
            const updated=await dbModel.quizzesModel.findByIdAndUpdate(quizId,{
                questionId: questionId
            },{new: true})
            return resolve(updated)
        }catch(err){
            console.log(err);
            return reject(err)
        }
    })
}

const updateQuiz=async(req)=>{ //ขาดเงื่อนไขกรณีที่ไม่มีคำถามเหลือในข้อสอบเลย
    return new Promise((resolve,reject)=>{
        if(req.headers.authorization===undefined||!req.headers.authorization.match(/^[0-9a-fA-F]{24}$/)){
            response.statusCode=403;
            response.data.message="Permission Denied!";
            return reject(response);
        }
        const quiz=JSON.parse(req.body)

        try{
            if(quiz.diff.length){
                quiz.diff.map(diff=>removeQuizId(diff).then((removed)=>{
                    quiz.questionId.map(question=>updateQuizId(question, quiz._id).then((updated)=>{
                        updateQuestionInQuiz(quiz._id, quiz.questionId).then((result)=>{
                            response.data.payload={...result, ...updated, ...removed}
                            return resolve(response)
                        })
                    }))
                }))
            }else{
                quiz.questionId.map(question=>updateQuizId(question, quiz._id).then((updated)=>{
                    updateQuestionInQuiz(quiz._id, quiz.questionId).then((result)=>{
                        response.data.payload={...result, ...updated}
                        return resolve(response)
                    })
                }))
            }
        }catch(err){
            response.statusCode=400;
            response.data.payload=err.message||err.toString();
            return reject(response)
        }

    })
}

const handleRequest=(req,res)=>{
    return new Promise((resolve,reject)=>{
        switch(req.method){
            case 'GET': getQuiz(req,res); break;
            case 'PUT': 
                updateQuiz(req).then((data)=>{
                    res.status(data.statusCode).json(data)
                }).catch((err)=>{
                    console.log(err);
                    res.status(err.statusCode).json(err)
                });
                break;
            default: res.status(200).json({err:'Method Not Allowed'}); break;
        }
    })
}

export default withMiddleware(handleRequest);
