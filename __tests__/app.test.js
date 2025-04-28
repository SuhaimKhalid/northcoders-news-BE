const endpointsJson = require("../endpoints.json");

/* Set up your test imports here */
const request = require("supertest");
const db = require("../db/connection");
const app = require("../api");
const topicsdata = require("../db/data/test-data/index");

const seed = require("../db/seeds/seed");

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
