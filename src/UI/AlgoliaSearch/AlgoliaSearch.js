import algoliasearch from 'algoliasearch/lite';
import React, { useState, useEffect } from 'react';
import Card from '../Card/Card';
import { getBulkImageUrl } from '../../Firebase/Firebase';
import { connect } from 'react-redux';
import * as actionTypes from '../../ReduxStore/actionTypes';
import Spinner from '../Spinner';
import './AlgoliaSearch.css';
import SearchIcon from '@material-ui/icons/Search';
import { fade, makeStyles } from '@material-ui/core/styles';
import InputBase from '@material-ui/core/InputBase';

const searchClient = algoliasearch(
  'BUC2AFISV8',
  '3347ced814c369f956cf3fa1bc564dd9'
);
const index = searchClient.initIndex('search-sells');

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: 'auto',
    },
    marginBottom: '20px'
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
    width: '100%'
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%'
  },
}));

const fetchCompleteData = async hits => (
  await Promise.all( hits.map( async hit => { 
    let completeHitData = hit;
    await getBulkImageUrl( hit.userId, hit.images ).then( response => completeHitData["imagesUrl"] = response ).catch(error => console.error( error ) );
    return completeHitData;
  }) )
)

export const performSearch = async ( searchText, filters ) => 
      index.search(searchText, { filters: filters } ).then( async ( { hits } ) => {
          const completeHits = await fetchCompleteData( hits ).then( response => response );
          return completeHits; 
      } ).catch(error => console.error( error ) );


const AlgoliaSearch = props => {
  const classes = useStyles();

  const [ hits, setHits ] = useState(null);

  const [ loading, setLoading ] = useState(false);

  const [ search, setSearch ] = useState(null);



  useEffect( () => {
      if ( search && search.length >= 3 && search !== '' ) {
        props.toggleSearch( search );
        setLoading( true );

        performSearch( search, 'complete:false AND NOT userId:' + props.userId ).then( response => 
          fetchCompleteData( response ).then( response => {
              setLoading( false );
              setHits( response );
            } ).catch( error => console.error( error ) ) )
          .catch( error => console.error( error ) );

        return;
      }
      setHits( null );
      if ( props.searching ) props.toggleSearch();
  }, [search]);

  // hotfix
  useEffect( () => {
    if ( search === '' ) setHits( null );
  });

    return ( 
      <React.Fragment>
        <div className={classes.search + " search-container"}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <InputBase
              placeholder="Digite..."
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              inputProps={{ 'aria-label': 'search' }}
              onChange={ e => setSearch(e.target.value) }
            />
        </div>
        { loading ? <Spinner /> : null }
        { hits ? 
          <div className="algo-search-cards">
            {hits.map( hit => <Card key={ hit.docId } docData={ hit }  value={ hit.docId } /> ) } 
          </div>
          : null } 
      </React.Fragment>
    );
}

const mapStateToProps = state => {
  return {
    searching: state.searching,
    userId: state.user.id
    }
}

const mapDispatchToProps = dispatch => {
  return {
    toggleSearch: ( data = null ) => dispatch({type: actionTypes.TOGGLE_SEARCH, data: data})
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(AlgoliaSearch);
