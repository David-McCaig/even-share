## PartsBin

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

For the firebase env variables please email me at davidmccaig1@gmail.com
