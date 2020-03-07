const mongoose = require('mongoose');
const ObjectId = require('mongodb').ObjectID;
const seeder = require('mongoose-seed');

seeder.connect('mongodb://localhost/scheduledb', () => {
    seeder.loadModels([
        './Role.js',
        './WeeklyEvent.js',
        './Schedule.js',
        './Volunteer.js'
    ]);

    seeder.clearModels(
        [
            'Role',
            'WeeklyEvent',
            'Schedule',
            'Volunteer'
        ], () => {
        seeder.populateModels(data, () => {
            seeder.disconnect();
        });
    });
});

const data = [
    {
        'model': 'Schedule',
        'documents': [
            {
                '_id': ObjectId("5e4c7f67f3a9883274f622fa"),
                'name': 'Spring schedule',
                'startDate': '2020-03-07 12:00',
                'endDate': '2020-05-31 12:00',
                'version': 0
                // 'weeklyEvents': 
                //     [   
                //         ObjectId("5e4c7f67f3a9883274f622fb"),
                //         ObjectId("5e4c7f67f3a9883274f622fc"),
                //         ObjectId("5e4c7f67f3a9883274f622fd")
                //     ],
                // 'roles': 
                //      [   
                //         ObjectId("5e4c7f67f3a9883274f62301"),
                //         ObjectId("5e4c7f67f3a9883274f62302"),
                //         ObjectId("5e4c7f67f3a9883274f62303"),
                //         ObjectId("5e4c7f67f3a9883274f62304"),
                //         ObjectId("5e4c7f67f3a9883274f62305")
                //     ]
            },
        ]
    },

    {   'model': 'Role',
        'documents': [
            {
                '_id': ObjectId("5e4c7f67f3a9883274f62301"),
                'roleName': "Sacristan",
                'numberNeeded': 1,
                'scheduleId': ObjectId("5e4c7f67f3a9883274f622fa")
            },         
            {
                '_id': ObjectId("5e4c7f67f3a9883274f62302"),
                'roleName': "Lector",
                'numberNeeded': 1,
                'scheduleId': ObjectId("5e4c7f67f3a9883274f622fa")
            },         
            {
                '_id': ObjectId("5e4c7f67f3a9883274f62303"),
                'roleName': "Eucharistic minister",
                'numberNeeded': 3,
                'scheduleId': ObjectId("5e4c7f67f3a9883274f622fa")
            },         
            {
                '_id': ObjectId("5e4c7f67f3a9883274f62304"),
                'roleName': "Altar server",
                'numberNeeded': 2,
                'scheduleId': ObjectId("5e4c7f67f3a9883274f622fa")
            },         
            {
                '_id': ObjectId("5e4c7f67f3a9883274f62305"),
                'roleName': "Usher",
                'numberNeeded': 2,
                'scheduleId': ObjectId("5e4c7f67f3a9883274f622fa")
            },         
        ],
    },

    {   'model': 'WeeklyEvent',
        'documents': [
            {
                '_id': ObjectId("5e4c7f67f3a9883274f622fb"),
                'day': "Saturday",
                'time': '17:00',
                'scheduleId': ObjectId("5e4c7f67f3a9883274f622fa")
            },           
            {
                '_id': ObjectId("5e4c7f67f3a9883274f622fc"),
                'day': "Sunday",
                'time': '09:00',
                'scheduleId': ObjectId("5e4c7f67f3a9883274f622fa")
            },             
            {
                '_id': ObjectId("5e4c7f67f3a9883274f622fd"),
                'day': "Sunday",
                'time': '11:15',
                'scheduleId': ObjectId("5e4c7f67f3a9883274f622fa")
            }             
        ],
    },
    
    {
        'model': 'Volunteer',
        'documents': [
            {
                '_id': ObjectId("5e4c7f67f3a9883274f62401"),
                'firstName': 'Dorothy',
                'lastName': 'P.',
                'email': 'dot@gmail.com',
                'image': 'dot.jpg',
                'roles': [ObjectId("5e4c7f67f3a9883274f62301"), ObjectId("5e4c7f67f3a9883274f62303")],
                'prefTimes': [{
                    '_id': ObjectId("5e4c7f67f3a9883274f622fd"), 
                    'percentPreferred': 100
                }]
            },         
            {
                '_id': ObjectId("5e4c7f67f3a9883274f62402"),
                'firstName': 'Maura',
                'lastName': 'S.',
                'email': 'slavin@myfairpoint.net',
                'image': 'maura.jpg',
                'roles': [ObjectId("5e4c7f67f3a9883274f62303")],
                'prefTimes': [{
                    '_id': ObjectId("5e4c7f67f3a9883274f622fd"), 
                    'percentPreferred': 100
                }],
                'with': [ObjectId("5e4c7f67f3a9883274f62403")]
            },         
            {
                '_id': ObjectId("5e4c7f67f3a9883274f62403"),
                'firstName': 'Mike',
                'lastName': 'S.',
                'email': 'slavin@myfairpoint.net',
                'image': 'mike.jpg',
                'roles': [ObjectId("5e4c7f67f3a9883274f62302")],
                'prefTimes': [{
                    '_id': ObjectId("5e4c7f67f3a9883274f622fd"), 
                    'percentPreferred': 100
                }],
                'with': [ObjectId("5e4c7f67f3a9883274f62402")]
            }
        ]
    },

]