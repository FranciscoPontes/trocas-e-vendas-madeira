import React, {useState, useEffect} from 'react';
import {connect} from 'react-redux';
import * as ReducerAPI from '../ReduxStore/reducer';
import './MySells.css';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import Spinner from '../UI/Spinner';
import ImagePreview from '../UI/BulkImagePreview/BulkImagePreview';

const MySells = props => {

    useEffect( () => {
        if ( !props.refreshNeeded ) return;
        props.getSellsData(props.user.id);
    }, [])

    const deleteCurrentEntry = (docId, sells, uId) => {
        console.log(docId);
        const confirmation = window.confirm("Quer mesmo eliminar a referida venda/troca?");
        if (confirmation) props.deleteSell(docId, sells, uId);
    }

    const generateSellDisplays = sells => {
        return Object.keys(sells).map( (key) => (
            <div className="sell-display" key={key}>
                <div className="top-row">
                    <DeleteForeverIcon className="delete-icon" fontSize="large" onClick={() => deleteCurrentEntry(key, props.sells, props.user.id)}/>
                    <h4>Título: {sells[key].title}</h4>
                </div>
                <span>Descrição: {sells[key].description}</span>
                <ImagePreview bulkImages={sells[key].imagesUrl} />
            </div>
        ));
    }

    return (
        <div>
            <h3>Trocas e vendas utilizador {props.user.name}</h3>
            { !props.refreshNeeded ? generateSellDisplays(props.sells) : <Spinner />}
            {console.log(props.refreshNeeded)}
        </div>
    );
}

const mapStateToProps = state => {
    return {
        user: state.user,
        sells: state.userSells,
        refreshNeeded: state.refreshNeeded
    }
}

const mapDispatchToProps = dispatch => {
    return {
        getSellsData: (userId) => dispatch(ReducerAPI.getUserSells(userId)),
        deleteSell: (docId, sells, uId) => dispatch(ReducerAPI.deleteSell(docId,sells, uId))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MySells);