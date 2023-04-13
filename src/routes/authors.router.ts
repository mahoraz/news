import express from 'express';
import defaultDataSource from '../datasource';
import { Author } from '../entities/Author';
import { Article } from '../entities/Article';

const router = express.Router();

interface CreateAuthorParams {
    firstName: string;
    lastName: string;
    title: string;
}

interface UpdateAuthorParams {
    firstName?: string;
    lastName?: string;
    title?: string;
}
  
// GET - info päring (kõik artiklid)
router.get("/", async (req, res) => {
    try {
      // küsi artiklid andmebaasist
      const Authors = await defaultDataSource.getRepository(Author).find();
  
      // vasta artiklite kogumikuga JSON formaadis
      return res.status(200).json({ data: Authors });
    } catch (error) {
      console.log("ERROR", { message: error });
  
      // vasta süsteemi veaga kui andmebaasipäringu jooksul ootamatu viga tekib
      return res.status(500).json({ message: "Could not fetch Authors" });
    }
});
  
  
// POST - saadab infot
router.post("/", async (req, res) => {
try {
    const { title, firstName, lastName } = req.body as CreateAuthorParams;

    // TODO: validate & santize
    if (!title || !firstName || !lastName) {
    return res
        .status(400)
        .json({ error: "Authors has to have first name, last name and title" });
    }


    // create new Author with given parameters
    const author = Author.create({
    title: title.trim() ?? "",
    firstName: firstName.trim() ?? "",
    lastName: lastName.trim() ?? "",
    // author: author,
    });

    //save Author to database
    const result = await author.save();

    return res.status(200).json({ data: result });
} catch (error) {
    console.log("ERROR", { message: error });

    // vasta süsteemi veaga kui andmebaasipäringu jooksul ootamatu viga tekib
    return res.status(500).json({ message: "Could not fetch Authors" });
}
});

// GET - info päring (üksik artikkel)
router.get("/:id", async (req, res) => {
try {
    const { id } = req.params;

    // tavaline ORM päring koos "relation" entity sisuga
    const author = await defaultDataSource
    .getRepository(Author)
    .findOne({ where:{id: parseInt(id)}, relations: ['articles'] });

    // Querybuildering tehtud samalaadne päring (leftjoin tüttu hetkel ainult 1)
    // const authorArticles = await defaultDataSource.createQueryBuilder()
    // .select("*")
    // .from("author", "author")
    // .leftJoin("article", "articles", "articles.authorId = author.id")
    // .where("author.id = :id", {id: id})
    // .getRawOne();
    
    // return res.status(200).json({ data: {
    //     id:authorArticles.id,
    //     firstName:authorArticles.firstName,
    //     lastName:authorArticles.lastName,
    //     article: {
    //         title: authorArticles.title,
    //         body: authorArticles.body,
    //     }
    //  }});

    return res.status(200).json({ data: author });
} catch (error) {
    console.log("ERROR", { message: error });

    // vasta süsteemi veaga kui andmebaasipäringu jooksul ootamatu viga tekib
    return res.status(500).json({ message: "Could not fetch Authors" });
}
});

// PUT - update
router.put("/:id", async (req, res) => {
try {
    const { id } = req.params;
    const { title, firstName, lastName } = req.body as UpdateAuthorParams;

    const author = await defaultDataSource
    .getRepository(Author)
    .findOneBy({ id: parseInt(id) });

    if (!author) {
    return res.status(404).json({ error: "Author not found" });
    }

    // uuendame andmed objektis (lokaalne muudatus)
    author.title = title ? title : author.title;
    author.firstName = firstName ? firstName : author.firstName;
    author.lastName = lastName ? lastName : author.lastName;

    //salvestame muudatused andmebaasi 
    const result = await author.save();

    // saadame vastu uuendatud andmed (kui midagi töödeldakse serveris on seda vaja kuvada)
    return res.status(200).json({ data: result });
} catch (error) {
    console.log("ERROR", { message: error });

    // vasta süsteemi veaga kui andmebaasipäringu jooksul ootamatu viga tekib
    return res.status(500).json({ message: "Could not update Authors" });
}
});

// DELETE - kustutamine
router.delete("/:id", async(req, res) => {
    try {
        const { id } = req.params;
        const { title, body } = req.body;
    
        const author = await defaultDataSource
        .getRepository(Author)
        .findOneBy({ id: parseInt(id) });
    
        if (!author) {
        return res.status(404).json({ error: "Author not found" });
        }

        const result = await author.remove();
        
        // tagastame igaks juhuks kustutatud andmed
        return res.status(200).json({ data: result });
    } catch (error) {
        console.log("ERROR", { message: error });
    
        // vasta süsteemi veaga kui andmebaasipäringu jooksul ootamatu viga tekib
        return res.status(500).json({ message: "Could not update Authors" });
    }
});

export default router;