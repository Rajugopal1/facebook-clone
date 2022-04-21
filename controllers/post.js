const User = require("../model/userModel");
const Post = require("../model/postModel");

module.exports = {
  async createPost(req, res) {
        const path = req.file.path.split("\\").slice(-1)[0];
    let { content, privacy, image, body } = req.body;

    if (!content && content.trim().length === 0 && !image) {
      return res.status(422).json({
        error:
          "Post Image or Write Some Content  to Post. Can`t upload empty post",
      });
    }
    try {
      const createPost = new Post({
        image: path,
        privacy,
        content,
        user: req.user._id,
        isProfilePost: false,
      });

      const savePost = await createPost.save();
      if (body) {
        if (Object.keys(body)?.length) {
          savePost.body = {
            feelings: body?.feelings,
            at: body?.at,
            date: body?.date,
            with: body?.with?.map((user) => user),
          };

          await savePost.save();
        }
      }

      const post = await Post.findById(savePost.id)
        .populate("user", "-password -__v -socketId")
        .populate({ path: "body.with", select: "_id name" });
      const postData = Post(post);

      res
        .status(201)
        .json({ message: "post created successfully", post: postData });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: "Something went wrong" });
    }
  },

  async getAllPosts(req, res) {
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


  async deletePost(req, res) {
    try {
      const post = await Post.findById(req.params.id);
      if (!post) {
        return res.status(404).json({ error: "Post not found" });
      }
      if (post.user.toString() !== req.user._id.toString()) {
        return res.status(401).json({ error: "You are not authorized" });
      }
      await post.remove();
      res.status(200).json({ message: "Post deleted successfully" });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: "Something went wrong" });
    }
  },
};
