import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

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

export const logout = () => {
    firebase.auth().signOut().then(function() {
    // Sign-out successful.
    }).catch(function(error) {
        // An error happened.
    });
}

export const login = () => {
    var userData;

    // Initialize Firebase

    if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
    }else {
    firebase.app(); // if already initialized, use that one
    }

    firebase.auth().languageCode = 'pt';

    const provider = new firebase.auth.GoogleAuthProvider();

    return firebase.auth().signInWithPopup(provider).then(function(result) {

    // This gives you a Google Access Token. You can use it to access the Google API.
    var token = result.credential.accessToken;
    // The signed-in user info.
    var user = result.user;

    userData = {
        name: user.displayName,
        photo: user.photoURL,
        id: user.uid,
        email: user.email
    }
    
    db = firebase.firestore();
    
    return userData;

    // ...
    }).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        // ...
        return errorCode + errorMessage;
    });
}

export const updateDocumentData = (docId, data) => {
    const dbRef = db.collection(SELLS_DATA).doc(docId);
    return dbRef.update(data).then( response => response).catch( error => console.error( error ) );
}

export const addDocument = (collectionId, docId = null, data) => {
    const dbRef = docId ? db.collection(collectionId).doc(docId) : db.collection(collectionId).doc();
    if ( collectionId === SELLS_DATA ) data["docId"] = dbRef.id;
    return dbRef.set(data).then().catch( error => console.error( error ) );
}

// getting data
export const getUserData = userId => db.collection(USER_DATA).doc(userId).get().then().catch( error => console.error( error ) );

const getDocumentsOrdered = () => db.collection(SELLS_DATA).orderBy("likeCount", "desc").limit(5).get().then( response => response).catch(error => console.error( error ) );

// check algolia
// https://codesandbox.io/embed/github/algolia/doc-code-samples/tree/master/React+InstantSearch/getting-started
// https://www.algolia.com/doc/guides/building-search-ui/what-is-instantsearch/react/
const getDocumentsFilteredOrdered = filter => db.collection(SELLS_DATA).where(filter.row, filter.comparator, filter.givenFilter).orderBy("likeCount", "desc").get().then( response => response).catch(error => console.error( error ) );
const getDocumentsFilteredOrdered2 = filter => db.collection(SELLS_DATA).where(filter.row, filter.comparator, filter.givenFilter).orderBy(filter.row,"asc").orderBy("likeCount", "desc").get().then( response => response).catch(error => console.error( error ) );
// getting data

export const deleteDocument = ( uId, docId ) => {
    return db.collection(uId).doc(docId).delete().then(function() {
        console.log("Document successfully deleted!");
    }).catch(function(error) {
        console.error("Error removing document: ", error);
    });
}

const getImageUrl = ( uId, imageName ) => {
    let storageRef = firebase.storage().ref();
        
    let completeRef = storageRef.child('images/' + uId + '/' + imageName);

    return completeRef.getDownloadURL().then( response => response ).catch(error => console.error( error ) );
}

const postImages = async ( uId, images ) => {
    await images.map(async image => {
        console.log(image);
        // Create a root reference
        let storageRef = firebase.storage().ref();
        let completeRef = storageRef.child('images/' + uId + '/' + image.name);
        let file = image;
        await completeRef.put(file).then().catch(error => console.error( error ) );
        })
};

const getBulkImageUrl = async (uId, images) => (
    await Promise.all(images.map(async image => await getImageUrl(uId, image )
                                                    .then( response =>  response)
                                                    .catch(error => console.error( error ) ) ) )
)

const addImagesToData = async ( data, uId ) => {
    let resultingData = {};
    await data.docs.reduce( async (acc, doc) => {
        await acc;
        let currentData = doc.data();
        currentData["docId"] = doc.id;
        await getBulkImageUrl( uId, currentData.images).then( response => currentData["imagesUrl"] = response ).catch(error => console.error( error ) );    
        resultingData[doc.id] = currentData;
        }, Promise.resolve()
    );
    return resultingData;
}

export const postData = async data => {
    const dataCorrectImageList = {...data};
    dataCorrectImageList["images"] = dataCorrectImageList["images"].map( img => img.name);
    await addDocument( SELLS_DATA, null, dataCorrectImageList).then( () => console.log("Document successfully posted!")).catch(error => console.error( error ) );
    await postImages( data.userId , data["images"] ).then( () => console.log("Images successfully posted!")).catch(error => console.error( error ) );
}

export const fetchUserData = async uId => {
    let data = {};
    await getDocumentsFilteredOrdered( {"row": "userId", "comparator": "==", "givenFilter": uId} )
        .then( async fetchedData => await addImagesToData(fetchedData, uId).then( response => data = response).catch(error => console.error( error ) ))
        .catch(error => console.error( error ) );
    return data;
}

export const fetchAllData = async uId => {
    let data = {};
    await getDocumentsFilteredOrdered2( {"row": "userId", "comparator": "!=", "givenFilter": uId} ).then( async fetchedData => await addImagesToData(fetchedData, uId).then( response => data = response).catch(error => console.error( error ) ))
                                .catch(error => console.error( error ) );
    return data;
}
