import express from 'express';

const app = express();

// GET - info päring
// POST - saadab infot
// PUT - update
// DELETE - kustutamine

/**
 * 
 */
app.get('/api', (req,res) =>{
    // output APIdoc page
    res.end("Hello");
});

export default app;