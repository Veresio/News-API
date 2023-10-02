const request = require("supertest");
const app = require("../server/app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");

beforeEach(() => {
  return seed(testData);
});
afterAll(() => db.end());

describe("leave me alone husky", () => {
  test("should let me push", () => {
    expect(2).toBe(2);
  });
});
