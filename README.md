# Social Network.

## Formation OpenClassrooms - Développeur Web

### P7 - Groupomania

---

## Introduction

It's an API, developped by me with React, Node.js, Express, MongoDB.

The API contains :

-   Authentication with JWT and bcrypt for the users account.
-   CRUD for manage the differents sauces.
-   Manage the statics files for get an image since an form.
-   Add a like or dislike on a post.

Enjoy !

---

## Install :

### Backend :

Install dependancies :  
`npm i`

Create a file `.env` for the environment variables configuration :  
You can see the example on `env.example` file.

Launch the server :  
`npm start`

### Frontend : 

Install dependancies :  
`npm i`

Launch the server :  
`npm start`

---

## Authentification routes :

`POST: /api/auth/signup`  
`POST: /api/auth/login`

## Sauces routes :

`GET: /api/sauces`  
`GET: /api/sauces/:id`  
`POST: /api/sauces`  
`PUT: /api/sauces/:id`  
`DELETE: /api/sauces/:id`  
`POST: /api/sauces/:id/like`
