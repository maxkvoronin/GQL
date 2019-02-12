const CommentModel = require('../models/Comment');
const PostModel = require('../models/Post');

const path = require('path');
const fs = require('fs');
const unlink = require('util').promisify(fs.unlink);
const postsCfg = require('../configs/posts.config');

module.exports.createPost = async (req, res, next) => {
  try {
    const post = {};
      if (req.body.text) {
        post.text = req.body.text;
      }
      if (req.uploadfilename) {
        post.picture = req.uploadfilename;
      }

      post.author = req.user._id;

      await PostModel.create(post);
      res.status(201).json({ success: true, message: 'post created' });

  } catch(err) {
    next(err);
  }

};

module.exports.findOnePost = async (req, res, next) => {
  try {
    const post = await PostModel.findOne().where({ _id: req.params.postId });

    if (!post) {
      res.status(404).json({ success: false, message: 'unknown id' });
    } else {
      res.json(post);
    }

  } catch (err) {
    next(err);
  }
};

module.exports.findPosts = async (req, res, next) => {
  try {
    //const resObj = {};
    const posts = await this.getPosts(req.user._id, req.query.page, req.query.query);
    //resObj.isEnd = (await PostModel.countDocuments(
    // {text: new RegExp(req.query.query, 'g')}) <= ( postsCfg.postsPerPage * req.query.page ) );

    res.json(...posts);
  } catch (err) {
    next(err);
  }
};

module.exports.editPost = async (req, res, next) => {
  try {
    const post = {};
    if (req.body.text) {
      post.text = req.body.text;
    }
    if (req.uploadfilename) {
      post.picture = req.uploadfilename;
    }

    post.author = req.user._id;

    const result = await PostModel.where({ _id: req.params.postId }).updateOne(post).exec();

    if (req.uploadfilename) {
      await PostModel.deletePicture(req.params.postId);
    }

    if (result.n === 0) {
      res.status(404).json({ success: false, message: 'unknown id' });
    } else {
      res.status(201).json({ success: true, message: 'post updated' });
    }

  } catch (err) {
    next(err);
  }
};

module.exports.deletePost = async (req, res, next) => {
  try {
    await this.deletePicture(req.params.postId);
    await PostModel.deleteOne().where({ _id: req.params.postId}).exec();
  //todo delete likes
    await CommentModel.deleteMany().where({ post: req.params.postId }).exec();

    res.status(204).json({ success: true });

  } catch (err) {
    next(err);
  }
};

module.exports.deletePicture = function (postId) {
  return PostModel.findOne()
      .where({ _id: postId })
      .then((post) => {
        if (post.picture) {
          unlink(path.join('public', post.picture));
        }
      });
};

module.exports.getPosts = function (authUserId, page, searchTxt = '') {
  return PostModel.aggregate([
    { $match: {
        text: { $regex: new RegExp(searchTxt) } } },
    { $sort: {
        _id: -1} },
    { $facet : {
        meta: [
          { $count: "totalDocs" },
        ],
        posts: [
          { $skip: (page - 1) * postsCfg.postsPerPage },
          { $limit: postsCfg.postsPerPage },
          { $lookup: {
              "from": "users",
              "localField": "author",
              "foreignField": "_id",
              "as": "author" } },
          { $unwind: "$author"},
          { $lookup: {
              "from": "likes",
              "localField": "_id",
              "foreignField": "post",
              "as": "like" } },
          { $project: {
              "author._id": "$author._id",
              "author.firstName": "$author.firstName",
              "author.lastName":  "$author.lastName",
              "author.avatarUrl": "$author.avatarUrl",
              _id: 1,
              text: 1,
              picture: 1,
              publicationDate: 1,
              numberOfLikes: { $size: "$like" },
              isLiked:  { $in: [authUserId, "$like.author"]},
              editable: { $eq: [authUserId, "$author._id"]}, }
          },
        ]
      } },
    { $project: {
        isEnd: { $lte: [{$arrayElemAt: [ "$meta.totalDocs", 0 ]}, postsCfg.postsPerPage * page ]},
        posts: 1
      } }
  ]);
};