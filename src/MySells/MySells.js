import React, {useState, useEffect} from 'react';
import {connect} from 'react-redux';
import * as ReducerAPI from '../ReduxStore/reducer';
import './MySells.css';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import Spinner from '../UI/Spinner';
import ImagePreview from '../UI/BulkImagePreview/BulkImagePreview';
import ImageCarousel from '../UI/ImageCarousel/ImageCarousel';
import TextDisplay from '../UI/TextDisplay';

const MySells = props => {

    useEffect( () => {
        if ( !props.refreshNeeded ) return;
        props.getSellsData(props.user.id);
    }, [props.refreshNeeded])

    const deleteCurrentEntry = docId => {
        console.log(docId);
        const confirmation = window.confirm("Quer mesmo eliminar a referida venda/troca?");
        if (confirmation) props.deleteSell(docId, props.sells, props.user.id);
    }

    const updateDocData = docId => {
        const confirmation = window.confirm("Completar troca/venda?");
        if ( !confirmation ) return;
        let data = {...props.sells[docId]};
        data["complete"] = "true";
        data["completionDate"] = new Date().toISOString().slice(0, 10);
        return props.updateData(props.user.id, docId, data);
    }

    const generateSellDisplaysv2 = sells => (
        <div className="sells-content"> 
            { Object.keys(sells).map( ( key, index ) => <ImageCarousel key={index + sells[key].title} 
                                                        date={sells[key].date} title={sells[key].title} 
                                                        description={sells[key].description} 
                                                        bulkImages={sells[key].imagesUrl}
                                                        photo={sells[key].profile_photo}
                                                        name={sells[key].owner}
                                                        phone_number={sells[key].phone_number}
                                                        email={sells[key].email}
                                                        canDelete={deleteCurrentEntry}
                                                        value={key}
                                                        complete={sells[key].complete}
                                                        completeSell={updateDocData}
                                                        completionDate={sells[key].completionDate}/>
                                                        ) }
        </div>
    );

    return (
        <div className="my-sells">
            <div className="heading-display">
                { props.refreshNeeded ? <Spinner /> : null }
                <TextDisplay text="Minhas trocas/vendas" headingType="h4"/>
            </div>
            {  props.sells ? generateSellDisplaysv2(props.sells) : null }
        </div>
    );
}

const mapStateToProps = state => {
    return {
        user: state.user,
        sells: state.userSells,
        refreshNeeded: state.refreshNeededMySells
    }
}

const mapDispatchToProps = dispatch => {
    return {
        getSellsData: (userId) => dispatch(ReducerAPI.getUserSells(userId)),
        deleteSell: (docId, sells, uId) => dispatch(ReducerAPI.deleteSell(docId,sells, uId)),
        updateData: (userId, docId, data) => dispatch(ReducerAPI.updateDocData(userId, docId, data))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MySells);