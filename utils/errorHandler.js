import { logout } from './auth';

export const _error_handler=(toast,err,ctx=null)=>{
    if(/*err.response&&*/typeof window!=='undefined'){
        const statusCode=err.statusCode;
        if(statusCode==401){
            if(toast!==null)toast.add(err.data.message,{appearance: 'error', autoDismiss: true});
            logout(ctx);
        }else if(statusCode>=400&&statusCode<500){
            let payload=err.data.payload;
            if(payload){
                Object.keys(payload).map(key=>{
                    if(toast!==null)toast.add(payload[key],{appearance: 'error',autoDismiss: true});
                })
            }else{
                if (toast !==null){
                    if(err.data.message){
                        toast.add(err.data.message, { appearance: 'error' ,autoDismiss: true});
                    } else if(err.data.messages) {
                        Object.keys(err.data.messages).map(key=>{
                            if (toast !==null)
                                toast.add(err.data.messages[key], { appearance: 'error' ,autoDismiss: true});
                        })
                    }
                }
            }
        }else if(statusCode>=500&&statusCode<600){
            if(toast !==null)toast.add("Server Unavailable", { appearance: 'error' ,autoDismiss: true});
        }
    }else{
        if(toast !==null)
            toast.add("Server Unavailable", { appearance: 'error' ,autoDismiss: true});
    }
}