import express from "express";
import articlesRouter from "./routes/articles.router";
import authorRouter from "./routes/authors.router";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 *
 */
app.get("/api", (req, res) => {
  // output APIdoc page
  res.end("Hello");
});

// GET - info päring (kõik artiklid)
app.use("/api/articles",articlesRouter );
app.use("/api/authors",authorRouter );

export default app;
