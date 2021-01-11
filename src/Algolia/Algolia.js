import algoliasearch from 'algoliasearch';
import aa from 'search-insights';

const appId = 'BUC2AFISV8';
const apiKey = '24ea111ab31687717be472db25bc5aff';

const client = algoliasearch(
    appId,
    apiKey
);

const index = client.initIndex('search-sells');

const INDEX_NAME = 'search-sells';
const CLICKED_IMG_EVENT = 'clicked-img-after-search';
const LIKED_EVENT = 'liked-img';

aa( 'init', {appId: appId, apiKey: apiKey});

const getFullData = data => {
    return {...data, objectID: data.docId};
}

export const postAlgolia = data => index.saveObject( getFullData( data ) ).then().catch( error => console.error( error ) );

export const updateAlgolia = data => index.partialUpdateObject( getFullData( data ) ).then().catch( error => console.error( error ) );

export const deleteAlgolia = objectID => index.deleteObject( objectID ).then().catch( error => console.error( error ) );

export const sendLikedEvent = ( userId, objIds ) => {
    aa('clickedObjectIDs', {
        userToken: userId,
        index: INDEX_NAME,
        eventName: LIKED_EVENT,
        objectIDs: objIds
      });
};

export const sendImgClickedEvent = ( userId, objIDs ) => { 
    aa('clickedObjectIDs', {
    userToken: userId,
    index: INDEX_NAME,
    eventName: CLICKED_IMG_EVENT,
    objectIDs: objIDs
  });
}