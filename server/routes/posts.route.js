const express = require('express');
const multer = require('multer');

const Post = require('../models/posts.models');

const router = express.Router();

const MYME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpeg',
  'image/jpg': 'jpg'
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MYME_TYPE_MAP[file.mimetype];
    let error = new Error('Invalid mime type');
    if (isValid) {
      error = null;
    }
    const path = '/home/acnologia/Documentos/Web/ANGULAR/AngularUdemy/mean/server/images';
    cb(error, path);
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLocaleLowerCase().split(' ').join('-');
    const ext = MYME_TYPE_MAP[file.mimetype];
    cb(null, name + '-' + Date.now() + '.' + ext);
  }
});

router.post('', multer({ storage: storage }).single('image'), (req, res, next) => {
  const url = req.protocol + '://' + req.get('host'); //obtengo url para imagen, protocol me da si accedo con http(s) R= https://localhost
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + '/images/' + req.file.filename //http(s)://localhost/images/nameimg
  });
  post.save()
    .then((result) => {
      res.status(201).json({
        message: 'Post agregado',
        post: {
          ...result,
          id: result._id,
          /*title: result.title,
          content: result.content,
          imagePath: result.imagePath*/
        }
      });
    });
});

router.put('/:id', multer({ storage: storage }).single('image'), (req, res, next) => {
  let imagePath = req.body.imagePath;
  if (req.file) {
    const url = req.protocol + '://' + req.get('host'); //obtengo url para imagen, protocol me da si accedo con http(s) R= https://localhost
    imagePath = url + '/images/' + req.file.filename //http(s)://localhost/images/nameimg
  }
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath
  });
  console.log(post);
  Post.updateOne({ _id: req.body.id }, post)
    .then(result => {
      res.status(200).json({ message: 'update succcess!' });
    });
});

router.get('', (req, res, next) => {
  const pageSize = +req.query.pagesize; // '+' comvierte a number el parametro
  const currentPage = +req.query.page;  //como obtenemos datos de la url viene en string
  const postQuery = Post.find();
  let postsFetched;
  if (pageSize && currentPage) {
    postQuery
      .skip(pageSize * (currentPage - 1))
      .limit(pageSize);
  }
  postQuery.then((posts) => {
    postsFetched = posts;
    return Post.count();
  })
    .then(count => {
      res.status(200).json({
        message: "Posts fetched successfully",
        posts: postsFetched,
        maxPosts: count
      });
    })
});

router.get('/:id', (req, res, next) => {
  Post.findById(req.params.id)
    .then(post => {
      if (post) {
        res.status(200).json(post);
      } else {
        res.status(200).json({ message: 'Post not found!' });
      }
    })
});

router.delete('/:id', (req, res, next) => {
  Post.deleteOne({ _id: req.params.id })
    .then((result) => {
      console.log(result);
      res.status(200).json({ message: 'Post deleted!' });
    });
});

module.exports = router;