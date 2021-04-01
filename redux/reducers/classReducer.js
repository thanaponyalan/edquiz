import { classActionTypes } from '../actions/classAction';

const initialState={

}
// [{
//     _id: null,
//     courseName: null,
//     courseNo: null,
//     courseDescription: null,
//     objectives: [],
//     owner: null
// }]

const classReducer=(state=initialState, action)=>{
    switch (action.type) {
        case classActionTypes.FETCH_CLASS:
            return {...state,classes: action.payload};
        case classActionTypes.SET_CLASS:
            return {...state,classes: action.payload};
        default:
            return state;
    }
}

export default classReducer;