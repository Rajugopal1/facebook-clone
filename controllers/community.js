const User = require("../model/userModel");
const Post = require("../model/postModel");

module.exports = {

  async getFeed(req, res) {
    let page = parseInt(req.query.page || 0);
    let limit = 5;
    const userID = req.user._id;

    try {
      const posts = await Post.find()
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(page * limit)
        .populate("user",'_id userName')
        .populate({ path: "body.with" });

        

      let postsData = [];



    //   posts.map((post) => Post(post));

    for await (let post of posts) {
        switch (post.privacy) {
            case "Public":
                postsData.push(Post(post));
                break;
            case "OnlyMe":
                if (post.user._id.toString() === userID.toString()) {
                    postsData.push(Post(post));
                }
                break;

            case "Friends":
                if (post.user._id.toString() === userID.toString()) {
                    postsData.push(Post(post));
                } else {
                    const user = await User.findById(userID);
                    if (user.friends.includes(post.user._id.toString())) {
                        postsData.push(Post(post));
                    }
                }
                break;
        }
    }

      const totalCount = await Post.estimatedDocumentCount().exec();
      const paginationData = {
        currentPage: page,
        totalPage: Math.ceil(totalCount / limit),
        totalPost: totalCount,
      };
      res.status(200).json({ posts: postsData, pagination: paginationData });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: "Something went wrong" });
    }
  },


 
};
