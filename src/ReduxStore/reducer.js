import * as actionTypes from './actionTypes';
import {login} from '../Firebase/Firebase';
import * as FirebaseAPI from '../Firebase/Firebase';

const initState = {
    user: null,
    userSells: null,
    refreshNeededMySells: true,
    otherSells: null,
    fetchDone: true
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
                return dispatch({type: actionTypes.GET_USER_SELLS, data: response});
            })
            .catch( error => {
                console.error(error);
            })
    } 
}

export const deleteSell = ( docId, sells, uId ) => {
    console.log(docId);
    return dispatch => {
            FirebaseAPI.deleteData( uId, docId ).then( () => {
            let currentData = {...sells};
            delete currentData[docId];
            return dispatch({type: actionTypes.DELETE_SELL, data: currentData})
            
            })
    }
}

export const fetchOtherSells = uId => {
    return dispatch => {
        FirebaseAPI.fetchAllData(uId).then( response => dispatch({type: actionTypes.FETCH_OTHER_SELLS, data: response}))
    }
}

export const updateDocData = (uId, docId, data) => dispatch => FirebaseAPI.updateDocumentData(uId, docId, data).then( () => dispatch({type: actionTypes.UPDATE_DATA, data: data, key: docId}) )

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
                userSells: action.data,
                fetchDone: true,
                refreshNeededMySells: false
            };
        case actionTypes.DELETE_SELL: 
            return {
                ...state,
                userSells: action.data
            }
        case actionTypes.START_FETCH: 
            return {
                ...state,
                fetchDone: false
            }
        case actionTypes.FETCH_OTHER_SELLS: 
            return {
                ...state,
                otherSells: action.data,
                fetchDone: true
            }
        case actionTypes.NEW_SELL_ADDED: 
            return {
                ...state,
                refreshNeededMySells: true
            }
        case actionTypes.UPDATE_DATA: 
            return {
                ...state,
                userSells: {
                    ...state.userSells,
                    [action.key]: action.data
                }
            }
        default:
            return state;
    }
}

export default reducer;