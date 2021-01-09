import React from 'react';
import './NavBar.css';
import Flag from '../images/madeira-flag.png';
import Chip from '@material-ui/core/Chip';
import Avatar from '@material-ui/core/Avatar';
import {connect} from 'react-redux';
import {NavLink} from 'react-router-dom';
import TextDisplay from '../UI/TextDisplay';
import { logout } from '../ReduxStore/reducer';

const NavBar = props => {

    const logout = () => {
        const confirmation = window.confirm("Continuar para logout?");
        if ( !confirmation ) return;
        props.logout();
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
        logout: () => dispatch( logout() )
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(NavBar);