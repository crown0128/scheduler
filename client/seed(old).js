const seeder = require('mongoose-seed');

seeder.connect('mongodb://localhost/scheduledb', () => {
    seeder.loadModels([
        './models/EventInfo.js',
        './models/Role.js',
        './models/Schedule.js',
        './models/Volunteer.js',
        './models/WeeklyEvent.js'
    ]);

    seeder.clearModels(
        [
            'EventInfo',
            'Role',
            'Schedule',
            'Volunteer',
            'WeeklyEvent'
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
                '_id': 1,
                'startDate': '2020-03-07',
                'endDate': '2020-05-31',
            }             
        ]
    },
    {
        'model': 'WeeklyEvent',
        'documents': [
            {
                '_id': 1,
                'scheduleId': 1,
                'day': 7,
                'time': '17:00'
            },           
            {
                '_id': 2,
                'scheduleId': 1,
                'day': 1,
                'time': '09:00'
            },             
            {
                '_id': 3,
                'scheduleId': 1,
                'day': 1,
                'time': '11:15'
            }             
        ]
    },
    {
        'model': 'EventInfo',
        'documents': [
            {
                '_id': 1,
                'scheduleId': 1,
                'when': '2020-03-07 12:00:00',
                'roles':
                    [
                        {'roleId': 3, 'numberVolunteersNeeded': 3},
                        {'roleId': 4, 'numberVolunteersNeeded': 2},
                        {'roleId': 5, 'numberVolunteersNeeded': 2}
                    ]
            },
            {
                '_id': 2,
                'scheduleId': 1,
                'when': '2020-03-08 05:00:00',
                'roles':
                    [
                        {'roleId': 3, 'numberVolunteersNeeded': 3},
                        {'roleId': 4, 'numberVolunteersNeeded': 2},
                        {'roleId': 5, 'numberVolunteersNeeded': 2}
                    ]
            },
            {
                '_id': 3,
                'scheduleId': 1,
                'when': '2020-03-08 07:15:00',
                'roles':
                    [
                        {'roleId': 3, 'numberVolunteersNeeded': 3},
                        {'roleId': 4, 'numberVolunteersNeeded': 2},
                        {'roleId': 5, 'numberVolunteersNeeded': 2}
                    ]
            },
        ]
    },
    {
        'model': 'Role',
        'documents': [
            {
                '_id': 1,
                'scheduleId': 1,
                'roleName': "Sacristan"
            },         
            {
                '_id': 2,
                'scheduleId': 1,
                'roleName': "Lector"
            },         
            {
                '_id': 3,
                'scheduleId': 1,
                'roleName': "Eucharistic minister",
                'numberNeeded': 3
            },         
            {
                '_id': 4,
                'scheduleId': 1,
                'roleName': "Altar server",
                'numberNeeded': 2
            },         
            {
                '_id': 5,
                'scheduleId': 1,
                'roleName': "Usher",
                'numberNeeded': 2
            },         
        ]
    },
    {
        'model': 'Volunteer',
        'documents': [
            {
                '_id': 1,
                'firstName': 'Dorothy',
                'lastName': 'Pecce',
                'email': 'dot@gmail.com',
                'image': '312267_289510051082006_2093603433_n.jpg',
                'roles': [1, 3],
                'prefTimes': [{
                    'weeklyEventId':3, 
                    'percentPreferred': 100
                }]
            },         
            {
                '_id': 2,
                'firstName': 'Maura',
                'lastName': 'Slavin',
                'email': 'slavin@myfairpoint.net',
                'image': 'maura.jpg',
                'roles': [3],
                'prefTimes': [
                    {
                        'weeklyEventId':3, 
                        'percentPreferred': 100
                    }
                ],
                'with': [3]
            },         
            {
                '_id': 3,
                'firstName': 'Mike',
                'lastName': 'Slavin',
                'email': 'slavin@myfairpoint.net',
                'image': 'mike.jpg',
                'roles': [2],
                'prefTimes': [
                    {
                        'weeklyEventId':3, 
                        'percentPreferred': 100
                    }
                ],
                'with': [2]
            }
        ]
    },

]