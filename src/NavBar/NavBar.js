import React from 'react';
import './NavBar.css';
import Flag from '../images/madeira-flag.png';
import Chip from '@material-ui/core/Chip';
import Avatar from '@material-ui/core/Avatar';
import {connect} from 'react-redux';
import firebase from 'firebase/app';
import 'firebase/auth';
import * as actionTypes from '../ReduxStore/actionTypes';
import {NavLink} from 'react-router-dom';
import TextDisplay from '../UI/TextDisplay';

const NavBar = props => {

    const logout = () => {
        const confirmation = window.confirm("Continuar para logout?");
        if ( !confirmation ) return;
        firebase.auth().signOut().then(function() {
        // Sign-out successful.
        props.logout();
        }).catch(function(error) {
            // An error happened.
        });
    }
    

    return (
        <div className="navbar">
            <NavLink to="/"><img src={Flag} alt="madeira-flag" height="100%"/></NavLink>
            <TextDisplay text="Vendas Madeira" headingType="h5" className="navbar-heading" />
            <div className="google-account-info">
            { props.user ? <Chip className="acc-chip"
                avatar={<Avatar alt={props.user.name} src={props.user.photo} className="acc-ava"/>}
                label={props.user.name} onDelete={logout}
            /> 
            : null}
            </div>
        </div>

    );
}


const mapStateToProps = state => {
    return {
        user: state.user
    }
}

const mapDispatchToProps = dispatch => {
    return {
        logout: () => dispatch({type: actionTypes.LOGOUT_USER})
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(NavBar);