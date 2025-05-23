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
        const topics = result.body.topics;
        topics.forEach((topic) => {
          expect(typeof topic.slug).toBe("string");
          expect(typeof topic.description).toBe("string");
        });
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
//TASK 3
describe("Task 3 GET/api/articles/:article_id", () => {
  test("Responds With an article from articles", () => {
    return request(app)
      .get("/api/articles/5")
      .expect(200)
      .then((result) => {
        const article = result.body.article;
        expect(article).toMatchObject({
          article_id: expect.any(Number),
          title: expect.any(String),
          topic: expect.any(String),
          author: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          article_img_url: expect.any(String),
        });
      });
  });

  describe("Error handling", () => {
    test("404: Not Found Invalid article Id", () => {
      return request(app)
        .get("/api/articles/1000")
        .expect(404)
        .then((result) => {
          expect(result.body.msg).toBe("Not Found");
        });
    });
    test("400: Bad Request with wrong data Type", () => {
      return request(app)
        .get("/api/articles/article_id")
        .expect(400)
        .then((result) => {
          expect(result.body.msg).toBe("Bad Request");
        });
    });
  });
});

//Custom

describe("Task 4 GET/api/articles", () => {
  test("Responds With array of articles if no sorting", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((result) => {
        const articles = result.body.articles;

        expect(articles.length).toBeGreaterThan(0);
        articles.forEach((article) => {
          expect(article).toMatchObject({
            article_id: expect.any(Number),
            title: expect.any(String),
            topic: expect.any(String),
            author: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(Number),
          });
        });
      });
  });
  test("Responds With array of articles with sorting", () => {
    return request(app)
      .get("/api/articles?sort_by=created_at&order=desc")
      .expect(200)
      .then((result) => {
        const articles = result.body.articles;

        expect(articles.length).toBeGreaterThan(0);
        articles.forEach((article) => {
          expect(article).toMatchObject({
            article_id: expect.any(Number),
            title: expect.any(String),
            topic: expect.any(String),
            author: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(Number),
          });
        });
        expect(articles).toBeSortedBy("created_at", { descending: true });
      });
  });

  describe("Error handing", () => {
    test("404: Not Found Invalid article Id", () => {
      return request(app)
        .get("/api/articles/10000/sort_by=created_at")
        .expect(404)
        .then((result) => {
          expect(result.body.msg).toBe("Not Found");
        });
    });
    test("400: Bad Request with wrong data Type", () => {
      return request(app)
        .get("/api/articles/sort_by=author")
        .expect(400)
        .then((result) => {
          expect(result.body.msg).toBe("Bad Request");
        });
    });
  });
});

describe("Task 5 GET /api/articles/:article_id/comments", () => {
  test("Responds With array of comments with specific Article ID with no sorting", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then((result) => {
        const comments = result.body.comments;
        expect(comments.length).toBeGreaterThan(0);
        comments.forEach((comment) => {
          expect(comment).toMatchObject({
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            article_id: expect.any(Number),
          });
        });
      });
  });
  test("Responds With array of comments with specific Article ID with sorting", () => {
    return request(app)
      .get("/api/articles/1/comments?sort_by=created_at&order=desc")
      .expect(200)
      .then((result) => {
        const comments = result.body.comments;
        expect(comments.length).toBeGreaterThan(0);
        comments.forEach((comment) => {
          expect(comment).toMatchObject({
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            article_id: expect.any(Number),
          });
        });
        expect(comments).toBeSortedBy("created_at", { descending: true });
      });
  });

  describe("Error handing", () => {
    test("404: Not Found Invalid article Id", () => {
      return request(app)
        .get("/api/articles/10000/comments")
        .expect(404)
        .then((result) => {
          expect(result.body.msg).toBe("Not Found");
        });
    });
    test("400: Bad Request with wrong data Type", () => {
      return request(app)
        .get("/api/articles/1/comments?sort_by=author")
        .expect(400)
        .then((result) => {
          expect(result.body.msg).toBe("Bad Request");
        });
    });
  });
});

describe("Task 6 POST /api/articles/:article_id/comments", () => {
  test("Add New Comment to specific Article id", () => {
    const newComment = {
      username: "butter_bridge",
      body: "How are you doing!",
    };

    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(201)
      .then((result) => {
        const comment = result.body.comment;
        expect(comment).toHaveProperty("comment_id");
        expect(comment.article_id).toBe(1);
        expect(comment.author).toBe("butter_bridge");
        expect(comment.body).toBe("How are you doing!");
        expect(comment.votes).toBe(0);
        expect(comment).toHaveProperty("created_at");
      });
  });

  describe("Error handing", () => {
    test("404: Responds with an error when article_id does not exist", () => {
      return request(app)
        .post("/api/articles/9999/comments")
        .send({ username: "butter_bridge", body: "How are you doing" })
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Not Found");
        });
    });
    test("400: Responds with an error when required fields are missing", () => {
      return request(app)
        .post("/api/articles/1/comments")
        .send({}) // empty object
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad Request: Missing required fields");
        });
    });
  });
});

