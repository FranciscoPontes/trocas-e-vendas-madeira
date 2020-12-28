import * as actionTypes from './actionTypes';
import {login} from '../Firebase/Firebase';
import * as FirebaseAPI from '../Firebase/Firebase';

const initState = {
    user: null
}

export const tryLogin = () => {
    return dispatch => { 
            login().then( response => dispatch({type: actionTypes.LOGIN_USER, data: response}))
                .catch( error => {
                    console.error(error);
                    return dispatch({type: actionTypes.LOGOUT_USER})
                })
        } 
}

export const getUserSells = uId => {
    return dispatch => { 
        FirebaseAPI.getData(uId).then( response => {
                console.log(response);
                return dispatch({type: actionTypes.GET_USER_SELLS, data: response});
            })
            .catch( error => {
                console.error(error);
            })
    } 
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
        case actionTypes.GET_USER_SELLS: 
            return {
                ...state,
                userSells: action.data
            };
        default:
            return state;
    }
}

export default reducer;