import cookie from "js-cookie";
import {logout} from "../../utils/auth";

import {authActionTypes} from "../actions/authAction";

const initState={
    isLogin: false,
    uid: null,
    role: null
}

const authReducer=(state=initState,action)=>{
    switch (action.type) {
        case authActionTypes.LOGIN:{
            cookie.set('uid',action.payload.uid,{path:'/'});
            cookie.set('role',action.payload.role,{path:'/'})
            return{
                ...state,
                isLogin: true,
                ...action.payload
            };
        }
        
        case authActionTypes.LOGOUT:{
            logout();
            return{
                ...state,
                isLogin: false,
                uid: null,
                role: null
            }
        }
    
        default:
            return state;
    }
}

export default authReducer;