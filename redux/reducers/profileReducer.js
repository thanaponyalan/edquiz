import { profileActionTypes } from '../actions/profileAction';

const initialProfileState={
    _id: null,
    email: null,
    familyName: null,
    firstName: null,
    photoUrl: null
}

const profileReducer=(state=initialProfileState, action)=>{
    switch (action.type) {
        case profileActionTypes.SET_PROFILE:
            return {...state,...action.payload};
        default:
            return state;
    }
}

export default profileReducer;