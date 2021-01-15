import React, { useState, useEffect } from 'react';
import AddIcon from '@material-ui/icons/Add';
import TextDisplay from '../TextDisplay';
import Card from '../Card/Card';
import './DisplayOtherSells.css';

const DisplayOtherSells = props => {

    const notRecommendedSells = props.notRecommendedSells;

    const [ sellsDisplayed, setSellsDisplayed ] = useState( [] );

    const [ noMoreSells, setNoMoreSells ] = useState( false );

    const showNext5Sells = () => { 
        if ( notRecommendedSells.length === 0 || notRecommendedSells.length === sellsDisplayed.length ) {
            console.log( "No more sells to fetch" ) ;
            setNoMoreSells( true );
            return;
        }
        const newBulkOfSells = notRecommendedSells.filter( ( sell, index ) => sellsDisplayed.length < index < sellsDisplayed.length + 5 );
        setSellsDisplayed( newBulkOfSells );
    }

    const displaySells = () => sellsDisplayed.map( sell => <Card key={ sell.docId } docData={ sell } value={ sell.docId }/> );

    const generateUI = () => (
        <React.Fragment>
            <hr className="horizontal-break" />
            <TextDisplay text="Mais publicações" headingType="h5" className=""/>
            <div className="sells-content">
                { displaySells() }
            </div>
            { !noMoreSells ? 
                <AddIcon onClick={ showNext5Sells } fontSize="large" className="load-more-icon"/>
                :
                <h5 className="no-more-sells-heading">Não existem mais publicações</h5>
            }
        </React.Fragment>
    )

    return generateUI();
}

export default DisplayOtherSells;