import algoliasearch from 'algoliasearch';


const client = algoliasearch(
    'BUC2AFISV8',
    '24ea111ab31687717be472db25bc5aff'
);

const index = client.initIndex('search-sells');

const getFullData = data => {
    return {...data, objectID: data.docId};
}

export const postAlgolia = data => index.saveObject( getFullData( data ) ).then().catch( error => console.error( error ) );

export const updateAlgolia = data => index.partialUpdateObject( getFullData( data ) ).then().catch( error => console.error( error ) );

export const deleteAlgolia = objectID => index.deleteObject( objectID ).then().catch( error => console.error( error ) );