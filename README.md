## Description

This is a Next.js 15 App Router App, with Neon as database. It is a an E-learn Platform.

## Todo

- [x] initialize repo and push to github
- [x] create Neon Database and connect App to it
- [x] add CodeRabbit as a reviewer
- [ ] review UI design
- [x] create db schemas
- [ ] add BackBlaze B2 as object storage

### Auth

- [ ] implement basic registration/login
- [ ] implement forgot password functionality
- [ ] implement change password functionality
- [ ] implement email verification functionality
- [ ] implement registration/login with google account (Oauth ?)
- [ ] implememt authorization
- [ ] implement RBAC
- [ ]
- [ ]
- [ ]
- [ ]
- [ ]
- [ ]

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
