const express = require('express')
const router = express.Router()
const Posts = require('./posts-model')

router.get('/', async (req, res) => {
    try {
         const data = await Posts.find()
         res.status(200).json(data)
    }
    catch {
        res.status(500).json({
            message: "The posts information could not be retrieved"
        })
    }
})

router.get('/:id', (req, res) => {
    Posts.findById(req.params.id)
    .then((post) => {
        post ? res.status(200).json(post)
        :
        res.status(404).json({
                message: "The post with the specified ID does not exist"
            })
        }
    )
    .catch(() => {
        res.status(500).json({
            message: "The post information could not be retrieved"
        })
    })
})

router.post('/', (req, res) => {
    const newPost = req.body
    !newPost.title || !newPost.contents ?
        res.status(400).json({
            message: "Please provide title and contents for the post"
        })
    :
        Posts.insert(newPost)
        .then((post) => {
            res.status(201).json(post)
        })
        .catch(() => {
            res.status(500).json({
                message: "There was an error while saving the post to the database"
            })
        })  
    }  
)

router.put('/:id', async (req, res) => {
    const postId = req.params.id
    const body = req.body
   try {
       const post = await Posts.findById(postId)
        if(!post) {
            res.status(404).json({
                message: "The post with the specified ID does not exist"
            })
        } else if (!body.title || !body.contents) {
            res.status(400).json({
                message: "Please provide title and contents for the post"
            })
        } else {
            const newPost = await Posts.update(postId, body)
            res.status(201).json(newPost)
        }
   } catch {
       res.status(500).json({
            message: "The post information could not be modified"
       })
   }
})

router.delete('/:id', (req, res) => {
    const postId = req.params.id
    Posts.remove(postId)
        .then((post) => {
            post ? res.status(200).json(post) :
            res.status(404).json({
                message: "The post with the specified ID does not exist"
            })
        })
        .catch(() => {
            res.status(500).json({
                message: "The post could not be removed"
            })
        })
})


module.exports = router 