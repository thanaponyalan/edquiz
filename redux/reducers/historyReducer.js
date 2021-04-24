import { historyActionTypes } from '../actions/historyAction';

const initialHistoryState={

}

const historyReducer=(state=initialHistoryState, action)=>{
    switch (action.type) {
        case historyActionTypes.FETCH_HISTORY:
            return {...state,history: action.payload};
        case historyActionTypes.SET_HISTORY:
            return {...state,history: action.payload};
        default:
            return state;
    }
}

export default historyReducer;