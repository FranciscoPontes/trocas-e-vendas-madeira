import algoliasearch from 'algoliasearch';
import aa from 'search-insights';

const appId = 'BUC2AFISV8';
const apiKey = '24ea111ab31687717be472db25bc5aff';

const client = algoliasearch(
    appId,
    apiKey
);

const index = client.initIndex('search-sells');

aa( 'init', {appId: appId, apiKey: apiKey});

const getFullData = data => {
    return {...data, objectID: data.docId};
}

export const postAlgolia = data => index.saveObject( getFullData( data ) ).then().catch( error => console.error( error ) );

export const updateAlgolia = data => index.partialUpdateObject( getFullData( data ) ).then().catch( error => console.error( error ) );

export const deleteAlgolia = objectID => index.deleteObject( objectID ).then().catch( error => console.error( error ) );

export const sendSearchEvent = ( userId, objIds ) => {
    console.log(userId);
    console.log(objIds);
    aa( 'convertedObjectIDs', {
    eventName: "search-event",
    userToken: userId,
    index: 'search-sells',
    objectIDs: objIds
    })
};
