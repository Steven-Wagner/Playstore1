const express = require('express');
const morgan = require('morgan')
const games = require('./playstore.js')

const app = express();

app.use(morgan('dev'))

app.get('/', (req, res) => {
    const {sort, genres} = req.query;

    let results = games

    if (genres) {
        if (['Action', 'Puzzle', 'Strategy', 'Casual', 'Arcade', 'Card'].includes(genres)) {
            results = games.filter(game => {
                return game['Genres'].includes(genres)
            })
        }
        else {
            return res.status(400).send('genres must be Action, Puzzle, Strategy, Casual, Arcade, or Card')
        }
    }

    if (sort) {
        if (['Rating', 'App'].includes(sort)) {
            results = results.sort((a, b) => {
                if (sort === 'App') {
                    a =a['App'].toLowerCase()
                    b = b['App'].toLowerCase()
                    return a < b ? -1 : a > b ? 1 : 0;
                }
                return a[sort] < b[sort] ? 1 : a[sort] > b[sort] ? -1 : 0;
            })
        }
        else {
            return res.status(400).send('must sort by Rating or App')
        }
    }

    res.json(results)
})

module.exports = app;