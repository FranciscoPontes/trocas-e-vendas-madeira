import algoliasearch from 'algoliasearch/lite';
import React from 'react';
import {
  InstantSearch,
  Hits,
  SearchBox,
  Pagination,
  Highlight,
  ClearRefinements,
  RefinementList,
  Configure,
} from 'react-instantsearch-dom';
import PropTypes from 'prop-types';

const searchClient = algoliasearch(
  'BUC2AFISV8',
  '3347ced814c369f956cf3fa1bc564dd9'
);

const AlgoliaSearch = () => {
    return (
      <div className="ais-InstantSearch">
        <h1>React InstantSearch e-commerce demo</h1>
        <InstantSearch indexName="demo_ecommerce" searchClient={searchClient}>
          <div className="left-panel">
            <ClearRefinements />
            <h2>Brands</h2>
            <RefinementList attribute="brand" />
            <Configure hitsPerPage={8} />
          </div>
          <div className="right-panel">
            <SearchBox />
            <Hits hitComponent={Hit} />
            <Pagination />
          </div>
        </InstantSearch>
      </div>
    );
}

function Hit(props) {
  return (
    <div>
      <img src={props.hit.image} align="left" alt={props.hit.name} />
      <div className="hit-name">
        <Highlight attribute="name" hit={props.hit} />
      </div>
      <div className="hit-description">
        <Highlight attribute="description" hit={props.hit} />
      </div>
      <div className="hit-price">${props.hit.price}</div>
    </div>
  );
}

Hit.propTypes = {
  hit: PropTypes.object.isRequired,
};

export default AlgoliaSearch;