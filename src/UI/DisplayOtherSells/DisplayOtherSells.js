import React, { useState } from 'react';
import AddIcon from '@material-ui/icons/Add';
import { performSearch } from '../AlgoliaSearch/AlgoliaSearch';
import TextDisplay from '../TextDisplay';
import Card from '../Card/Card';
import './DisplayOtherSells.css';
import Spinner from '../Spinner';

const DisplayOtherSells = props => {

    const [ filter, setFilter ] = useState( props.filter );

    const [ sells, setSells ] = useState( [] );

    const [ loading, setLoading ] = useState( false );

    const search = () => { 
        setLoading( true );
        performSearch( '', filter).then( response => {
            console.log( response );
            if ( typeof response === 'undefined' || response.length === 0) return;
            const currentSells = sells; 
            response.forEach( sell => currentSells.push( sell ) );
            setSells( currentSells );

            setFilter( filter + response.reduce( ( cb, value, index ) => {
                let result = ' AND NOT docId:';
                if ( index === 0 ) return result + cb.docId;
                result += value.docId;
                return cb + result; 
            }, response[0]) );
        } );
        setLoading( false );
    }

    const generateUI = () => (
        <React.Fragment>
            { console.log( props ) }
            { props.filter ? 
                <React.Fragment>
                    <hr className="horizontal-break" />
                    <TextDisplay text="Mais publicações" headingType="h5" className=""/>
                    <div className="sells-content">
                        { sells ? sells.map( sell => <Card key={ sell.docId } docData={ sell } value={ sell.docId }/> ) : null }
                        <AddIcon onClick={ search } fontSize="large" className="load-more-icon"/>
                        { loading ? <Spinner /> : null }
                    </div>
                </React.Fragment>
                :
                null
            }
        </React.Fragment>
    )

    return generateUI();
}

export default DisplayOtherSells;