console.log('Homework 2-A...')

d3.csv('data/hubway_trips_reduced.csv',parse,dataLoaded);

function dataLoaded(err,rows){

    //console.log(rows);

    var allTrips = crossfilter(rows);

    //console.log(allTrips);

    //#1. Filter by trips in 2012

    //set up filter's range
    var start_filter = new Date('January 1, 2012 00:00:00'),
        end_filter = new Date('December 31, 2012 23:59:59')

    //set up dimension by which to filter
    var tripsBy2012_a = allTrips.dimension(function(d){return d.endTime});

    //filter only 2012 trips
    var tripsby2012_b = tripsBy2012_a.filter([start_filter, end_filter]).top(Infinity);

    //GOAL #1
    console.log("All trips from 2012: ");
    console.log(tripsby2012_b.length);
    //console.log(tripsby2012_b);



    //#2. Filter by trips in 2012 by males
    var tripsby2012_m = allTrips.dimension( function(d){return d.gender} );

    var tripsby2012_mb = tripsby2012_m.filter('Male').top(Infinity);

    //GOAL #2
    console.log("All trips from 2012 by Males: ");
    console.log(tripsby2012_mb.length);
    //console.log(tripsby2012_mb);



    //#3. All trips in 2012 starting at Station 5

    //negate filter for male
    tripsby2012_m.filter(null);

    //add dimension for start station 5
    tripsby2012_st5 = allTrips.dimension (function(d){ return d.startStation });
    tripsby2012_st5b = tripsby2012_st5.filter('5').top(Infinity);

    //GOAL #3
    console.log("All trips from 2012 starting at Station 5: ");
    console.log(tripsby2012_st5b.length);
    //console.log(tripsby2012_st5b);


    //4. top 50 trips by duration

    //negate gender and year filter
    tripsBy2012_a.filter(null);
    tripsby2012_st5.filter(null);

    //add dimension of duration
    tripsbyduration = allTrips.dimension (function(d){ return d.duration });
    tripsbyduration_b = tripsbyduration.filter().top(50);

    //GOAL #4
    console.log("Top 50 trips by duration: ");
    console.log(tripsbyduration_b.length);
    //console.log(tripsbyduration_b);


    tripsbyduration.filter(null);



    //#5. filter by age, group by tens place (20s, 30s, 40s, etc)
    var tripsByAge = allTrips.dimension( function(d){ return d.age } );
    var tripsByAge_b = tripsByAge.group( function(d){ return Math.floor(d/10) });
    
    //pop values in last object bin because they are casual users with no age reported
    var popTripsAge = tripsByAge_b.all().pop()

    //GOAL #5
    console.log("Trips by age brackets of 10 yrs: ");
    console.log( tripsByAge_b.all() );

}

function parse(d){
    if(+d.duration<0) return;

    return {
        duration: +d.duration,
        startTime: parseDate(d.start_date),
        endTime: parseDate(d.end_date),
        startStation: d.strt_statn,
        endStation: d.end_statn,
        subscribed: d.subsc_type,
        zip: parseGen(d.zip_code), 
        birth_year: parseGen(+d.birth_date),
        age: parseAge(d.end_date, d.birth_date),
        gender: d.gender
    }
}

function parseDate(date){
    var day = date.split(' ')[0].split('/'),
        time = date.split(' ')[1].split(':');

    return new Date(+day[2],+day[0]-1, +day[1], +time[0], +time[1]);
}

function parseAge(date, birth){
    var day = date.split(' ')[0].split('/');

    //if (day[2]-birth > 150) { return 0 };
    return (day[2] - birth);
}

function parseGen(data){
    //if (data == false){ return 99999 }
     return data ;
}

