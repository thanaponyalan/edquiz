import { assignmentActionTypes } from '../actions/assignmentAction';

const initialAssignmentsState={
    
}
// [{
//     _id: null,
//     courseName: null,
//     courseNo: null,
//     courseDescription: null,
//     objectives: [],
//     owner: null
// }]

const assignmentReducer=(state=initialAssignmentsState, action)=>{
    switch (action.type) {
        case assignmentActionTypes.FETCH_ASGN:
            return {...state,assignments: action.payload};
        case assignmentActionTypes.SET_ASGN:
            return {...state,assignments: action.payload};
        default:
            return state;
    }
}

export default assignmentReducer;