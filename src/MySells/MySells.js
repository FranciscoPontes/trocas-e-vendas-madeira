import React, { useState, useEffect } from 'react';
import {connect} from 'react-redux';
import * as ReducerAPI from '../ReduxStore/reducer';
import * as actionTypes from '../ReduxStore/actionTypes';
import './MySells.css';
import Spinner from '../UI/Spinner';
import Card from '../UI/Card/Card';
import TextDisplay from '../UI/TextDisplay';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';

const MySells = props => {

    const [ showComplete, setShowComplete ] = useState(false);

    useEffect( async () => {
        props.startFetch();
        props.getSellsData(props.user.id);
    }, [] )

    const deleteCurrentEntry = docId => {
        const confirmation = window.confirm("Quer mesmo eliminar a referida venda/troca?");
        if (confirmation) props.deleteSell(docId, props.sells);
    }

    const updateDocData = docId => {
        const confirmation = window.confirm("Completar troca/venda?");
        if ( !confirmation ) return;
        let data = {...props.sells[docId]};
        data["complete"] = "true";
        data["completionDate"] = new Date().toISOString().slice(0, 10);
        props.updateData( docId, data );
    }

    const generateSellDisplaysv2 = sells => (
        <div className="sells-content"> 
            { Object.keys(sells).map( key => {
                if ( sells[key].complete === 'true' && !showComplete ) return;
                return <Card key={sells[key].docId} docData={sells[key]} value={sells[key].docId}
                                                        canDelete={deleteCurrentEntry}
                                                        completeSell={updateDocData}
                                                        location={props.location.pathname}/>
                }
            ) }
        </div>
    );

    return (
        <div className="my-sells">
            <div className="heading-display">
                { !props.fetchDone ? <Spinner /> : null }
                <div className="text-and-switch">
                    <TextDisplay text="Minhas publicações" headingType="h4"/>
                    <div className="toggle-complete-sells">
                    <FormControlLabel
                        control={
                            <Switch
                                onChange={ () => setShowComplete( !showComplete ) }
                                color="primary"
                            />
                        }
                        label="Completos"
                    />
                    </div>
                </div>
                { ! ( props.sells ) ? <TextDisplay text="Não tem nenhuma publicação" headingType="h6"/> : null }
            </div>
            {  props.sells && props.fetchDone ? generateSellDisplaysv2(props.sells) : null }
        </div>
    );
}

const mapStateToProps = state => {
    return {
        user: state.user,
        sells: state.userSells,
        fetchDone: state.fetchDone
    }
}

const mapDispatchToProps = dispatch => {
    return {
        startFetch: () => dispatch({type:actionTypes.START_FETCH}),
        getSellsData: (userId) => dispatch(ReducerAPI.getUserSells(userId)),
        deleteSell: (docId, sells) => dispatch(ReducerAPI.deleteSell(docId, sells)),
        updateData: ( docId, data)  => dispatch(ReducerAPI.updateDocData( docId, data ) )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MySells);