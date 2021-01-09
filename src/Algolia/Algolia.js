import algoliasearch from 'algoliasearch';
import searchInsights from 'search-insights';

const appId = 'BUC2AFISV8';
const apiKey = '24ea111ab31687717be472db25bc5aff';

const client = algoliasearch(
    appId,
    apiKey
);

const index = client.initIndex('search-sells');

searchInsights( 'init', {appId: appId, apiKey: '3347ced814c369f956cf3fa1bc564dd9'});

const getFullData = data => {
    return {...data, objectID: data.docId};
}

export const postAlgolia = data => index.saveObject( getFullData( data ) ).then().catch( error => console.error( error ) );

export const updateAlgolia = data => index.partialUpdateObject( getFullData( data ) ).then().catch( error => console.error( error ) );

export const deleteAlgolia = objectID => index.deleteObject( objectID ).then().catch( error => console.error( error ) );

export const sendSearchEvent = ( userId, queryID, objIds ) => searchInsights( 'convertedObjectIDsAfterSearch', {
    eventName: "search-event",
    userToken: userId,
    queryID: queryID,
    index: 'search-sells',
    objectIDs: objIds
});
