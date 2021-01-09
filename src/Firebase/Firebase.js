import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';
import * as AlgoliaAPI from '../Algolia/Algolia';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCbWuEYkJoYvCm5jL1MTZC_JT1OsBH3V2E",
    authDomain: "cp-project-18016.firebaseapp.com",
    projectId: "cp-project-18016",
    storageBucket: "cp-project-18016.appspot.com",
    messagingSenderId: "635549024327",
    appId: "1:635549024327:web:eb263e26a5fda4c4873162"
};

let db;

const SELLS_DATA = "sells_data";
const USER_DATA = "user_data";

const getRelevantUserData = data => {
    return {
        name: data.displayName,
        photo: data.photoURL,
        id: data.uid,
        email: data.email
    }
}

export const logout = () => {
    return firebase.auth().signOut()
                .then( () => sessionStorage.removeItem('cp-persuasive-user') )
                .catch( error => console.error( error ) );
}

export const login =  redirected => {

    if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
    }else {
    firebase.app(); // if already initialized, use that one
    }

    db = firebase.firestore();

    if ( sessionStorage.getItem('cp-persuasive-user') ) {
        
        const cachedCredential = JSON.parse( atob( sessionStorage.getItem('cp-persuasive-user') ) );
        const credential = firebase.auth.GoogleAuthProvider.credential( cachedCredential.oauthIdToken, cachedCredential.oauthAccessToken );

        return firebase.auth().signInWithCredential( credential )
                    .then( result => getRelevantUserData( result.user ) )
                    .catch( error => console.error( error ) );
    }

    if ( !redirected ) {
        const provider = new firebase.auth.GoogleAuthProvider();
        firebase.auth().useDeviceLanguage();
        sessionStorage.setItem('login-init', true);
        firebase.auth().signInWithRedirect( provider );
        return;
    }

    sessionStorage.setItem('login-init', false);
    return firebase.auth().getRedirectResult().then( result => {
        sessionStorage.setItem('cp-persuasive-user',   btoa( JSON.stringify( result.credential ) ) );
        
        return getRelevantUserData( result.user );
    }).catch( error => {
        var errorCode = error.code;
        var errorMessage = error.message;
        // var email = error.email;
        // var credential = error.credential;
        console.error( errorCode + errorMessage );
    });


}

export const updateDocumentData = (docId, data) => {
    const dbRef = db.collection(SELLS_DATA).doc(docId);
    AlgoliaAPI.updateAlgolia( data );
    return dbRef.update(data).then( response => response).catch( error => console.error( error ) );
}

export const addDocument = async (collectionId, docId = null, data) => {
    const dbRef = docId ? db.collection(collectionId).doc(docId) : db.collection(collectionId).doc();
    if ( collectionId === SELLS_DATA ) data["docId"] = dbRef.id;
    await dbRef.set(data).then().catch( error => console.error( error ) );
    return data;
}

// getting data
export const getUserData = userId => db.collection(USER_DATA).doc(userId).get().then().catch( error => console.error( error ) );

const getDocumentsOrdered = () => db.collection(SELLS_DATA).orderBy("likeCount", "desc").get().then( response => response).catch(error => console.error( error ) );
const getDocumentsOrderedCurrentUser = filter => db.collection(SELLS_DATA).where(filter.row, filter.comparator, filter.givenFilter).orderBy("likeCount", "desc").get().then( response => response).catch(error => console.error( error ) );
// getting data

export const deleteDocument = docId => {
    return db.collection(SELLS_DATA).doc(docId).delete().then(function() {
        console.log("Document successfully deleted!");
        AlgoliaAPI.deleteAlgolia( docId );
    }).catch(function(error) {
        console.error("Error removing document: ", error);
    });
}

const postImages = async ( uId, images ) => {
    await images.map(async image => {
        // Create a root reference
        let storageRef = firebase.storage().ref();
        let completeRef = storageRef.child('images/' + uId + '/' + image.name);
        let file = image;
        await completeRef.put(file).then().catch(error => console.error( error ) );
        });
};

const getImageUrl = ( uId, imageName ) => {
    let storageRef = firebase.storage().ref();
        
    let completeRef = storageRef.child('images/' + uId + '/' + imageName);
    return completeRef.getDownloadURL().then( response => response ).catch(error => console.error( error ) );
}

export const getBulkImageUrl = async (uId, images) => (
    await Promise.all(images.map(async image => await getImageUrl(uId, image )
                                                    .then( response =>  response)
                                                    .catch(error => console.error( error ) ) ) )
)

const addImagesToData = async ( data, uId = null , limit = false, likeList = null ) => {
    let resultingData = {};
    let count = 1;
    await data.docs.reduce( async (acc, doc) => {
        await acc;
        let currentData = doc.data();
        if ( uId === currentData.userId || ( uId && ( ( limit && count === 6 ) || currentData.complete === 'true' ) ) || ( likeList && !likeList["likeList"].includes( currentData.docId ) ) ) return;
        currentData["docId"] = doc.id;
        await getBulkImageUrl( currentData.userId, currentData.images).then( response => currentData["imagesUrl"] = response ).catch(error => console.error( error ) );    
        resultingData[doc.id] = currentData;
        count++;
        }, Promise.resolve()
    );
    return resultingData;
}

export const postData = async data => {
    const dataCorrectImageList = {...data};
    dataCorrectImageList["images"] = dataCorrectImageList["images"].map( img => img.name);
    let dataForAlgolia;
    
    await addDocument( SELLS_DATA, null, dataCorrectImageList).then( response => {
        dataForAlgolia = response;
        console.log("Document successfully posted!");
    }).catch(error => console.error( error ) );
    await postImages( data.userId , data["images"] ).then( () => console.log("Images successfully posted!")).catch(error => console.error( error ) );
    
    AlgoliaAPI.postAlgolia( dataForAlgolia );
}

export const fetchUserData = async uId => {
    let data = {};
    await getDocumentsOrderedCurrentUser( {"row": "userId", "comparator": "==", "givenFilter": uId} )
            .then( async fetchedData => await addImagesToData(fetchedData).then( response => data = response).catch(error => console.error( error ) ))
            .catch(error => console.error( error ) );
    return data;
}

export const fetchAllData = async ( uId, limit, likeList ) => {
    let data = {};
    await getDocumentsOrdered().then( async fetchedData => {
            await addImagesToData( fetchedData, uId , limit, likeList).then( response => data = response).catch(error => console.error( error ) );
        })
        .catch(error => console.error( error ) );
    return data;
}
