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
                'name': 'Spring schedule',
                'startDate': '2020-03-07 12:00',
                'endDate': '2020-05-31 12:00',
                'weeklyEvents': 
                [
                    {
                        'day': "Saturday",
                        'time': '17:00'
                    },           
                    {
                        'day': "Sunday",
                        'time': '09:00'
                    },             
                    {
                        'day': "Sunday",
                        'time': '11:15'
                    }             
                ],
                'roles': 
                [
                    {
                        'roleName': "Sacristan",
                        'numberNeeded': 1
                    },         
                    {
                        'roleName': "Lector",
                        'numberNeeded': 1
                    },         
                    {
                        'roleName': "Eucharistic minister",
                        'numberNeeded': 3
                    },         
                    {
                        'roleName': "Altar server",
                        'numberNeeded': 2
                    },         
                    {
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
                    'day': "Sunday",
                    'time': '11:15',
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
                    'day': "Sunday",
                    'time': '11:15',
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
                    'day': "Sunday",
                    'time': '11:15',
                    'percentPreferred': 100
                }],
                'with': [ObjectId("5e4c7f67f3a9883274f62305")]
            }
        ]
    },

]