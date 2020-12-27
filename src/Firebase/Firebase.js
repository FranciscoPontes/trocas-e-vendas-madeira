import firebase from 'firebase/app';
import 'firebase/auth';
import axios from './axios';

export const logout = () => {
    firebase.auth().signOut().then(function() {
    // Sign-out successful.
    }).catch(function(error) {
        // An error happened.
    });
}


export const getData = url => {
    axios.get(url)
        .then( response => {
            return response;
        })
        .catch ( error => {
            console.log(error);
            return -1;
        })
}


export const postData = ( url, data ) => {
    axios.post(url, data)
        .then( response => {
            return response;
        })
        .catch ( error => {
            console.log(error);
            return -1;
        })
}