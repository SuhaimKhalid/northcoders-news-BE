# NC News Seeding

A full-stack Node.js and PostgreSQL project with environment-specific configurations for development and testing.

# App Link

https://nc-news-6r1i.onrender.com/

# 2. Set Up Environment Variables

- First you have to create two .env files with the names of:
- 1 .env.test (For Test)
- 2 .env.development (For Development)

  For each of file you have to connect it to its relative DataBase
  To Do So you have to write

- 1 PGDATABASE = nc_news(NAME OF YOUR DATABASE )
- 2 PGDATABASE = nc_news_test(NAME OF YOUR Test DATABASE )

## 📝 Summary

This app connects to a PostgreSQL database to display a collection of articles categorized by specific topics. It also features user profiles and allows users to view and interact with comments on each article.

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
