const request = require("supertest");
const app = require("../server/app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");

beforeEach(() => {
  return seed(testData);
});
afterAll(() => db.end());

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
});
