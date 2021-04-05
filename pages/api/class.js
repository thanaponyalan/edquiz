import withMiddleware from "../../middlewares";
import dbModel from "../../database/dbModel";
import { API } from "../../constant/ENV";

let response={
    statusCode: 200,
    data:{
        payload: {}
    }
}

const getClass=async(req,res)=>{
    return new Promise((resolve, reject)=>{
        if(req.headers.authorization===undefined||!req.headers.authorization.match(/^[0-9a-fA-F]{24}$/)){
            response.statusCode=403;
            response.data.message="Permission Denied!";
            res.status(response.statusCode).json(response);
            return reject(response);
        }
        const {isTeacher}=req.query;
        if(isTeacher){
            dbModel.classesModel.find({owner: req.headers.authorization}).populate('courseId').populate('students').exec((err,classes)=>{
                if(!err){
                    response.data.payload=classes;
                    res.status(response.statusCode).json(response);
                    return resolve();
                }
                return reject(err);
            })
        }else{
            dbModel.classesModel.find({students:req.headers.authorization}).populate('courseId').exec((err,classes)=>{
                if(!err){
                    console.log(classes);
                    response.data.payload=classes;
                    res.status(response.statusCode).json(response);
                    return resolve();
                }
                return reject(err);
            })
        }
    })
}

const getStudentsId=async(students)=>{
    return Promise.all(students.map(async(stdItem)=>{
        const usr=await dbModel.usersModel.findOneAndUpdate({email: stdItem.profile.emailAddress},{
            email: stdItem.profile.emailAddress,
            familyName: stdItem.profile.name.familyName,
            firstName: stdItem.profile.name.givenName,
            photoUrl: stdItem.profile.photoUrl,
        },{upsert: true, new: true})
        return Promise.resolve(usr._id)
    }))
}

const insertClass=async(classObject)=>{
    return new Promise((resolve,reject)=>{
        dbModel.classesModel.create(classObject,(err,result)=>{
            if(err){
                response.statusCode=400;
                response.data.payload=err.message||err.toString();
                // res.status(response.statusCode).json(response)
                return reject(err);
            }
            response.data.payload=result;
            // res.status(response.statusCode).json(response);
            return resolve(response);
        })
    })
}

const getStudents=async(gClassId,uid)=>{
    return new Promise(async(resolve,reject)=>{
        try{
            const url=`${API}/gStudent?courseId=${gClassId}`;
            const studentsRes=await fetch(url,{
                method: 'GET',
                headers:{
                    authorization: uid
                }
            });
            const students=await studentsRes.json();
            return resolve(students.data.payload)
        }catch(err){
            console.log(err);
            return reject(err)
        }
    })

}

const importClass=async(req,res)=>{
    const classes=JSON.parse(req.body);
    return Promise.all(
        classes.map((classItem)=>
            getStudents(classItem.gClassId,req.headers.authorization).then(async(students)=>{
                if(students){
                    const studentsId = await getStudentsId(students);
                    const data = await insertClass({ ...classItem, students: studentsId, owner: req.headers.authorization });
                    return await Promise.resolve(data);
                }else{
                    const data_1 = await insertClass({ ...classItem, students: [], owner: req.headers.authorization });
                    return await Promise.resolve(data_1);
                }
            })
        )
    )
}

const updateClass=async(req,res)=>{
    return new Promise((resolve,reject)=>{
        if(req.headers.authorization===undefined){
            response.statusCode=403;
            response.data.message="Permission Denied!";
            res.status(response.statusCode).json(response);
            return reject(response);
        }
        let thisClass=JSON.parse(req.body)
        console.log(thisClass);
        dbModel.classesModel.findByIdAndUpdate(thisClass._id,{
            className: thisClass.className,
            courseId: thisClass.courseId
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

const handleRequest=(req,res)=>{
    return new Promise((resolve,reject)=>{
        switch(req.method){
            case 'GET': getClass(req,res); break;
            case 'POST': importClass(req,res).then(resp=>{
                const hasError=resp.filter(item=>item.statusCode!=200);
                if(hasError.length){
                    response.statusCode=500;
                    response.data.payload='somethings went wrong'
                    return reject(response);
                }else{
                    response.data.payload='Created'
                    res.status(response.statusCode).json(response)
                }
            }).catch((err)=>{
                console.log(err);
                reject(err)
            }); break;
            case 'PUT': updateClass(req,res); break;
            default: res.status(200).json({err:'Method Not Allowed'}); break;
        }
    })
}


export default withMiddleware(handleRequest);

// export default withMiddleware(googleMiddleware.setOAuth2Client(listClass));

