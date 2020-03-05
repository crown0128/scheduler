const mongoose = require('mongoose');
const ObjectId = require('mongodb').ObjectID;
const seeder = require('mongoose-seed');

seeder.connect('mongodb://localhost/scheduledb', () => {
    seeder.loadModels([
        './Schedule.js',
        './Volunteer.js',
    ]);

    seeder.clearModels(
        [
            'Schedule',
            'Volunteer',
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
                'startDate': '2020-03-07',
                'endDate': '2020-05-31',
                'WeeklyEvent': 
                [
                    {
                        '_id': ObjectId("5e4c7f67f3a9883274f622fb"),
                        'day': "Saturday",
                        'time': '17:00'
                    },           
                    {
                        '_id': ObjectId("5e4c7f67f3a9883274f622fc"),
                        'day': "Sunday",
                        'time': '09:00'
                    },             
                    {
                        '_id': ObjectId("5e4c7f67f3a9883274f622fd"),
                        'day': "Sunday",
                        'time': '11:15'
                    }             
                ],
                'Role': 
                [
                    {
                        '_id': ObjectId("5e4c7f67f3a9883274f62301"),
                        'roleName': "Sacristan"
                    },         
                    {
                        '_id': ObjectId("5e4c7f67f3a9883274f62302"),
                        'roleName': "Lector"
                    },         
                    {
                        '_id': ObjectId("5e4c7f67f3a9883274f62303"),
                        'roleName': "Eucharistic minister",
                        'numberNeeded': 3
                    },         
                    {
                        '_id': ObjectId("5e4c7f67f3a9883274f62304"),
                        'roleName': "Altar server",
                        'numberNeeded': 2
                    },         
                    {
                        '_id': ObjectId("5e4c7f67f3a9883274f62305"),
                        'roleName': "Usher",
                        'numberNeeded': 2
                    },         
                ]
            },
        ]
    },
    
    {
        'model': 'Volunteer',
        'documents': [
            {
                '_id': ObjectId("5e4c7f67f3a9883274f62304"),
                'firstName': 'Dorothy',
                'lastName': 'P.',
                'email': 'dot@gmail.com',
                'image': 'dot.jpg',
                'roles': ["Sacristan", "Eucharistic Minister"],
                'prefTimes': [{
                    'WeeklyEventId': ObjectId("5e4c7f67f3a9883274f622fd"), 
                    'percentPreferred': 100
                }]
            },         
            {
                '_id': ObjectId("5e4c7f67f3a9883274f62305"),
                'firstName': 'Maura',
                'lastName': 'S.',
                'email': 'slavin@myfairpoint.net',
                'image': 'maura.jpg',
                'roles': ["Eucharistic Minister"],
                'prefTimes': [{
                    'WeeklyEventId': ObjectId("5e4c7f67f3a9883274f622fd"), 
                    'percentPreferred': 100
                }],
                'with': [ObjectId("5e4c7f67f3a9883274f62306")]
            },         
            {
                '_id': ObjectId("5e4c7f67f3a9883274f62306"),
                'firstName': 'Mike',
                'lastName': 'S.',
                'email': 'slavin@myfairpoint.net',
                'image': 'mike.jpg',
                'roles': ["Lector"],
                'prefTimes': [{
                    'WeeklyEventId': ObjectId("5e4c7f67f3a9883274f622fd"), 
                    'percentPreferred': 100
                }],
                'with': [ObjectId("5e4c7f67f3a9883274f62305")]
            }
        ]
    },

]