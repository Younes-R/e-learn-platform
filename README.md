## 🚧 Under Construction 🚧:

This app is still under development.

## Description:

This is a Next.js 15 App Router App, with Neon as database. It is a an E-learn Platform.

## Todo:

1. [ ] Implment data mutations:

   - [ ] a student can buy courses (needs some additional UI)
   - [ ] a student can buy sessions and enroll in them, or undo it
   - a teacher can:
     - [x] create his courses
     - [ ] edit his courses
     - [x] delete his courses
   - a teacher can:
     - [x] create his sessions
     - [ ] edit his sessions
     - [ ] delete his sessions
   - an admin can:
     - [x] create user accounts
     - [x] edit user accounts
     - [x] delete user accounts
   - [x] users can report each other

2. [ ] Implement the schedule endpoint:

   - [x] Implement the endpoint
   - [x] create a function to consume it
   - [x] Implement the UI to consume it
   - [ ] Add Links to sessions

3. [ ] Fix the bug on the media endpoint:
4. [ ] Implment a report system
5. [ ] Implement a notification system
6. [x] Create support and settings pages
7. [ ] Create the landing page
8. [ ] Implement search system
9. [ ] Add error handling on the RSC pages
10. [ ] Seperate courses (or courses/[id]) and sessions (or sessions/[id]) from teacher/student pages and merge them to common pages
11. [ ] Fix the ui of register and login pages
12. [x] Add payments success and failure pages
13. [x] Add log out functionality
14. [ ] Update the method used to identify files:

    - [ ] update the ui
    - [ ] update the database

## Implementation:

### Fetching Sessions Data on Calendar.tsx:

our idea is to:

1. fetch sessions data of the current month and store it `currSessions` or something similar
2. if blank1.length, fetch sessions data of the previous month and store it `prevSessions`, else continue
3. if blank2.length, fetch sessions data of the next month and store it in `nextSessions`, else continue.

sessions data should be of type `Array<DayData>` .

fetching and caching (async state management) is handeled by tanStackQuery.

`Day` Component has a dayData attribute, which should be set like this: if there is data corresponding to the day date, assign it to the component, else return null. we propose creating a function to handle this: `assignSession` that has two args: one argument called date of type `Date`, used to extract the year, month and day values from it. this argument is provided by the other props values of `Day`, and another argument sessions of type `Array<DayData>` which could be `currSessions`, `prevSessions` or `nextSessions`. the function searches for a an element in sessions with the same date values provided in the first argument. if found return this element, else return null.

`Day` should handle the null value returned by `AssignSession`.

from this, I suggest to change the type `DayData` to include also the exact date of the day (ie year, month, day) and remove day attribute from `SessionDataSegment`.

### About the Scroll Bahavior on Main Components and Lists (Maybe It Would Be Better If They Are Carousels.. ?):

in `Explore` component, there is an idea with:

```css
overflow-y: scroll
max-height: 75vh
/* this can be a useful way to precise the length of our components */

```

### Error Handling for Neon Postgres Driver SQL function:

SQL function of the Neon driver may throw an error in case of:

- connection problems (like: response.ok != true): bad connection, absence of it
- database related problems: syntax errors in the SQL query, querying non-existing columns, breaking constraints on some columns...

\*There may be some other cases we do not know about.

The second type of problems is dev related, as we are not letting the user input explicitly dictate the columns or tables being queried.

We settled on those rules:

- each function should log the error that happened inside it
- each function should tell the outer function using it that an error inside it happened, by throwing a new error to specify the location of the error from the prespective of the outer function

### Database Diagram:

![database tables diagram](e-learn-platform.drawio-database-diagram.svg)

## Bugs:

### Needed fix on route /api/media/[id]:

We need to check if the student has bought the course before letting him download its docs, or else if a student got the file-id of a non-bought course doc , he would be able to download it normally.

### On feat. createSession (DAL or SA):

We need to check that:

- start_time < end_time
- session periods does not overlap

The current implementation only checks if the sessions of the same teacher does not start and end at the same time, so two sessions from 4:00 to 5:00 are refused, but two sessions one from 4:00 -> 5:00 and the other from 4:01 to 5:00 is accepted

### On DAL updateUser, createCourse:

This two functions can be attacked with SQL injection, since we are building our queries by ourselves instead of using Neon Driver sql function (beacause we have to) that offered protection against this attack type.

The data validation/sanitization layer (Zod) on the SA cannot protect against this attack too.

We suggest adding the needed protection on either the SA or the DAL (I prefer on the DAL, since it is from its responsibility to preserve the "data safety")

## UI Bugs on scrollable components:

This appears in the common explore page, admin pages displaying users, courses or sessions...etc.

We need to make the components either carousels, or make them scrollable with a smooth movement and a fixed width and/or height.
