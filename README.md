# NC News Seeding

# App Link

https://nc-news-6r1i.onrender.com/

# Summary

This app have a databse to show different kind of article with specific topics ,users and their comments

# To Run First Create ENV Files

## How To Add ENV File And Connect to DataBase

- First you have to create to .env files with the names of:
- 1 .env.test (For Test)
- 2 .env.development (For Development)

  For each of file you have to connect it to its relative DataBase
  To Do So you have to write

- 1 PGDATABASE = nc_news(NAME OF YOUR DATABASE )
- 2 PGDATABASE = nc_news_test(NAME OF YOUR Test DATABASE )

# Instructions

First clone the repo in your laptop or pc then you need to install dependencies if its by typing npm instal (npm i) it will install most of its package

-- Intsall Express.js (npm i express.js)
-- Install pg (npm i pg)
-- Install supertest (npm i supertest -D)

after installing these you have to create database by runing cmd

1. npm run setup-dbs
2. npm run seed-dev

if you are doing testing then (npm test **test**/app.test.js)
and if you want to run it on insomnia then run (node listen.js)
