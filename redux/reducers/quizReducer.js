import { quizActionTypes } from '../actions/quizAction';

const initialQuizzesState={

}
// [{
//     _id: null,
//     courseName: null,
//     courseNo: null,
//     courseDescription: null,
//     objectives: [],
//     owner: null
// }]

const quizReducer=(state=initialQuizzesState, action)=>{
    switch (action.type) {
        case quizActionTypes.FETCH_QUIZ:
            return {...state,quizzes: action.payload};
        case quizActionTypes.SET_QUIZ:
            return {...state,quizzes: action.payload};
        default:
            return state;
    }
}

export default quizReducer;