import algoliasearch from 'algoliasearch';

const appId = 'BUC2AFISV8';
const apiKey = '24ea111ab31687717be472db25bc5aff';
const INDEX_NAME = 'search-sells';

const client = algoliasearch(
    appId,
    apiKey
);

const index = client.initIndex(INDEX_NAME);

const getFullData = data => {
    return {...data, objectID: data.docId};
}

export const postAlgolia = data => index.saveObject( getFullData( data ) ).then().catch( error => console.error( error ) );

export const updateAlgolia = data => index.partialUpdateObject( getFullData( data ) ).then().catch( error => console.error( error ) );

export const deleteAlgolia = objectID => index.deleteObject( objectID ).then().catch( error => console.error( error ) );
