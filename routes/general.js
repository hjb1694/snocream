const router = require('express').Router();
const fs = require('fs');
const path = require('path');

router.get('/', (req,res) => {

    res.render('index');

});

router.get('/menu', (req,res) => {

    res.render('menu');

});

router.get('/offers', (req,res) => {

    const offersPath = path.join(__dirname, '..', 'database', 'offers.json');

    const offersJSON = fs.readFileSync(offersPath);

    const offersObj = JSON.parse(offersJSON);

    res.render('offers', {
        offers : offersObj
    });

});



module.exports = router;