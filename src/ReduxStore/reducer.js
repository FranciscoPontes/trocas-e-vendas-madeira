import * as actionTypes from './actionTypes';
import {login} from '../Firebase/Firebase';
import * as FirebaseAPI from '../Firebase/Firebase';

const initState = {
    user: null,
    userSells: null,
    otherSells: null,
    fetchDone: true,
    userLikes: null,
    uploadDone: true
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

export const getUserSells =  uId => async dispatch => { 
        await FirebaseAPI.fetchUserData(uId)
            .then( response => dispatch({type: actionTypes.GET_USER_SELLS, data: response} ) )
            .catch( error => console.error(error) );
}

export const deleteSell = ( docId, sells, uId ) => {
    return dispatch => {
            FirebaseAPI.deleteDocument( uId, docId ).then( () => {
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

export const updateLikeCount = (uId, docId, data, likeList) => {
    return async dispatch => {
        // update doc like count
        await FirebaseAPI.updateDocumentData(docId, data).then( () => dispatch({type: actionTypes.UPDATE_DOC_LIKES, data: data, key: docId}) ).catch( error => console.error( error ) );
        // update user like list
        await FirebaseAPI.addDocument("user_data", uId, likeList).then( () => dispatch({type: actionTypes.UPDATE_USER_LIKES, data: likeList}) ).catch( error => console.error( error ) );
    }
}

export const getUserLikeList = uId => dispatch => FirebaseAPI.getUserData( uId ).then( response => dispatch({type: actionTypes.FETCH_USER_LIKE_LIST, data: response.data() }) ).catch( error => console.error( error) );

export const uploadNewSell = data => async dispatch => {
    dispatch({type: actionTypes.NEW_UPLOAD_STARTED });
    await FirebaseAPI.postData( data ).then().catch( error => console.error( error) );
    dispatch({type: actionTypes.NEW_UPLOAD_FINISHED });
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
                userSells: action.data,
                fetchDone: true
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
        case actionTypes.UPDATE_DATA: 
            return {
                ...state,
                userSells: {
                    ...state.userSells,
                    [action.key]: action.data
                }
            }
        case actionTypes.UPDATE_DOC_LIKES: 
            return {
                ...state,
                otherSells: {
                    ...state.otherSells,
                    [action.key]: action.data
                }
            }
        case actionTypes.UPDATE_USER_LIKES: 
            return {
                ...state,
                userLikes: action.data
            }
        case actionTypes.FETCH_USER_LIKE_LIST: 
            return {
                ...state,
                userLikes: action.data
            }
        case actionTypes.NEW_UPLOAD_STARTED: 
            return {
                ...state,
                uploadDone: false
            }
        case actionTypes.NEW_UPLOAD_FINISHED: 
            return {
                ...state,
                uploadDone: true
            }
        default:
            return state;
    }
}

export default reducer;