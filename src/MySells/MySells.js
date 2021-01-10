import React, { useState, useEffect } from 'react';
import {connect} from 'react-redux';
import * as ReducerAPI from '../ReduxStore/reducer';
import * as actionTypes from '../ReduxStore/actionTypes';
import './MySells.scss';
import Spinner from '../UI/Spinner';
import Card from '../UI/Card/Card';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import ConfirmDialog from '../UI/ConfirmDialog/ConfirmDialog';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import TextDisplay from '../UI/TextDisplay';

const MySells = props => {

    const [ showComplete, setShowComplete ] = useState(false);
    
    const [ currentTab, setCurrentTab ] = useState(0);

    const [ showDeleteConfirmDialog, setShowDeleteConfirmDialog ] = useState( false );

    const [ showUpdateConfirmDialog, setShowUpdateConfirmDialog ] = useState( false );

    const [ docIdToDelete, setDocIdToDelete ] = useState( null );

    const [ docIdToUpdate, setDocIdToUpdate ] = useState( null );

    useEffect( () => {
        if ( currentTab === 0) {
            props.startFetch();
            props.getSellsData(props.user.id);
            return;
        }
        fetchLikedSells();
    }, [ currentTab, props.userLikes ] )

    const confirmDeleteCurrentEntry = docId => { 
        setDocIdToDelete( docId );
        setShowDeleteConfirmDialog( true );
    }

    const deleteCurrentEntry = value => {
        if ( value ) props.deleteSell(docIdToDelete, props.sells);
        setDocIdToDelete( null );
        setShowDeleteConfirmDialog( false );
    }

    const confirmUpdateDocData = docId => {
        setDocIdToUpdate( docId );
        setShowUpdateConfirmDialog( true );
    }

    const updateDocData = value => {
        if ( value ) {
            let data = {...props.sells[ docIdToUpdate ]};
            data["complete"] = "true";
            data["completionDate"] = new Date().toISOString().slice(0, 10);
            props.updateData( docIdToUpdate, data );
        }
        setDocIdToUpdate( null );
        setShowUpdateConfirmDialog( false );
    }

    const generateSellDisplays = sells => (
        <div className="sells-content"> 
            { Object.keys(sells).map( key => {
                if ( sells[key].complete === 'true' && !showComplete ) return null;
                return <Card key={sells[key].docId} docData={sells[key]} value={sells[key].docId}
                                                        canDelete={confirmDeleteCurrentEntry}
                                                        completeSell={confirmUpdateDocData}
                                                        location={props.location.pathname}/>
                }
            ) }
        </div>
    );

    const displayedCardNumber = sells => {
        if ( !sells ) return 0;
        return Object.keys(sells).reduce( (acc, sell) => {
            if ( sells[sell].complete === 'true' && !showComplete ) return acc;
            return acc + 1;
        }, 0 )
    }

    const fetchLikedSells = () => {
        props.startFetch();
        props.getLikedSells( props.userLikes );
    }

    const generateLikedSells = sells => (
        <div className="sells-content"> 
            { Object.keys(sells).map( key =>  <Card key={sells[key].docId} docData={sells[key]} value={sells[key].docId}/>) }
        </div>
    );

    return (
        <div className="my-sells">
            <div className="heading-display">
                { !props.fetchDone ? <Spinner /> : null }
                <div className="text-and-switch">
                    <Breadcrumbs className="breadcrumb">
                        <TextDisplay text="Minhas publicações" headingType={ currentTab === 0 ? "h5" : "h6" }  onClick={ ( ) => setCurrentTab( 0 )} className={ currentTab === 0 ? "breadcrumb-link active" : "breadcrumb-link" }/>
                        <TextDisplay text="Meus favoritos" headingType={ currentTab === 1 ? "h5" : "h6" } onClick={ ( ) => setCurrentTab( 1 )} className={ currentTab === 1 ? "breadcrumb-link active" : "breadcrumb-link" }/>
                    </Breadcrumbs>
                    { currentTab === 0 ? <div className="toggle-complete-sells">
                    <FormControlLabel
                        control={
                            <Switch
                                onChange={ () => setShowComplete( !showComplete ) }
                                color="primary"
                            />
                        }
                        label="Completas"
                        className="switch-completas"
                    />
                    </div>
                    : null }
                </div>
                { displayedCardNumber( props.sells ) === 0 && currentTab === 0 ? <TextDisplay text="Não criou nenhuma publicação" headingType="h6" className="no-data-text-display"/> 
                : displayedCardNumber( props.likedSells ) === 0 && currentTab === 1 ? <TextDisplay text="Não gostou de nenhuma publicação" headingType="h6" className="no-data-text-display"/> : null  }
            </div>
            {  props.sells && props.fetchDone && currentTab === 0 ? generateSellDisplays(props.sells) : null}
            {  props.likedSells && props.fetchDone && currentTab === 1 ? generateLikedSells(props.likedSells) : null}
            <ConfirmDialog open={showDeleteConfirmDialog} onClose={ () => setShowDeleteConfirmDialog( false ) } click={deleteCurrentEntry} title="Apagar venda?"/>
            <ConfirmDialog open={showUpdateConfirmDialog} onClose={ () => setShowUpdateConfirmDialog( false ) } click={updateDocData} title="Completar venda?"/>
        </div>
    );
}

const mapStateToProps = state => {
    return {
        user: state.user,
        sells: state.userSells,
        fetchDone: state.fetchDone,
        userLikes: state.userLikes,
        likedSells: state.likedSells
    }
}

const mapDispatchToProps = dispatch => {
    return {
        startFetch: () => dispatch({type:actionTypes.START_FETCH}),
        getSellsData: (userId) => dispatch(ReducerAPI.getUserSells(userId)),
        deleteSell: (docId, sells) => dispatch(ReducerAPI.deleteSell(docId, sells)),
        updateData: ( docId, data)  => dispatch(ReducerAPI.updateDocData( docId, data ) ),
        getLikedSells: ( likeList ) => dispatch( ReducerAPI.fetchOtherSells( null, null, likeList ) )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MySells);