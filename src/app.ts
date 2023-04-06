import express from "express";
import dataSource from "./datasource";
import { Article } from "./entities/Article";

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
app.get("/api/articles", async (req, res) => {
  try {
    // küsi artiklid andmebaasist
    const articles = await dataSource.getRepository(Article).find();

    // vasta artiklite kogumikuga JSON formaadis
    return res.status(200).json({ data: articles });
  } catch (error) {
    console.log("ERROR", { message: error });

    // vasta süsteemi veaga kui andmebaasipäringu jooksul ootamatu viga tekib
    return res.status(500).json({ message: "Could not fetch articles" });
  }
});

// POST - saadab infot
app.post("/api/articles", async (req, res) => {
  try {
    const { title, body } = req.body;

    // TODO: validate & santize
    if (!title || !body) {
      return res
        .status(400)
        .json({ error: "Articles has to have title and body" });
    }

    // create new article with given parameters
    const article = Article.create({
      title: title.trim() ?? "",
      body: body.trim() ?? "",
    });

    //save article to database
    const result = await article.save();

    return res.status(200).json({ data: result });
  } catch (error) {
    console.log("ERROR", { message: error });

    // vasta süsteemi veaga kui andmebaasipäringu jooksul ootamatu viga tekib
    return res.status(500).json({ message: "Could not fetch articles" });
  }
});

// GET - info päring (üksik artikkel)
app.get("/api/articles/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const article = await dataSource
      .getRepository(Article)
      .findOneBy({ id: parseInt(id) });

    return res.status(200).json({ data: article });
  } catch (error) {
    console.log("ERROR", { message: error });

    // vasta süsteemi veaga kui andmebaasipäringu jooksul ootamatu viga tekib
    return res.status(500).json({ message: "Could not fetch articles" });
  }
});

// PUT - update
app.put("/api/articles/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, body } = req.body;

    const article = await dataSource
      .getRepository(Article)
      .findOneBy({ id: parseInt(id) });

    if (!article) {
      return res.status(404).json({ error: "Article not found" });
    }

    // uuendame andmed objektis (lokaalne muudatus)
    article.title = title ? title : article.title;
    article.body = body ? body : article.body;
    //salvestame muudatused andmebaasi 
    const result = await article.save();

    // saadame vastu uuendatud andmed (kui midagi töödeldakse serveris on seda vaja kuvada)
    return res.status(200).json({ data: result });
  } catch (error) {
    console.log("ERROR", { message: error });

    // vasta süsteemi veaga kui andmebaasipäringu jooksul ootamatu viga tekib
    return res.status(500).json({ message: "Could not update articles" });
  }
});

// DELETE - kustutamine
app.delete("/api/articles/:id", async(req, res) => {
    try {
        const { id } = req.params;
        const { title, body } = req.body;
    
        const article = await dataSource
          .getRepository(Article)
          .findOneBy({ id: parseInt(id) });
    
        if (!article) {
          return res.status(404).json({ error: "Article not found" });
        }

        const result = await article.remove();
        
        // tagastame igaks juhuks kustutatud andmed
        return res.status(200).json({ data: result });
      } catch (error) {
        console.log("ERROR", { message: error });
    
        // vasta süsteemi veaga kui andmebaasipäringu jooksul ootamatu viga tekib
        return res.status(500).json({ message: "Could not update articles" });
      }
});

export default app;
