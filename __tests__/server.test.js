const request = require("supertest");
const app = require("../server/app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");
const apiJSON = require("../endpoints.json");

beforeEach(() => {
  return seed(testData);
});
afterAll(() => db.end());

describe("General Errors", () => {
  test("should return a 404 for an invalid address", () => {
    return request(app).get("/api/bananas").expect(404);
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
