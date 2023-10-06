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

describe("GET /api/articles", () => {
  test("should return code 200 on successful call", () => {
    return request(app).get("/api/articles").expect(200);
  });
  test("should return all objects in articles with the correct properties", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles.length).not.toBe(0);
        body.articles.forEach((article) => {
          expect(article).toHaveProperty("author");
          expect(typeof article.author).toBe("string");
          expect(article).toHaveProperty("title");
          expect(typeof article.title).toBe("string");
          expect(article).toHaveProperty("article_id");
          expect(typeof article.article_id).toBe("number");
          expect(article).toHaveProperty("topic");
          expect(typeof article.topic).toBe("string");
          expect(article).toHaveProperty("created_at");
          expect(typeof article.created_at).toBe("string");
          expect(article).toHaveProperty("votes");
          expect(typeof article.votes).toBe("number");
          expect(article).toHaveProperty("article_img_url");
          expect(typeof article.article_img_url).toBe("string");
          expect(article).toHaveProperty("comment_count");
          expect(typeof article.comment_count).toBe("string");
          expect(article).not.toHaveProperty("body");
        });
      });
  });
  test("should return the articles order by date descending", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy("created_at", { descending: true });
      });
  });
  test("should return only the articles that have the correct topics according to the query", () => {
    return request(app)
      .get("/api/articles?topic=mitch")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles.length).toBeGreaterThan(0);
        body.articles.forEach((article) => {
          expect(article.topic).toBe("mitch");
        });
      });
  });
  test("should return a 404 error if we're being passed a valid topic with no articles", () => {
    return request(app)
      .get("/api/articles?topic=paper")
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("No articles available with that topic");
      });
  });

  test("should return an error with code 400 if the topic does not exist", () => {
    return request(app)
      .get("/api/articles?topic=12345")
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("Topic does not exist");
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
        console.log(body.article);
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
  test("should also contain a comment_count value", () => {
    return request(app)
      .get("/api/articles/5")
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toHaveProperty("comment_count", "2");
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

describe("POST /api/articles/:article_id/comments ", () => {
  postComment = { username: "butter_bridge", body: "test comment" };
  test("should return code 201 with the added comment", () => {
    return request(app)
      .post("/api/articles/2/comments")
      .send(postComment)
      .expect(201)
      .then(({ body }) => {
        expect(body.comment.body).toEqual(postComment.body);
        expect(body.comment.author).toEqual(postComment.username);
        expect(body.comment.article_id).toBe(2);
        expect(body.comment).toHaveProperty("comment_id");
        expect(body.comment).toHaveProperty("votes");
        expect(body.comment).toHaveProperty("created_at");
      });
  });
  test('should return a 400 error with "Invalid format" if given the wrong properties', () => {
    return request(app)
      .post("/api/articles/2/comments")
      .send({ username: "butter_bridge" })
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("Invalid format");
      });
  });
  test("should return 404 error if article does not exits", () => {
    return request(app)
      .post("/api/articles/1256/comments")
      .send(postComment)
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("Article does not exist");
      });
  });
  test('should return a 400 error with "Invalid data type" if article id is not a number', () => {
    return request(app)
      .post("/api/articles/two/comments")
      .send(postComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("Invalid data type");
      });
  });
  test('should return a 404 error with "Username does not exist" if given an invalid username', () => {
    return request(app)
      .post("/api/articles/2/comments")
      .send({ username: "Veresio", body: "test comment" })
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("Username does not exist");
      });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  test("should return 201 with the updated article", () => {
    return request(app)
      .patch("/api/articles/8")
      .send({ inc_votes: 3 })
      .expect(201)
      .then(({ body }) => {
        expect(body.article.votes).toBe(3);
      });
  });
  test("should apply negative values correctly", () => {
    return request(app)
      .patch("/api/articles/8")
      .send({ inc_votes: -5 })
      .expect(201)
      .then(({ body }) => {
        expect(body.article.votes).toBe(-5);
      });
  });

  test("should return 404 if the article does not exist ", () => {
    return request(app)
      .patch("/api/articles/123454")
      .send({ inc_votes: 3 })
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("Article does not exist");
      });
  });
  test("should return 400 if inc_votes is not a number", () => {
    return request(app)
      .patch("/api/articles/8")
      .send({ inc_votes: "three" })
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("Invalid data type");
      });
  });
  test("should return 400 if inc_votes is not present", () => {
    return request(app)
      .patch("/api/articles/8")
      .send({ votes_up: 5 })
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("Invalid format");
      });
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  test("should return a 204 code with no content on successful delete", () => {
    return request(app).delete("/api/comments/6").expect(204);
  });
  test("should return 404 if the comment does not exist ", () => {
    return request(app)
      .delete("/api/comments/12576123")
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("Comment does not exist");
      });
  });
  test("should return 400 if the format of the id is wrong ", () => {
    return request(app)
      .delete("/api/comments/six")
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("Invalid data type");
      });
  });
});

describe("GET /api/users", () => {
  test("should return 200 code", () => {
    return request(app).get("/api/users").expect(200);
  });
  test('should return a list of users with a "username", "avatar_url and "name" value', () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        expect(body.users.length).toBeGreaterThan(0);
        body.users.forEach((user) => {
          expect(user).toHaveProperty("username");
          expect(typeof user.username).toBe("string");
          expect(user).toHaveProperty("name");
          expect(typeof user.name).toBe("string");
          expect(user).toHaveProperty("avatar_url");
          expect(typeof user.avatar_url).toBe("string");
        });
      });
  });
});
