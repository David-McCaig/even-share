## EvenShare

EvenShare is a user-friendly application designed to streamline the process of splitting expenses with others. Users have the flexibility to create groups by simply adding the email addresses of their family or friends. Upon receiving an email invitation to join EvenShare, family and friends can easily sign up and become part of the group.

Once logged into the app, users can effortlessly record their expenses, and EvenShare's intelligent algorithms will automatically calculate each individual's share. The app leverages the power of RTK Query, which not only optimizes performance by caching data but also minimizes data requests to Firebase. This advanced feature simplifies data management and enhances code cleanliness by consolidating data fetching into a single slice.

To further enhance user experience, pagination has been implemented, reducing page loading times and minimizing the amount of data fetched from Firebase. Moreover, the application benefits from the use of Typescript, ensuring a smooth runtime experience by preventing runtime issues.


![Home Page Screenshot](https://res.cloudinary.com/dui1zm17r/image/upload/v1695007503/Github/image_1_iucg11.png)

## Features
- Split expenses with ease among users.
- Create groups by adding family or friends' email addresses.
- Seamless onboarding for family and friends via email invitations.
- Automated calculation of each person's owed or owed amount upon login.
- Utilizes RTK Query to cache data, boosting performance and reducing Firebase data requests.
- Simplified data management and code cleanup with consolidated data fetching in one slice.
- Enhanced user experience with pagination for faster page loading times.
- Reduction of data fetched from Firebase for improved efficiency.
- Runtime issue prevention through the use of Typescript.


## Tech Stack

**Client:** 
Typescript, React, redux, Tailwind, Shadcn/ui 

[![My Skills](https://skillicons.dev/icons?i=typescript,react,tailwind,redux)](https://skillicons.dev)

**Server:**
Firebase

[![My Skills](https://skillicons.dev/icons?i=firebase)](https://skillicons.dev)

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`REACT_APP_API_URL`

## Run Locally

Clone the project

```bash
  git clone git@github.com:David-McCaig/parts-bin-client.git
```

Go to the project directory

cd into even-share

Install dependencies

```bash
  npm install 
```

Start the server on the client side 

Now the app should be live! 

## 🧑‍🎓 Lessons Learned

This was a really fun project to work on. I learnt how to use RTK query with Firebase. There’s not a whole lot of information out there at this point since the previous solution was to use Redux and thunks to fetch data with Firebase. Another fun problem to solve was figuring out how to set up pagination with RTK query which presented some challenges. Firebase has created this relatively easy to use pagination system that uses the full snapshot that Firebase sends you. This presented a bit of a challenge because RTK Query doesn’t like it when you send around non serialized data like a snapshot. There is a solution out there where you can use a middle wear with RTK query which essentially prevents the error message from showing but this solution is not recommended for Redux. In the end I set up variables outside of my slice that I was able to update. I think if I were to rebuild this project I would have probably set up a Node.js server on the backend with firestore. Currently I’m performing all of the calculations on the front end. By setting up Node.js on the backend I could move all calculations to the backend improving performance making the application more scalable. Other fun things I got to dive into with this project was thinking a little more about my bundle size. In the end the bundle size of the app was 1.3mb. Originally I was using Ant design icons which has a bundle size of about 744 kb’s. Unfortunately even if you’re only using a couple icons the tree shaking with webpack doesn’t work on this library. There are solutions to this issue using lazy loading but I opted to import individual svg’s since I was only using about 10 or so. All in all this reduced the bundle size a decent amount.

## 🧭 Roadmap

- Set up email notification using SendGrid.

- Set up Stripe payements so users can pay eachother through the app.
