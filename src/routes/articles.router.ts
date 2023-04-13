import express from 'express';
import { Author } from '../entities/Author';
import { Article } from '../entities/Article';
import defaultDataSource from '../datasource';

const router = express.Router();

interface CreateArticleParams {
    title: string;
    body: string;
    authorId: number;
}

interface UpdateArticleParams {
    title?: string;
    body?: string;
    authorId?: number;
}
  
// GET - info päring (kõik artiklid)
router.get("/", async (req, res) => {
    try {
      // küsi artiklid andmebaasist
      const articles = await defaultDataSource.getRepository(Article).find();
  
      // vasta artiklite kogumikuga JSON formaadis
      return res.status(200).json({ data: articles });
    } catch (error) {
      console.log("ERROR", { message: error });
  
      // vasta süsteemi veaga kui andmebaasipäringu jooksul ootamatu viga tekib
      return res.status(500).json({ message: "Could not fetch articles" });
    }
});
  
  
// POST - saadab infot
router.post("/", async (req, res) => {
try {
    const { title, body, authorId } = req.body as CreateArticleParams;

    // TODO: validate & santize
    if (!title || !body) {
    return res
        .status(400)
        .json({ error: "Articles has to have title and body" });
    }

    // NOTE: võib tekkida probleeme kui ID väljale kaasa anda "undefined" väärtus
    // otsime üles autori kellel artikkel kuulub 
    const author = await Author.findOneBy({id: authorId});

    if(!author){
    return res.status(400).json({ message: "Author with given ID not found" });
    }

    // create new article with given parameters
    const article = Article.create({
    title: title.trim() ?? "",
    body: body.trim() ?? "",
    authorId: author.id,
    // author: author,
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
router.get("/:id", async (req, res) => {
try {
    const { id } = req.params;

    const article = await defaultDataSource
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
router.put("/:id", async (req, res) => {
try {
    const { id } = req.params;
    const { title, body, authorId } = req.body as UpdateArticleParams;

    const article = await defaultDataSource
    .getRepository(Article)
    .findOneBy({ id: parseInt(id) });

    if (!article) {
    return res.status(404).json({ error: "Article not found" });
    }


    // uuendame andmed objektis (lokaalne muudatus)
    article.title = title ? title : article.title;
    article.body = body ? body : article.body;

    // otsime üles autori kellel artikkel kuulub
    if(authorId){
    const author = await Author.findOneBy({id: authorId});
    if(!author){
        return res.status(400).json({ message: "Author with given ID not found" });
    }
    article.authorId = author.id;
    }
    
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
router.delete("/:id", async(req, res) => {
    try {
        const { id } = req.params;
        const { title, body } = req.body;
    
        const article = await defaultDataSource
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

export default router;