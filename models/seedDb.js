const seeder = require('mongoose-seed');
const mongoose = require("mongoose");

// Connect to MongoDB
seeder.connect('mongodb://localhost:scheduler', function() {

    //load models
    seeder.loadModels([
        './EventInfo.js',
        './Role.js',
        './Schedule.js',
        './Volunteer.js',
        './WeeklyEvent.js'
    ]);

    // clear collections
    seeder.clearModels([
        'EventInfo',
        'Role',
        'Schedule',
        'Volunteer',
        'WeeklyEvent'
    ], function() {
        seeder.populateModels(data, function() {
            seeder.disconnect();
        });
    });
});


const data = [
    {
        'model': 'EventInfo',
        documents: 
            [
                {
                    'scheduledId': '1',
                    'when': '2020-03-07 17:00:00',
                    'roles': [
                        {
                            'roleId': '1',
                            'numberVolunteersNeeded': '1'
                        },
                        {
                            'roleId': '2',
                            'numberVolunteersNeeded': '1'
                        },
                        {
                            'roleId': '3',
                            'numberVolunteersNeeded': '3'
                        },
                        {
                            'roleId': '4',
                            'numberVolunteersNeeded': '1'
                        },
                        {
                            'roleId': '5',
                            'numberVolunteersNeeded': '1'
                        }
                    ]
                }
            ]
    }
]