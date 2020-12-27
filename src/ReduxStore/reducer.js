import * as actionTypes from './actionTypes';

const initState = {
    user: null
}

const reducer = (state = initState, action) => {
    switch (action.type) {
        case actionTypes.LOGIN_USER: 
            return {
                ...state,
                user: action.data
            };
        case actionTypes.LOGOUT_USER: 
            return {
                ...state,
                user: null
            };
        default:
            return state;
    }
}

export default reducer;