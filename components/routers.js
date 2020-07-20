require('dotenv').config()
const router = require('express').Router()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const db = require('./models.js')
const cloudinary = require('../config/cloudinaryConfig.js')
const multer = require('../config/multer.js')
const cloudinaryConfig = cloudinary.cloudinaryConfig
const uploader = cloudinary.uploader
const multerUploads = multer.multerUploads
const dataUri = multer.dataUri

router.use('/projects', authenticate)

// Register & Login

router.post('/register', (req, res) => {
    const userInfo = req.body
    const hash = bcrypt.hashSync(userInfo.password, 8)
    userInfo.password = hash

    db.add("user", userInfo)
        .then(user => {
            const token = generateToken(user)
            res.status(201).json({token})
        })
        .catch(({message}) => {
            res.status(500).json({message})
        })
})

router.post('/login', (req, res) => {
    const { username, password } = req.body

    db.findBy("user", { username })
        .then(user => {
            if(user && bcrypt.compareSync(password, user.password)){
                const token = generateToken(user)
                res.status(200).json({token})
            }else {
                res.status(401).json({message: "Invalid credentials"})
            }
        })
        .catch(({message}) => {
            res.status(500).json({message})
        })
})

// Projects

router.get('/projects', (req, res) => {
    db.find("projects")
        .then(projects => {
            res.status(200).json({projects})
        })
        .catch(({message}) => {
            res.status(500).json({message})
        })
})

router.post('/projects', (req, res) => {
    const project = req.body

    db.add("projects", project)
        .then(project => {
            res.status(201).json({project})
        })
        .catch(({message}) => {
            res.status(500).json({message})
        })
})

router.post('/projects/:id/images', multerUploads.single('image-raw'), cloudinaryConfig, (req, res) => {
    const { id } = req.params
    const file = dataUri(req)

    uploader.upload(file.content, 
        { dpr: "auto", responsive: true, width: "auto", crop: "scale"}, 
        (error, result) => {
            db.update("projects", id, {image: result.secure_url})
                .then(project => {
                    res.status(200).json({project})
                })
                .catch(({message}) => {
                    res.status(500).json({message})
                })
        })
})

router.put('/projects/:id', (req, res) => {
    const { id } = req.params

    db.update("projects", id, req.body)
        .then(updated => {
            res.status(200).json({updated})
        })
        .catch(({message}) => {
            res.status(500).json({message})
        })
})

router.delete('/projects/:id', (req, res) => {
    const { id } = req.params

    db.remove("projects", id)
        .then(deleted => {
            console.log(deleted)
            if(deleted){
                res.status(200).json({message: "Successfully deleted project"})
            }else{
                res.status(400).json({message: "Error deleting project"})
            }
        })
        .catch(({message}) => {
            res.status(500).json({message})
        })
})

// Emails 

router.post('/emails', (req, res) => {
    db.add("emails", req.body)
        .then(email => {
            res.status(201).json({message: "Email successfully sent", email})
        })
        .catch(({message}) => {
            res.status(500).json({message})
        })
})



// Generate Token

function generateToken(user){
    const payload = {
        subject: user.id,
        username: user.username
    }

    const options = {
        expiresIn: '1 day'
    }

    return jwt.sign(payload, process.env.JWTSECRET, options)
}

// Decode Token

function authenticate(req, res, next){
    const token = req.headers.authorization

    if(res.locals.decodedJWT){
        next()
    }else if(token){
        jwt.verify(token, process.env.JWTSECRET, (err, decodedJWT) => {
            if(err) {
                res.status(404).json({errorMessage: `You shall not pass`})
            }else{
                res.locals.decodedJWT = decodedJWT
                next()
            }
        }) 
    }else{
        res.status(401).json({ you: "can't touch that." });
    }
}

module.exports = router