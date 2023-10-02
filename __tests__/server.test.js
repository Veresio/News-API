const request = require("supertest");
const app = require("../server/app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");

beforeEach(() => {
  return seed(testData);
});
afterAll(() => db.end());

describe("General Errors", () => {
  test("should return a 404 for an invalid address", () => {
    return request(app).get("/topics").expect(404);
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
  xtest("should return a 200 code on succesful call", () => {
    return request(app).get("/api/articles/4").expect(200);
  });
  xtest("should return the correct article based on the id provided", () => {
    return request(app)
      .get("/api/articles/4")
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toBe();
      });
  });
});
