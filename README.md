Turner Threads: A Reddit Replica
Turner Threads is a simplified replica of Reddit, designed to test and showcase backend development skills, while also serving as a platform to explore React.js for frontend development and expand expertise in Node.js. This project is a lightweight, functional web app where users can interact with topics, posts, comments, and votes, with a smooth and intuitive user interface.

Features
User Authentication: Users can register, log in, and log out securely using JWT-based authentication.
Posts and Comments: Users can create, view, and engage with posts on various topics. Each post supports comment threads.
Upvotes: Posts can be upvoted to show engagement.
Topic Subscriptions: Users can subscribe to topics they’re interested in and view their subscriptions on their profile page.
Profile Page: Displays a user's subscribed topics and the total upvotes their posts have received.
Dynamic Sidebar: Lists all topics, making it easy to navigate and engage with specific communities.
Technology Stack
Frontend:
React.js
Axios for API calls
React Router for navigation
Backend:
Node.js
Express.js for server-side routing
PostgreSQL for the database
Authentication:
JWT for secure user authentication

The app uses PostgreSQL. Key tables include:

users: Stores user information (e.g., ID, username, hashed password, email).
topics: Contains topic names and descriptions.
posts: Manages posts with relationships to users and topics.
comments: Manages comments on posts.
user_votes: Tracks upvotes for posts by users.
user_subscriptions: Tracks user subscriptions to topics.
