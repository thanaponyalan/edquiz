import cookie from "js-cookie";
import {logout} from "../../utils/auth";

import {authActionTypes} from "../actions/authAction";

const initState={
    isLogin: false,
    uid: null
}

const authReducer=(state=initState,action)=>{
    switch (action.type) {
        case authActionTypes.LOGIN:{
            cookie.set('uid',action.payload,{path:'/'});
            return{
                ...state,
                isLogin: true,
                uid: action.payload
            };
        }
        
        case authActionTypes.LOGOUT:{
            logout();
            return{
                ...state,
                isLogin: false,
                uid: null
            }
        }
    
        default:
            return state;
    }
}

export default authReducer;