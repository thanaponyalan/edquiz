import { testActionTypes } from '../actions/testAction';

const initialTestsState={
    
}
// [{
//     _id: null,
//     courseName: null,
//     courseNo: null,
//     courseDescription: null,
//     objectives: [],
//     owner: null
// }]

const testReducer=(state=initialTestsState, action)=>{
    switch (action.type) {
        case testActionTypes.FETCH_TEST:
            return {...state,tests: action.payload};
        case testActionTypes.SET_TEST:
            return {...state,tests: action.payload};
        default:
            return state;
    }
}

export default testReducer;