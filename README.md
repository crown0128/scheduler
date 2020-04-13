# Weekly Scheduler
Github repository: [https://github.com/MauraSlavin/scheduler](https://github.com/MauraSlavin/scheduler). <br />
Deployed app on Heroku: [https://pure-peak-11802.herokuapp.com/](https://pure-peak-11802.herokuapp.com/).

## Brief description

The Weekly Scheduler allows users to easily assign volunteers to positions at weekly events. 

First, a schedule is set up with start and end dates, the days of the week and start times of weekly events, the tasks volunteers are needed for, and how many of each.

Then volunteers are added with their name, email address, tasks they can do, weekly time slot, and any dates they are not available.

## User story

As a church secretary responsible for scheduling volunteers to help at the weekly Masses, I need to generate a slate of volunteer assignments for all the Masses.  I usually schedule 2-4 months at a time.

## Technologies used

- Express
- Mongo DB
- Mongoose
- Vue
- Vuetify
- Axios
- Node.js
- JavaScript
- moment.js pkg
- jsPDF pkg
- HTML & CSS

## Functionality

From the home page:

![Home](client/documentation/home.png)

Click on Schedules to see a list of existing schedules:

![Schedule List](client/documentation/schedule-list.png)


You may edit an existing schedule, or set up a new schedule.  The screen for either is very similar, except you can't change the name or the date range for an existing schedule (yet).

Click the button near the top that says "Set up a new schedule" to begin creating a new schedule.

On the first page, enter a name and select beginning and ending dates.

![Schedule Name and Dates](client/documentation/schedule-dates.png)

Click the disc icon to save that and move on to choosing when the weekly events will be, and what volunteers are needed:

![Schedule Days Times and Volunteers](client/documentation/schedule-days-volunteers.png)

Now you are ready to enter volunteers!

Click on the Volunteers icon on the top right to see a list of volunteers.  You may edit or delete existing volunteers by clicking on the corresonding icon next to the volunteer's information; or add a new volunteer by clicking the large button near the top of the screen.  Note that this window has extensive ordering and sorting capabilities.

![Volunteer List](client/documentation/volunteer-list.png)

The page to edit volunteers lets you enter or edit the volunteer name, email, role they wish to volunteer for, weekly time slot, and when they are NOT available (if this is not entered, it will be assumed that they are always available during the chosen weekly event).  There are also avatars to choose from, just for fun!

![Edit Volunteer](client/documentation/edit-volunteer.png)

Once all the volunteers are done, a slate of volunteer assignments can be generated from the list of schedules.

![Generate Schedule](client/documentation/generate-schedule.png)

Here is an example of the slate generated.  Clicking the area indicated will create a PDF and put it in your Downloads folder.

![See the slate](client/documentation/make-pdf.png)




## Database structure

There are two tables in the database: one for Schedules, and one for Volunteers.

Schedules:

- name: String, required, unique  -  name of schedule
- startDate: String, required  -  beginning date of schedule
- endDate: String, required  -  ending date of schedule
- version: Number, default is 0  -  append to PDF filename (not currently being used)
- roles:   array of:  -  tasks needed for this event
  - roleName: String, required  -  name of task
  - numberNeeded: Number, default is 1  -  how many are needed at each event
- weeklyEvents: array of:  -  when each weekly event occurs
  - day: String, required  -  day of week (i.e. "Saturday")
  - time: String, required  -  time of day (i.e. "17:15" for 5:15pm)

Volunteers:

- firstName: String, required  -  first name of volunteer
- lastName: String, required  -  last name of volunteer
- (firstName & lastName combination is unique)
- email: mongoose.SchemaTypes.Email  -  email of volunteer
- image: String  -  name of file where avatar jpg file can be found
- roles: array of:  -  task volunteer signs up for
    - Strings
- prefTimes: array of:  -  time slot volunteer signs up for
  - day: String, required  -  day of week (i.e. "Saturday")
  - time: String, required  // time of weekly event  -  time of day (i.e. "17:15")
  - percentPreferred: Number between 0 and 100, required, default 100  -  (not being used, yet)
  - with: array of:  -  who to schedule with (not used, yet)
    - ObjectId: (of volunteer to schedule with)
  - notWith: array of:  -  who to avoid scheduling with (not used, yet)
    - ObjectId: (of volunteer to schedule with)
  - notAvailable: array of:  -  dates the volunteer is not available
    - String: dates in "yyyy-mm-dd" format  (i.e. ["2020-03-21", "2020-03-22"])