## Description

This is a Next.js 15 App Router App, with Neon as database. It is a an E-learn Platform.

## Todo

- [x] initialize repo and push to github
- [x] create Neon Database and connect App to it
- [x] add CodeRabbit as a reviewer
- [x] review UI design
- [x] create db schemas
- [x] add BackBlaze B2 as object storage

### Auth

- [x] implement basic registration/login
- [x] implememt authorization
- [x] implement RBAC
- [ ] implement forgot password functionality
- [ ] implement change password functionality
- [ ] implement email verification functionality
- [ ] implement registration/login with google account (Oauth ?)

### Core Functionalities

#### Teacher

- [ ] create Courses, which contains Chapters, which contains Docs.
- [ ] create Sessions

##### Student

-

1. [ ] enroll in Courses and/or Sessions, by buying them
2. [ ] implement payment system

#### Both

- [ ] report other users (teachers/students), by creating reports

#### Moderator

- [ ] react to reports, by: doing an alert, ban or deleting the reported account.
- [ ] implement a notification system, for alerts
- [ ] implement a 'history' for alerts or bans, to use to decide to delete the account or not

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Implementation

### Fetching Sessions Data on Calendar.tsx

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

## Database Diagram:

![database tables diagram](e-learn-platform.drawio-database-diagram.svg)

## Needed fix on route /api/media/[id]:

We need to check if the student has bought the course before letting him download its docs, or else if a student got the file-id of a non-bought course doc , he would be able to download it normally.

## Bugs List:

- There is a bug in register server action: uploading the cv may fail, but the server action continue working anyway and reigster an null value as cv in users table (from Vercel logs, when trying to read the cv id it shows: undefined)
- ui: in CourseCard (appearing in the explore page), image borders are not rounded and the images are of rectangular shape, instead of a circular one
