// percentage value on which title or description should match
const PERSONALIZATION_IMPACT = 50;

const TITLE_1 = 'Iphone  12 novinho em folha';
const DESC_1 = 'we should be equal';
const TITLE_1_V2 = 'Iphone  12 novinho em folha';
const DESC_1_V2 = 'we should not be equal';

// liked one 
const TITLE_2 = 'Vendo iphone';
const DESC_2 = 'we should not be equal';

let top5Matches = [];

const sortArray = array => {
    array.sort( ( a, b ) => {
        return a.matchValue - b.matchValue;
    })
}

const getsTop5 = ( docId, matchValue ) => {
    if ( top5Matches.length < 5 ) top5Matches.push( { docId: docId, matchValue: matchValue } );
    else {
        let copiedArray = [ ...top5Matches ];
        copiedArray.push({ docId: docId, matchValue: matchValue } );
        sortArray( copiedArray );
        copiedArray.shift();
        top5Matches = copiedArray;
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
    console.log( "Possible matches: " + possibleMatches );

    for ( index1 in string1Splitted ) {
        if ( string1Splitted[index1].trim() === '' ) continue; 

        for ( index2 in string2Splitted ) {
            if ( string2Splitted[index2].trim() === '' ) continue; 
            if ( string1Splitted[index1].toLowerCase() === string2Splitted[index2].toLowerCase() ) {
                totalMatches++;
            }
        } 
    }

    console.log( "Matched " + totalMatches + " out of " + possibleMatches );

    return ( totalMatches / possibleMatches * 100 ).toPrecision( 4 );
}

// retrieve top 5 matches ( by title or by description )
const getRecommendatedSells = () => {
    top5Matches = [];
    // get our events - user likes and later maybe user img clicks after search
    const likedSells = [ { title: TITLE_2, description: DESC_2, objId: 'likedSell' } ];
    const sellsFetched = [ { title: TITLE_1, description: DESC_1, objId: 'firstSell' }, { title: TITLE_1_V2, description: DESC_1_V2, objId: 'secondSell' } ];

    // retrieve all records with algolia (?) - where the user is not the current and complete is false

    for ( i in likedSells ) {

        for ( x in sellsFetched ) {
            // if same sell continue
            if ( likedSells[i] === sellsFetched[x] ) continue;

            // start comparing titles and descriptions with the ones liked and clicked
            const titleMatch = Number( stringComparator( likedSells[i].title , sellsFetched[x].title ) );
            const descMatch = Number( stringComparator( likedSells[i].description , sellsFetched[x].description ) );

            const betterMatch = titleMatch >= descMatch ? titleMatch : descMatch;

            getsTop5( sellsFetched[x].objId, betterMatch );
        }
    }
    // use case - if like on iphone then top iphones will show

    console.log( top5Matches );
}

getRecommendatedSells();