const express = require('express');

const app = express();
const cors = require ('cors');

const wordsList = require('./filtered_words.json')

const wordSet = new Set(wordsList.words)
const wordsLength = wordSet.size;

const PORT = 3001;

app.use(cors({
    origin: '*',
    methods: 'GET'
  }));
app.use(express.json());


app.get('/api/getRandomWord', (_,res) => {
    let randomIndex = Math.floor(Math.random()*(wordsLength));
    let wordOfSession = Array.from(wordSet)[randomIndex];
    console.log(wordOfSession)
    res
        .status(200)
        .json(
        {
            'word': wordOfSession.toUpperCase()
        });
})

app.get('/api/checkValidity', (req,res) => {
    let guessedWord = req.query.guessedWord.toLowerCase();
    let responseBody = {
        'isValid': wordSet.has(guessedWord)
    }
    res
        .status(200)
        .json(responseBody);
})

app.listen(PORT, () => {
    console.log(`App running in port ${PORT}`);
})
