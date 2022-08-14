# Groupomania - Social Network.

## OpenClassrooms | Web Developer | Project 7

---

## Introduction

Hi !

For the Groupomania society, i created a social network.  
The goal of this app is to increase the well-being of employees and the atmosphere at work.

I hope you will like it.  
Do not hesitate to give me feedback if you have a problem or if you have ideas for improvement.

Have a good day !

---

## Installation :

Clone this repository or download zip with the green button "code.

### Backend :

Go to 'backend' folder :  
`cd backend`

Install dependancies :  
`npm i`

Create a `.env` file for the environment variables configuration :  
Follow the example on `env.example` file.

Launch the server :     
`npm start`

### Frontend :

Go to 'frontend' folder :  
`cd frontend`

Install dependancies :  
`npm i`

Launch the server :    
`npm start`

---
## API Routes 

## Authentification Routes :

| HTTP methods | URL | Function | Details |
|    :----:    | :-: | :------: | :-----: |
|`POST` | `/api/auth/signup` | Create new account | [View](#signup) |
|`POST` | `/api/auth/login` | Login to your account | [View](#login) |

## Posts routes :

| HTTP methods | URL | Function | Details |
|    :----:    | :-: | :------: | :-----: |
|`GET` | `/api/posts` | Get all posts | [View](#allposts)  |
|`GET` | `/api/posts/:userId` | Get all posts from a user | [View](#userposts) |
|`POST` | `/api/posts` | Create a post | [View](#createpost) |
|`PUT` | `/api/posts/:id` | Modify a post | [View](#modifypost) |
|`DELETE` | `/api/posts/:id` | Delete a post | [View](#deletepost) |
|`POST` | `/api/posts/:id/like` | Like or Dislike a post | [View](#likepost) |

For all the posts routes, the `JWT` is required in the header Authorization.

Adding Bearer before the token.

---

## API Requests and Responses :
### <a id="signup"></a>Create new account : ###
```
## Request Body :
{
  "pseudo": "String",
  "email": "String",
  "password": "String"
}

## Response : 
{
  "userCreated": "Boolean",
  "message": "String"
}
```

### <a id="login"></a>Login to your account : ###
```
## Request Body :
{
  "email": "String",
  "password": "String"
}

## Response : 
{
  "userId": "String",
  "pseudo": "String",
  "createdAt": "Date",
  "role": "String",
  "token": "String",
}
```

### <a id="allposts"></a>Get all posts : ###
```
## Response : 
An array of objects
[{...}, {...}, {...}]
```

### <a id="userposts"></a>Get all posts from a user : ###
```
## Response : 
An array of objects
[{...}, {...}, {...}]
```

### <a id="createpost"></a>Create a post : ###
```
## Request Body :
FormData :
{
  "image": "File",
  "post": "JSON.Stringify"({
     "userId": "String",
     "pseudo": "String",
     "title": "String",
     "description": "String",
  }) 
}

## Response : 
{
  "message": "String",
}
```

### <a id="modifypost"></a>Modify a post : ###
```
## Request Body :
if have image => FormData :
{
  "image": "File",
  "post": "JSON.Stringify"({
     "userId": "String",
     "pseudo": "String",
     "title": "String",
     "description": "String",
  }) 
}

if not have image => JSON :
{
  "userId": "String",
  "pseudo": "String",
  "title": "String",
  "description": "String",
}

## Response : 
{
  "message": "String",
}
```

### <a id="deletepost"></a>Delete a post : ###
```
## Request Body :
{
  "userId": "String",
}

## Response : 
{
  "message": "String",
}
```

### <a id="likepost"></a>Like or Dislike a post : ###
```
## Request Body :
Like :
{
  "userId": "String",
  "like": 1,
}

Dislike :
{
  "userId": "String",
  "dislike": -1,
}

Cancel like or dislike :
{
  "userId": "String",
  "like": 0,
}

## Response : 
{
  "message": "String",
}
```