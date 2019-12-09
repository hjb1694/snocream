const router = require('express').Router();
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');
const uuid = require('uuid/v4');
const isAuth = require('../middleware/isAuth');

router.get('/', isAuth, (req,res) => {

    res.render('adminpanel');

});


router.get('/login', (req,res) => {

    res.render('login');

});

router.post('/login', async (req,res) => {


    const {username, password} = req.body;

    const userFilePath = path.join(__dirname, '..', 'database', 'users.json');

    const users = fs.readFileSync(userFilePath);
    const usersDecoded = JSON.parse(users);

    const userMatch = usersDecoded.find(item => item.username == username);

    if(!userMatch){

        return res.json({error : 'invalid credentials'});

    }

    const passMatched = bcrypt.compareSync(password, userMatch.password);

    if(!passMatched){

        return res.json({error : 'invalid credentials'});

    }

    req.session.isAuth = true;

    res.json({success : 'user authenticated'});

       


});


router.get('/logout', isAuth, (req,res) => {

    req.session.destroy();

    res.redirect('/');


});

router.get('/offers', isAuth, (req,res) => {

    const offersPath = path.join(__dirname, '..', 'database', 'offers.json');

    const offers = fs.readFileSync(offersPath);

    const offersParsed = JSON.parse(offers);

    res.render('offerspanel', {
        offers : offersParsed
    });


});

router.post('/offers', isAuth, (req,res) => {

    const {headline, description, expires} = req.body;

    const offersPath = path.join(__dirname, '..', 'database', 'offers.json');

    const offers = fs.readFileSync(offersPath);

    const offersParsed = JSON.parse(offers);

    const newItem = {
        id : uuid(),
        headline, 
        description, 
        expires
    }

    offersParsed.push(newItem);

    const offersString = JSON.stringify(offersParsed);

    fs.writeFileSync(offersPath, offersString);


    res.redirect('/admin/offers');


});

router.post('/offers/delete', isAuth, (req,res) => {

    const {offerId} = req.body;

    const offersPath = path.join(__dirname, '..', 'database', 'offers.json');

    const offers = fs.readFileSync(offersPath);

    const offersDecoded = JSON.parse(offers);

    const offerToDelete = offersDecoded.findIndex(offer => offer.id === offerId);

    console.log(offerToDelete);

    offersDecoded.splice(offerToDelete, 1);

    const offersEncoded = JSON.stringify(offersDecoded);

    fs.writeFileSync(offersPath, offersEncoded);

    res.redirect('/admin/offers');

});



module.exports = router;