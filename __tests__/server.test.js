const request = require("supertest");
const app = require("../server/app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");
const apiJSON = require("../endpoints.json");
const { expect } = require("@jest/globals");

beforeEach(() => {
  return seed(testData);
});
afterAll(() => db.end());

describe("General Errors", () => {
  test("should return a 404 for an invalid address", () => {
    return request(app)
      .get("/api/bananas")
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("Path not found");
      });
  });
});

describe("GET api", () => {
  test("should return 200", () => {
    return request(app).get("/api").expect(200);
  });
  test("should return an object with a list of all the api calls on this server", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        expect(Object.keys(body.endpoints).length).not.toBe(0);
        for (const key in body.endpoints) {
          expect(body.endpoints[key]).toHaveProperty("description");
          expect(body.endpoints[key]).toHaveProperty("queries");
          expect(body.endpoints[key]).toHaveProperty("exampleResponse");
        }
      });
  });
  test("should return the endpoints.json exactly", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        expect(body.endpoints).toEqual(apiJSON);
      });
  });
});

describe("GET /api/topics", () => {
  test("should return 200 code", () => {
    return request(app).get("/api/topics").expect(200);
  });
  test('should return a list of topics with a "slug" and "description" value', () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        expect(body.topics.length).not.toBe(0);
        body.topics.forEach((topic) => {
          expect(topic).toHaveProperty("slug");
          expect(topic).toHaveProperty("description");
        });
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("should return a 200 code on succesful call", () => {
    return request(app).get("/api/articles/4").expect(200);
  });
  test("should return an object with the correct format", () => {
    return request(app)
      .get("/api/articles/4")
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toHaveProperty("article_id", 4);
        expect(body.article).toHaveProperty(
          "article_img_url",
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
        );
        expect(body.article).toHaveProperty("author", "rogersop");
        expect(body.article).toHaveProperty(
          "body",
          "We all love Mitch and his wonderful, unique typing style. However, the volume of his typing has ALLEGEDLY burst another students eardrums, and they are now suing for damages"
        );
        expect(body.article).toHaveProperty(
          "created_at",
          "2020-05-06T01:14:00.000Z"
        );
        expect(body.article).toHaveProperty("title", "Student SUES Mitch!");
        expect(body.article).toHaveProperty("topic", "mitch");
        expect(body.article).toHaveProperty("votes", 0);
      });
  });
  test('should return a 404 error with the message "Article not found" when provided an incorrect id', () => {
    return request(app)
      .get("/api/articles/70650")
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("Article not found");
      });
  });
  test('should return a 400 error with the message "Invalid data type" when not provided a number', () => {
    return request(app)
      .get("/api/articles/three")
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("Invalid data type");
      });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  test("should return 200 on successful call", () => {
    return request(app).get("/api/articles/1/comments").expect(200);
  });

  test("should return a list of all the comments attached to that article id", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments.length).toBe(11);
        body.comments.forEach((comment) => {
          expect(comment).toHaveProperty("comment_id");
          expect(typeof comment.comment_id).toBe("number");
          expect(comment).toHaveProperty("votes");
          expect(typeof comment.votes).toBe("number");
          expect(comment).toHaveProperty("created_at");
          expect(typeof comment.created_at).toBe("string");
          expect(comment).toHaveProperty("author");
          expect(typeof comment.author).toBe("string");
          expect(comment).toHaveProperty("body");
          expect(typeof comment.body).toBe("string");
          expect(comment).toHaveProperty("article_id");
          expect(typeof comment.article_id).toBe("number");
        });
      });
  });

  test('should return a 400 error with the message "Invalid data type" when not provided a number', () => {
    return request(app)
      .get("/api/articles/one/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("Invalid data type");
      });
  });

  test('should return a 404 error with the message "Article not found" when provided an incorrect id', () => {
    return request(app)
      .get("/api/articles/70650/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("Article not found");
      });
  });

  test("should return a 404 with 'No comments available' if there are no comments attached to the article", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("No comments available");
      });
  });
  test("should return a sorted list from oldest to newest", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).toBeSortedBy("created_at", { descending: true });
      });
  });
});
