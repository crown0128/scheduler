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
                '_id': ObjectId("5e4c7f67f3b9883274f622fa"),
                'name': 'Small schedule',
                'startDate': '2020-03-07 12:00',
                'endDate': '2020-05-31 12:00',
                'weeklyEvents': 
                [
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
            {
                '_id': ObjectId("5e4c7f67f3b9883274f6223a"),
                'name': 'Test schedule',
                'startDate': '2020-03-07 12:00',
                'endDate': '2020-03-16 12:00',
                'weeklyEvents': 
                [
                    {
                        'day': "Sunday",
                        'time': '11:15'
                    },            
                    {
                        'day': "Saturday",
                        'time': '17:00'
                    }             
                ],
                'roles': 
                [
                    {
                        'roleName': "Sacristan",
                        'numberNeeded': 1
                    },         
                    {
                        'roleName': "Eucharistic minister",
                        'numberNeeded': 3
                    },         
                    {
                        'roleName': "Altar server",
                        'numberNeeded': 2
                    }
                ]
            },
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
            {
                '_id': ObjectId("5e4c7f67f3a9883274f111fa"),
                'name': 'Winter schedule',
                'startDate': '2020-01-01 12:00',
                'endDate': '2020-03-07 12:00',
                'weeklyEvents': 
                [
                    {
                        'day': "Sunday",
                        'time': '07:00'
                    },             
                    {
                        'day': "Sunday",
                        'time': '10:30'
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
                        'numberNeeded': 1
                    },         
                    {
                        'roleName': "Altar server",
                        'numberNeeded': 2
                    },         
                    {
                        'roleName': "Usher",
                        'numberNeeded': 1
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
                'image': 'cat.jpg',
                'roles': ["Sacristan"],
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
                'image': 'dog.jpg',
                'roles': ["Eucharistic minister"],
                'prefTimes': [{
                    'day': "Sunday",
                    'time': '11:15',
                    'percentPreferred': 100
                }],
                'notAvailable': ["2020-03-08"]
            },         
            {
                '_id': ObjectId("5e4c7f67f3a9883274f62112"),
                'firstName': 'Felicia',
                'lastName': 'S.',
                'email': 'fs@gmail.com',
                'image': 'tiger.jpg',
                'roles': ["Eucharistic minister"],
                'prefTimes': [{
                    'day': "Sunday",
                    'time': '11:15',
                    'percentPreferred': 100
                }]
            },         
            {
                '_id': ObjectId("5e4c7f67f3a9883274f62111"),
                'firstName': 'Andy',
                'lastName': 'L.',
                'email': 'andy@gmail.com',
                'image': 'cat.jpg',
                'roles': ["Eucharistic minister"],
                'prefTimes': [{
                    'day': "Sunday",
                    'time': '11:15',
                    'percentPreferred': 100
                }]
            },         
            {
                '_id': ObjectId("5e4c7f67f3a9883274f62306"),
                'firstName': 'Mike',
                'lastName': 'S.',
                'email': 'slavin@myfairpoint.net',
                'image': 'sneaker.jpg',
                'roles': ["Lector"],
                'prefTimes': [{
                    'day': "Sunday",
                    'time': '11:15',
                    'percentPreferred': 100
                }]
            },
            {
                '_id': ObjectId("5e4c7f67f3a9883274f62113"),
                'firstName': 'Danielle',
                'lastName': 'S.',
                'email': 'dani@gmail.com',
                'image': 'sneaker.jpg',
                'roles': ["Altar server"],
                'prefTimes': [{
                    'day': "Sunday",
                    'time': '11:15',
                    'percentPreferred': 100
                }]
            },
            {
                '_id': ObjectId("5e4c7f67f3a9883274f62114"),
                'firstName': 'Kaleigh',
                'lastName': 'B.',
                'email': 'kaleigh@gmail.com',
                'image': 'puppy.jpg',
                'roles': ["Altar server"],
                'prefTimes': [{
                    'day': "Sunday",
                    'time': '11:15',
                    'percentPreferred': 100
                }]
            },
            {
                '_id': ObjectId("5e4c7f67f3a9883274f62115"),
                'firstName': 'Gene',
                'lastName': 'G.',
                'email': 'gene@gmail.com',
                'image': 'cheetah.jpg',
                'roles': ["Usher"],
                'prefTimes': [{
                    'day': "Sunday",
                    'time': '11:15',
                    'percentPreferred': 100
                }]
            },
            {
                '_id': ObjectId("5e4c7f67f3a9883274f62116"),
                'firstName': 'Susan',
                'lastName': 'M.',
                'email': 'sue@gmail.com',
                'image': 'orange flower.jpg',
                'roles': ["Usher"],
                'prefTimes': [{
                    'day': "Sunday",
                    'time': '11:15',
                    'percentPreferred': 100
                }]
            },
            {
                '_id': ObjectId("6e4c7f67f3a9883274f62304"),
                'firstName': 'Dorothy2',
                'lastName': 'P.',
                'email': 'dot@gmail.com',
                'image': 'cat.jpg',
                'roles': ["Sacristan"],
                'prefTimes': [{
                    'day': "Saturday",
                    'time': '17:00',
                    'percentPreferred': 100
                }]
            },         
            {
                '_id': ObjectId("6e4c7f67f3a9883274f62305"),
                'firstName': 'Maura2',
                'lastName': 'S.',
                'email': 'slavin@myfairpoint.net',
                'image': 'dog.jpg',
                'roles': ["Eucharistic minister"],
                'prefTimes': [{
                    'day': "Saturday",
                    'time': '17:00',
                    'percentPreferred': 100
                }]
            },         
            {
                '_id': ObjectId("6e4c7f67f3a9883274f62112"),
                'firstName': 'Felicia2',
                'lastName': 'S.',
                'email': 'fs@gmail.com',
                'image': 'tiger.jpg',
                'roles': ["Eucharistic minister"],
                'prefTimes': [{
                    'day': "Saturday",
                    'time': '17:00',
                    'percentPreferred': 100
                }]
            },         
            {
                '_id': ObjectId("6e4c7f67f3a9883274f62111"),
                'firstName': 'Andy2',
                'lastName': 'L.',
                'email': 'andy@gmail.com',
                'image': 'cat.jpg',
                'roles': ["Eucharistic minister"],
                'prefTimes': [{
                    'day': "Saturday",
                    'time': '17:00',
                    'percentPreferred': 100
                }]
            },         
            {
                '_id': ObjectId("6e4c7f67f3a9883274f62306"),
                'firstName': 'Mike2',
                'lastName': 'S.',
                'email': 'slavin@myfairpoint.net',
                'image': 'sneaker.jpg',
                'roles': ["Lector"],
                'prefTimes': [{
                    'day': "Saturday",
                    'time': '17:00',
                    'percentPreferred': 100
                }]
            },
            {
                '_id': ObjectId("6e4c7f67f3a9883274f62113"),
                'firstName': 'Danielle2',
                'lastName': 'S.',
                'email': 'dani@gmail.com',
                'image': 'sneaker.jpg',
                'roles': ["Altar server"],
                'prefTimes': [{
                    'day': "Saturday",
                    'time': '17:00',
                    'percentPreferred': 100
                }]
            },
            {
                '_id': ObjectId("6e4c7f67f3a9883274f62114"),
                'firstName': 'Kaleigh2',
                'lastName': 'B.',
                'email': 'kaleigh@gmail.com',
                'image': 'puppy.jpg',
                'roles': ["Altar server"],
                'prefTimes': [{
                    'day': "Saturday",
                    'time': '17:00',
                    'percentPreferred': 100
                }]
            },
            {
                '_id': ObjectId("6e4c7f67f3a9883274f62115"),
                'firstName': 'Gene2',
                'lastName': 'G.',
                'email': 'gene@gmail.com',
                'image': 'cheetah.jpg',
                'roles': ["Usher"],
                'prefTimes': [{
                    'day': "Saturday",
                    'time': '17:00',
                    'percentPreferred': 100
                }]
            },
            {
                '_id': ObjectId("6e4c7f67f3a9883274f62116"),
                'firstName': 'Susan2',
                'lastName': 'M.',
                'email': 'sue@gmail.com',
                'image': 'orange flower.jpg',
                'roles': ["Usher"],
                'prefTimes': [{
                    'day': "Saturday",
                    'time': '17:00',
                    'percentPreferred': 100
                }]
            },
        ]
    },

]