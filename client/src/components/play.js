moment = require('moment');

function getArrayDepth(thing) {
            return Array.isArray(thing) ? 
                1 + Math.max(...thing.map(getArrayDepth)) : 0;
        };


const dates = [
     ["2020-03-08", "2020-03-15"],
     ["2020-03-09", "2020-03-16"]
];

const roles = [ "Sacristan", "Lector" ];

weeklyEvents = [ 
    {
        id: 1,
        day: "Sunday",
        time: "17:00"
    },
    {
        id: 2,
        day: "Monday",
        time: "11:15"
    }
    ];

            let xxx = getArrayDepth(dates);
            console.log("DEPTH of dates: ");
            console.log(xxx);

            let slate = [];
            console.log("---- dates:");
            console.log(dates);
            console.log("---- roles:");
            console.log(roles);
            console.log("---- weeklyEvents");
            console.log(weeklyEvents);

            // for each weekly event
            dates.forEach((weeklyEventDates, we) => {
                console.log("In foreach dates");
                console.log("dates:");
                console.log(dates);
                console.log("weeklyEventDates:");
                console.log(weeklyEventDates);

                weeklyEventDates.forEach( (date, d) => {
                    console.log("In foreach date in weeklyeventdates");
                    console.log("date:");
                    console.log(date);
                    //    get date, time & day
                    const slateDate = moment(date).format("M/D/YYYY");
                    const day = moment(date).format("dddd");
                    // const time = moment(weeklyEvents[we].time).format("hh:mm a");
                    // const keyDate = date.concat(" ", day, " at ", time);
                    const keyDate = slateDate.concat(" ", day, " at ", weeklyEvents[we].time);
                    console.log("keyDate: " + keyDate);

                    //    for each specific date (index d)
                    //    build an object (which will be a row in the displayed/PDF slate)
                    weeklyEventDates.forEach((date,d) => {
                        // first property is the date
                        let thisObject = {
                            date: keyDate
                        };
                        // remaining properties are the roles
                        roles.forEach( role => {
                            thisObject[role] = '';
                        });
                        slate.push(thisObject);
                    });
                });
            });
            console.log("SKELETON slate:");
            console.log(slate);

            
            
            console.log("in buildSkeleton");
            console.log("dates:");
            console.log(dates);
            console.log(roles);
