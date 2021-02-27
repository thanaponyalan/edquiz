import { roleActionTypes } from '../actions/roleAction';
import cookie from "js-cookie"; 

const initialProfileState={
    currentRole:null
}

const roleReducer=(state=initialProfileState, action)=>{
    switch (action.type) {
        case roleActionTypes.SET_ROLE:
            cookie.set('role',action.payload,{path:'/'});
            return {...state,currentRole:action.payload};
        default:
            return state;
    }
}

export default roleReducer;