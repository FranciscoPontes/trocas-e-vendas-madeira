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
            return Promise.all([parseData( uId, response)]).then(response => response);
        })
        .catch( error => console.error(error) )
    
}

const parseData = ( uId, response ) => {
    let data = {};
    response.docs.forEach( ( doc, index ) => {
        let x = doc.data();
        getBulkImageUrl( uId, x.images).then( response => {
            x["imagesUrl"] = response;
            data[index] = x;
            console.log("entrei");
        });    
        } 
    );
    console.log(data);
    return data;
}

const getBulkImageUrl = (uId, images) => {
    return Promise.all(images.map( image => {
        return getImageUrl(uId, image ).then( response => {
            return response;
        } )
    })).then(response => response);
}

const getImageUrl = ( uId, imageName ) => {
    let storageRef = firebase.storage().ref();
        
    let completeRef = storageRef.child('images/' + uId + '/' + imageName);

    return completeRef.getDownloadURL().then( response => response );
}


export const postData = (uId, data) => {
    let copiedData = {...data};
    copiedData["images"] = data["images"].map( image => image.name );
    return db.collection(uId,).add(copiedData)
    .then(function(docRef) {
        console.log("Document written with ID: ", docRef.id);
        postImages( uId, data["images"] );
    })
    .catch(function(error) {
        console.error("Error adding document: ", error);
    });
}

const postImages = ( uId, images ) => {

    for ( let image in images ) {
        // Create a root reference
        let storageRef = firebase.storage().ref();

        let completeRef = storageRef.child('images/' + uId + '/' + images[image].name);

        let file = images[image];
        console.log(file);
        completeRef.put(file).then(function(snapshot) {
        console.log('Uploaded a blob or file!');
        });
    }

    alert("Nova troca/venda criada!");
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