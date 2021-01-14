import { performSearch } from './UI/AlgoliaSearch/AlgoliaSearch';

let top5Matches = [];

const sortArray = array => { 
    top5Matches = array.slice().sort( ( a, b ) => b.matchValue - a.matchValue );
}

const pushToFinalArray = elements => {
    for ( let i in elements ) {
        if ( top5Matches.length === 5 ) break;
        top5Matches = top5Matches.concat( { docId: elements[i].docId, matchValue: -1 } );
    }
}

const addToTop5 = ( likedSells, sellsNotLiked ) => {
    const filteredSellsNotLiked = sellsNotLiked.filter( sell => top5Matches.findIndex( value => value.docId === sell.docId ) === -1 );
    // first add liked sells
    pushToFinalArray( likedSells );

    // first add liked sells
    pushToFinalArray( filteredSellsNotLiked );

    sortArray( top5Matches );
}

const getsTop5 = ( docId, matchValue ) => {
    if ( matchValue === 0 ) return;
    // check if sell already in list
    if (typeof top5Matches !== 'undefined' && top5Matches.length > 0) {
        let indexOfFind = top5Matches.findIndex( value => value.docId === docId );

        if ( indexOfFind !== -1 && matchValue > top5Matches[ indexOfFind ].matchValue ) top5Matches[ indexOfFind ] = {...top5Matches[ indexOfFind ], matchValue: matchValue };
        if ( indexOfFind !== -1 ) return;
    }

    if ( top5Matches.length < 5 ) top5Matches = top5Matches.concat( { docId: docId, matchValue: matchValue } );
    else {
        top5Matches = top5Matches.concat({ docId: docId, matchValue: matchValue } );
        sortArray( top5Matches );
        top5Matches = top5Matches.filter( ( value, index ) => index !== top5Matches.length - 1 );
    }
    sortArray( top5Matches );
}

const stringComparator = ( string1, string2 ) => {
    // I want to compare how much they look like and return if >= to PERSONALIZATION_IMPACT
    // compare word to word if ( case insensitive ) if strings have both words, in the end get percentage
    const string1Splitted = string1.split( ' ' );
    const string2Splitted = string2.split( ' ' );
    const possibleMatches = string1Splitted.length;
    let totalMatches = 0;
    // console.log( "Possible matches: " + possibleMatches );

    for ( let index1 in string1Splitted ) {
        if ( string1Splitted[index1].trim() === '' ) continue; 

        for ( let index2 in string2Splitted ) {
            if ( string2Splitted[index2].trim() === '' ) continue; 
            if ( string1Splitted[index1].toLowerCase() === string2Splitted[index2].toLowerCase() ) {
                totalMatches++;
            }
        } 
    }

    return ( totalMatches / possibleMatches * 100 ).toPrecision( 4 );
}

// retrieve top 5 matches ( by title or by description )
export const getRecommendedSells = async ( likeList, userId ) => {
    top5Matches = [];
    const parsedLikeList = JSON.parse( likeList.likeList );

    const sellsFetched = await performSearch( '', 'complete:false AND NOT userId:' + userId ).then( response => response ).catch( error => console.error( error ) );
    
    const likedSells = sellsFetched.filter( value => parsedLikeList.includes( value.docId ) );

    const sellsFetchedNoLikes = sellsFetched.filter( value => !parsedLikeList.includes( value.docId ) );


    // retrieve all records with algolia (?) - where the user is not the current and complete is false

    for ( let i in likedSells ) {

        for ( let x in sellsFetchedNoLikes ) {

            // start comparing titles and descriptions - liked vs other
            const titleTitleMatch = Number( stringComparator( likedSells[i].title , sellsFetchedNoLikes[x].title ) );
            const titleDescMatch = Number( stringComparator( likedSells[i].title , sellsFetchedNoLikes[x].description ) );
            const descDescMatch = Number( stringComparator( likedSells[i].description , sellsFetchedNoLikes[x].description ) );
            const descTitleMatch = Number( stringComparator( likedSells[i].description , sellsFetchedNoLikes[x].title ) );

            const allMatches = [ titleTitleMatch, titleDescMatch, descDescMatch, descTitleMatch ]

            // console.log( "Titulo liked " + likedSells[i].title );
            // console.log( "Titulo a comparar " + sellsFetchedNoLikes[x].title );
            // console.log( "All matches" );
            // console.log( allMatches );

            allMatches.sort( ( a, b ) => b - a )

            getsTop5( sellsFetchedNoLikes[x].docId, allMatches[0] );
        }
    }
    
    // console.log( "Before adding:" );
    // console.log( top5Matches );

    // handle when length of returning array not 5
    addToTop5( likedSells, sellsFetchedNoLikes );

    console.log( "After adding:" );
    console.log( top5Matches );

    const finalFilter = top5Matches.reduce( (cb, value, index) => { 
        let result = ' OR ';
        if ( index === 0 ) return 'complete:false AND NOT userId:' + userId + ' AND docId:' + cb.docId;
        result += 'docId:' + value.docId;
        return cb + result; 
    }, top5Matches[0] )

    const negatedFilter = top5Matches.reduce( (cb, value, index) => { 
        let result = ' AND NOT ';
        if ( index === 0 ) return 'complete:false AND NOT userId:' + userId + ' AND NOT docId:' + cb.docId;
        result += 'docId:' + value.docId;
        return cb + result; 
    }, top5Matches[0] )

    const top5MatchesDocIdOnly = top5Matches.map( value => value.docId );

    return performSearch( '', finalFilter ).then( response => ( { sells: [ ...response], negatedFilter: negatedFilter, orderedList: top5MatchesDocIdOnly } ) ).catch( error => console.error( error ) );
}
