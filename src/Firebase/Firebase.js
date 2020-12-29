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

export const logout = () => {
    firebase.auth().signOut().then(function() {
    // Sign-out successful.
    }).catch(function(error) {
        // An error happened.
    });
}

export const getData = uId => {
    let docRef = db.collection(uId);
    return docRef.get().then( response => {
            return parseData( uId, response).then(response => response);
        })
        .catch( error => console.error(error) )
    
}

const parseData = ( uId, response ) => {
    let data = {};
    const promiseForEach =
        response.docs.reduce( async (acc, doc) => {
            await doc;
            let currentData = doc.data();
            return getBulkImageUrl( uId, currentData.images).then( response => {
                currentData["imagesUrl"] = response;
                data[doc.id] = currentData;
            } );    
            }, Promise.resolve()
        );
    return promiseForEach.then( () => data );
}

const getBulkImageUrl = (uId, images) => {
    const promiseMap = Promise.all(images.map(async image => {
            return getImageUrl(uId, image ).then( response => response)
        }));

    return promiseMap.then(response => response);    
}

const getImageUrl = ( uId, imageName ) => {
    let storageRef = firebase.storage().ref();
        
    let completeRef = storageRef.child('images/' + uId + '/' + imageName);

    return completeRef.getDownloadURL().then( response => response );
}


export const postData = (uId, data) => {
    let copiedData = {...data};
    copiedData["images"] = copiedData["images"].map( image => image.name );
    return needToAddCollection(uId).then( response => {
        if (!response) addCollection(uId);
        return db.collection(uId).add(copiedData)
        .then(function(docRef) {
            console.log("Document written with ID: ", docRef.id);
            return postImages( uId, data["images"] ).then( () => null);
        })
        .catch(function(error) {
            console.error("Error adding document: ", error);
        });
    });
}

const needToAddCollection = uId => db.collection("list-collections").get().then(response => {
    let result = false;
    const worker = response.docs.reduce(async ( cb, value) => { 
        await cb;
        if ( value.id === uId) result = true;
        return null;
    }, Promise.resolve() );
    
    return worker.then( () => result);
});

const addCollection = uId => db.collection("list-collections").doc(uId).set({});

const postImages = ( uId, images ) => {
    const imagePost = Promise.all(images.map(async image => {
        // Create a root reference
        let storageRef = firebase.storage().ref();

        let completeRef = storageRef.child('images/' + uId + '/' + image.name);

        let file = image;
        return completeRef.put(file).then(function(snapshot) {
        console.log('Uploaded a blob or file!');
        });

    } ));

    return imagePost.then( () => {
        alert("Nova troca/venda criada!");
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
        id: user.uid 
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

export const deleteData = ( uId, docId ) => {
    return db.collection(uId).doc(docId).delete().then(function() {
        console.log("Document successfully deleted!");
    }).catch(function(error) {
        console.error("Error removing document: ", error);
    });
}

export const fetchAllData = uId => {
    let result = [];
    const worker = db.collection("list-collections").get().then( response => {
        return response.docs.reduce( async (cb, collection) => {
            const currentUId = collection.id;
            return db.collection(currentUId).get().then ( response => {
                return response.docs.reduce( async (cb, doc) => {
                    await cb;
                    let imagesUrl = [];
                    let docData = doc.data();
                    await docData.images.reduce( async (cb, img) => {
                        await cb;
                        return getImageUrl( currentUId, img).then( response => {
                            imagesUrl.push(response);
                        });
                    }, Promise.resolve() );

                    docData["imagesUrl"] = imagesUrl;
                    result.push(docData);
                    console.log(result);
                }, Promise.resolve());
            });
        }, Promise.resolve());
    });

    return worker.then( () => result );
}
