import React from 'react';
import Button from '../UI/Button';
import './HomePage.css';
import {connect} from 'react-redux';
import firebase from 'firebase/app';
import 'firebase/auth';
import * as actionTypes from '../ReduxStore/actionTypes';
import {NavLink} from 'react-router-dom';
import {postData} from '../Firebase/Firebase';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCbWuEYkJoYvCm5jL1MTZC_JT1OsBH3V2E",
    authDomain: "cp-project-18016.firebaseapp.com",
    projectId: "cp-project-18016",
    storageBucket: "cp-project-18016.appspot.com",
    messagingSenderId: "635549024327",
    appId: "1:635549024327:web:eb263e26a5fda4c4873162"
};

const HomePage = props => {

    const login = () => {
        var userData;

        // Initialize Firebase

        if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
        }else {
        firebase.app(); // if already initialized, use that one
        }

        firebase.auth().languageCode = 'pt';

        const provider = new firebase.auth.GoogleAuthProvider();

        firebase.auth().signInWithPopup(provider).then(function(result) {

        // This gives you a Google Access Token. You can use it to access the Google API.
        var token = result.credential.accessToken;
        // The signed-in user info.
        var user = result.user;
        
        userData = {
            name: user.displayName,
            photo: user.photoURL
        }

        props.login(userData);
        
        postData('/new-sell.json', '123');

        // ...
        }).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        // ...
        });
    }

    return (
        <React.Fragment>

            <h4>This will be the home page, with the possibility to login or register</h4>
            <div className="homepage-buttons">
                { !props.user ? <Button color="primary" text="Login" className="buttons" click={login}/>
                : <React.Fragment>
                    <NavLink to="/nova-venda"><Button color="primary" text="Vender/Trocar" className="buttons"/></NavLink>
                    <Button color="secondary" text="Minhas trocas/vendas" className="buttons"/>
                  </React.Fragment>
                 }
            </div>
        </React.Fragment>
    );
}

const mapStateToProps = state => {
    return {
        user: state.user
    }
}


const mapDispatchToProps = dispatch => {
    return {
        login: data => dispatch({type: actionTypes.LOGIN_USER, data: data})
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(HomePage);


