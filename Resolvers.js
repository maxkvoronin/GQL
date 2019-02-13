
const PostModel = require('./models/Post');

exports.resolvers = {
    Query:{
        getAllPosts: async () => {
            return PostModel.find();
        },
        getPost: async (parent, { id }, context, info) => {
            return PostModel.findOne().where({_id: id});
        }
    }
};