describe("Task 7 PATCH /api/articles/:article_id", () => {
  test("Update the Article by Article Id ", () => {
    const newVote = { inc_votes: 10 };

    return request(app)
      .patch("/api/articles/1")
      .send(newVote)
      .expect(200)
      .then((result) => {
        const article = result.body.article;
        expect(article.votes).toBe(110);
        expect(article.article_id).toBe(1);
      });
  });

  describe("Error handing", () => {
    test("404: Responds with an error when article_id does not exist", () => {
      const newVote = { inc_votes: 10 };
      return request(app)
        .patch("/api/articles/9999")
        .send(newVote)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Not Found");
        });
    });
    test("400: Responds with an error when required fields are missing", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({}) // empty object
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad Request: Missing required fields");
        });
    });
  });
});

describe("Task 8 DELETE /api/comments/:comment_id", () => {
  test("Delete the comment by comment Id ", () => {
    return request(app)
      .delete("/api/comments/1")
      .expect(204)
      .then(({ body }) => {
        expect(body).toEqual({});
      });
  });

  describe("Error handing", () => {
    test("404: Responds with an error when comment Id does not exist", () => {
      const newVote = { inc_votes: 10 };
      return request(app)
        .delete("/api/comments/9999")
        .send(newVote)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Comment not found");
        });
    });
    test("400: Responds with an error when invalid Data Type", () => {
      return request(app)
        .delete("/api/comments/author")
        .send({}) // empty object
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad Request");
        });
    });
  });
});

describe("Task 9 GET /api/users", () => {
  test("Respond with array of users", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then((result) => {
        const user = result.body.users;

        user.forEach((row) => {
          expect(row).toMatchObject({
            username: expect.any(String),
            name: expect.any(String),
            avatar_url: expect.any(String),
          });
        });
      });
  });

  describe("Error handing", () => {
    test("400: Responds with an error when invalid url", () => {
      return request(app)
        .get("/api/user")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Not Found");
        });
    });
  });
});

describe("Task 10 GET/api/articles (sorting queries)", () => {
  test("Responds With sorted array of articles", () => {
    return request(app)
      .get("/api/articles?sort_by=created_at&order=ASC")
      .expect(200)
      .then((result) => {
        const articles = result.body.articles;
        expect(articles.length).toBeGreaterThan(0);
        expect(articles).toBeSortedBy("created_at", { descending: false });
      });
  });
  test("200: responds with all articles sorted by created_at ascending for topic 'cats'", () => {
    return request(app)
      .get("/api/articles?topic=cats&sort_by=created_at&order=ASC")
      .expect(200)
      .then(({ body }) => {
        const articles = body.articles;
        expect(Array.isArray(articles)).toBe(true);
        expect(articles.length).toBeGreaterThan(0);
        articles.forEach((article) => {
          expect(article).toHaveProperty("article_id");
          expect(article).toHaveProperty("title");
          expect(article.topic).toBe("cats");
        });
        const dates = articles.map((a) => new Date(a.created_at));
        const sorted = [...dates].sort((a, b) => a - b);
        expect(dates).toEqual(sorted);
      });
  });

  describe("Error handing", () => {
    test("400: Bad Request with wrong Column", () => {
      return request(app)
        .get("/api/articles/sort_by=author")
        .expect(400)
        .then((result) => {
          expect(result.body.msg).toBe("Bad Request");
        });
    });
  });
});

describe("Task 11 GET/api/articles (topic query)", () => {
  test("Responds With array of articles with respect to specific topic", () => {
    return request(app)
      .get("/api/articles/?topic=cats")
      .expect(200)
      .then((result) => {
        const articles = result.body.articles;

        expect(articles.length).toBeGreaterThan(0);

        articles.forEach((article) => {
          expect(article).toMatchObject({
            article_id: expect.any(Number),
            title: expect.any(String),
            topic: "cats",
            author: expect.any(String),
            body: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
          });
        });
      });
  });

  describe("Error handing", () => {
    test("400: Bad Request with wrong Column", () => {
      return request(app)
        .get("/api/articles/topic=dogs")
        .expect(400)
        .then((result) => {
          expect(result.body.msg).toBe("Bad Request");
        });
    });
  });
});

describe("Task 12 GET/api/articles/: article_id(comment_count)", () => {
  test("Responds With an objct of total count of comments for a Article ID ", () => {
    return request(app)
      .get("/api/articles/1/?countAllComments=true")
      .expect(200)
      .then((result) => {
        const article = result.body.article;
        expect(article).toMatchObject({
          article_id: expect.any(Number),
          title: expect.any(String),
          topic: expect.any(String),
          author: expect.any(String),
          body: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          article_img_url: expect.any(String),
          comment_count: 11,
        });
      });
  });

  describe("Error handing", () => {
    test("404: Not Found Invalid article Id", () => {
      return request(app)
        .get("/api/articles/10000/?countAllComments=true")
        .expect(404)
        .then((result) => {
          expect(result.body.msg).toBe("Not Found");
        });
    });
    test("400: Bad Request with wrong data Type", () => {
      return request(app)
        .get("/api/articles/article_id/?countAllComments=true")
        .expect(400)
        .then((result) => {
          expect(result.body.msg).toBe("Bad Request");
        });
    });
  });
});
