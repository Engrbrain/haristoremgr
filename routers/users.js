// INSTALL JSONWEBTOKEN WHEN YOU HAVE INTERNET

const {User} = require('../models/user');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

router.get(`/`, async (req, res) =>{
    const userList = await User.find().select('-passwordHash');

    if(!userList) {
        res.status(500).json({success: false})
    } 
    res.send(userList);
})



router.get(`/:id`, async (req, res) => {
    const user = await User.findById(req.params.id).select('-passwordHash');

    if(!user) {
        res.status(500).json({success:false})
    }
    res.send(user);
});

router.post(`/`, async (req, res) => {
    const secret = process.env.BCRYPTSECRET;
    let user = new User({
        name: req.body.name,
        email: req.body.email,
        passwordHash: bcrypt.harshSync(req.body.password, secret),
        phone: req.body.phone,
        isAdmin: req.body.isAdmin,
        street: req.body.street,
        apartment: req.body.apartment,
        zip: req.body.zip,
        city: req.body.city,
        country: req.body.country
    });
    user = await user.save();
    if (!user)
    return res.status(500).send('The user cannot be created');

    res.status(200).send(user);
});

router.put('/:id', async (req, res)=> {
    if(!mongoose.isValidObjectId(req.params.id)) {
        res.status(400).send('Invalid User Id');
    }

    const user = await User.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
        email: req.body.email,
        passwordHash: bcrypt.harshSync(req.body.password, '0816351517712345677654321%%'),
        phone: req.body.phone,
        isAdmin: req.body.isAdmin,
        street: req.body.street,
        apartment: req.body.apartment,
        zip: req.body.zip,
        city: req.body.city,
        country: req.body.country

        },
        {new: true}
    )
    if(!user)
    return res.status(404).send('The User cannot be updated!')

    res.send(category);
});

router.delete('/:id', (req, res) => {
    if(!mongoose.isValidObjectId(req.params.id)) {
        res.status(400).send('Invalid User Id');
    }
    User.findByIdAndRemove(req.params.id).then(
        user =>{
            if(user) {
                return res.status(200).json({
                    success: true,
                    message: 'The User is deleted!'
                })
            } else {
                return res.status(404).json({
                    success: false,
                    message: 'The User was not found!'
                })
            }
        }).catch(err=> {
            return res.status(400).json({
                success: false,
                error: err
            })
        });

});

router.post('/login', async (req, res) => {
    const secret = process.env.JWTSECRET
    const user = await User.findOne({email: req.body.email});
    if(!user) {
        return res.status(400).send('The User is not found');
    }

    if(user && bcrypt.compareSync(req.body.password, req.passwordHash)) {
        const token = jwt.sign(
            {
                userid: user.id,
                isAdmin: user.isAdmin,
                isRevoked: isRevoked
            },
            secret,
            {expiresIn: '1d'}
            )
        res.status(200).send({user: user.email, token: token})
    } else {
        res.status(400).send('password is wrong');
    }
});

router.post(`/register`, async (req, res) => {
    const secret = process.env.BCRYPTSECRET;
    let user = new User({
        name: req.body.name,
        email: req.body.email,
        passwordHash: bcrypt.harshSync(req.body.password, secret),
        phone: req.body.phone,
        isAdmin: req.body.isAdmin,
        street: req.body.street,
        apartment: req.body.apartment,
        zip: req.body.zip,
        city: req.body.city,
        country: req.body.country
    });
    user = await user.save();
    if (!user)
    return res.status(500).send('The user cannot be created');

    res.status(200).send(user);
});

async function isRevoked(req, payload, done){
    if(!payload.isAdmin){
        done(null, true)
    }
    done();
}

router.get(`/get/count`, async (req, res) => {
    const userCount = await User.countDocuments((count) => count)

    if(!userCount) {
        res.status(500).json({success:false})
    }
    res.send({
        userCount: userCount
    });
});
module.exports =router;