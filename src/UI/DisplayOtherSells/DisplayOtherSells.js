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

    const [ lastFetch, setLastFetch ] = useState( [] );

    const [ firstSearchDone, setFirstSearchDone ] = useState( false );

    const search = () => { 
        setLoading( true );
        performSearch( '', filter).then( response => {
            setFirstSearchDone( true );
            console.log( "Fetched with filter" );
            console.log( response );
            setLastFetch( response );
            if ( response.length === 0) return;
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
                    { loading ? <Spinner /> : null }
                    <div className="sells-content">
                        { sells ? sells.map( sell => <Card key={ sell.docId } docData={ sell } value={ sell.docId }/> ) : null }
                    </div>
                    { lastFetch.length !== 0 || !firstSearchDone ? 
                        <AddIcon onClick={ search } fontSize="large" className="load-more-icon"/>
                        :
                        <h5 className="no-more-sells-heading">Não existem mais publicações</h5>
                    }
                </React.Fragment>
                :
                null
            }
        </React.Fragment>
    )

    return generateUI();
}

export default DisplayOtherSells;