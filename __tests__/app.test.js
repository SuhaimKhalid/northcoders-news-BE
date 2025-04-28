const endpointsJson = require("../endpoints.json");

/* Set up your test imports here */
const request = require("supertest");
const db = require("../db/connection");
const app = require("../api");
const topicsdata = require("../db/data/test-data/index");

const seed = require("../db/seeds/seed");
const articles = require("../db/data/test-data/articles");

/* Set up your beforeEach & afterAll functions here */

beforeEach(() => {
  return seed(topicsdata);
});

afterAll(() => {
  return db.end();
});

describe("GET /api", () => {
  test("200: Responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsJson);
      });
  });
});

describe("Task 2 GET/api/topics", () => {
  test("200: Return the topic table with its propertties and values", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then((result) => {
        const topic = result.body.topics[0];
        expect(typeof topic.slug).toBe("string");
        expect(typeof topic.description).toBe("string");
      });
  });

  test("404: Not Found", () => {
    return request(app)
      .get("/api/topizs")
      .expect(404)
      .then((result) => {
        expect(result.body.msg).toBe("Not Found");
      });
  });
});

describe("Task 3 GET/api/articles", () => {
  test("200: Responds With array of articles", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((result) => {
        const articles = result.body.articles;
        expect(articles.length).not.toBe(0);
      });
  });
  test("200: Responds With singal Article from articles", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then((result) => {
        const article = result.body.article[0];
        console.log(article);
        expect(article).toMatchObject({
          article_id: expect.any(Number),
          title: expect.any(String),
          topic: expect.any(String),
          body: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          article_img_url: expect.any(String),
          author: expect.any(String),
        });
      });
  });
});
