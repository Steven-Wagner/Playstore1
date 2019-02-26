const request = require('supertest');
const expect = require('chai').expect;
const app = require('../index');

describe('app', () => {
    it('returns all results with no querys', () => {
        request(app)
            .get('/')
            .expect(200)
            .expect('Content-Type', /json/)
            .then(res => {
                expect(res.body).to.be.an('array').to.have.length.at.least(1)
                expect(res.body[0]).to.have.keys( 
                    "App",
                    "Category",
                    "Rating",
                    "Reviews",
                    "Size",
                    "Installs",
                    "Type",
                    "Price",
                    "Content Rating",
                    "Genres",
                    "Last Updated",
                    "Current Ver",
                    "Android Ver")
            })
    })
    it('returns are sorted by App', () => {
        return request(app)
            .get('/')
            .query({sort: 'App'})
            .expect(200)
            .expect('Content-Type', /json/)
            .then(res => {
                expect(res.body).to.be.an('array').to.have.length.at.least(1);
                let i = 0;
                let sorted = true;
                while (i < res.body.length-1 && sorted) {
                    if (res.body[i].App.toLowerCase() > res.body[i+1].App.toLowerCase()) {
                        sorted = false
                    }
                    i++
                }
                expect(sorted).to.be.true;
            })
    })
    it('returns are sorted by Rating', () => {
        return request(app)
            .get('/')
            .query({sort: 'Rating'})
            .expect(200)
            .expect('Content-Type', /json/)
            .then(res => {
                expect(res.body).to.be.an('array').to.have.length.at.least(1);
                let i = 0;
                let sorted = true;
                while (i < res.body.length-1 && sorted) {
                    if (res.body[i].Rating < res.body[i+1].Rating) {
                        sorted = false
                    }
                    i++
                }
                expect(sorted).to.be.true;
            })
    })
    it('returns error if sort is invalid query', () => {
        return request(app)
            .get('/')
            .query({sort: 'Wrong'})
            .expect(400)
            .expect(400, 'must sort by Rating or App')
    })
    it('returns error if genres is invalid query', () => {
        return request(app)
            .get('/')
            .query({genres: 'Wrong'})
            .expect(400)
            .expect(400, 'genres must be Action, Puzzle, Strategy, Casual, Arcade, or Card')
    })
    it('returns of a specific genre are sorted by Rating', () => {
        return request(app)
            .get('/')
            .query({sort: 'Rating', genres: 'Action'})
            .expect(200)
            .expect('Content-Type', /json/)
            .then(res => {
                expect(res.body).to.be.an('array').to.have.length.at.least(1);
                let i = 0;
                let sorted = true;
                while (i < res.body.length-1 && sorted) {
                    if (res.body[i].Rating < res.body[i+1].Rating) {
                        sorted = false
                    }
                    i++
                }
                expect(sorted).to.be.true;
            })
    })
    it('returns of a specific genre are sorted by App', () => {
        return request(app)
            .get('/')
            .query({sort: 'App', genres: 'Action'})
            .expect(200)
            .expect('Content-Type', /json/)
            .then(res => {
                expect(res.body).to.be.an('array').to.have.length.at.least(1);
                let i = 0;
                let sorted = true;
                while (i < res.body.length-1 && sorted) {
                    if (res.body[i].App.toLowerCase() > res.body[i+1].App.toLowerCase()) {
                        sorted = false
                    }
                    i++
                }
                expect(sorted).to.be.true;
            })
    })
    it('all games should be genres: Action', () => {
        return request(app)
            .get('/')
            .query({genres: 'Action'})
            .expect(200)
            .expect('Content-Type', /json/)
            .then(res => {
                let isAction = true;
                let i = 0;
                while (isAction && i < res.body.length -1) {
                    if (!res.body[i]['Genres'].includes('Action')) {
                        isAction = false;
                    }
                    i++
                }
                expect(isAction).to.be.true;
            })
    })
})