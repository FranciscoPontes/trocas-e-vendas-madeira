import React, {useState, useEffect} from 'react';
import {connect} from 'react-redux';
import * as ReducerAPI from '../ReduxStore/reducer';

const MySells = props => {

    useEffect( () => {
        props.getSellsData(props.user.id)
    }, [0])

    return (
        <div>
            <h3>Trocas e vendas utilizador {props.user.name}</h3>
            
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
        getSellsData: (userId) => dispatch(ReducerAPI.getUserSells(userId))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MySells);