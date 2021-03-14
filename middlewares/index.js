import cors from 'cors';

export default next=>async(req,res)=>{
    try{
        const middlewares=[
            cors(),
        ].filter(Boolean);
        
        const promises=middlewares.reduce((acc,middleware)=>{
            const promise=new Promise((resolve, reject)=>{
                middleware(req,res,(result)=>{return result instanceof Error ? reject(result) : resolve(result)});
            });
            return [...acc, promise];
        },[]);

        await Promise.all(promises);
        process.on('unhandledRejection',(reason,promise)=>{
            console.log('Unhandle Rejection at:',reason.stack||reason);
        })
        return next(req,res);
    }catch(err){
        return res.status(400).send(err);
    }
};