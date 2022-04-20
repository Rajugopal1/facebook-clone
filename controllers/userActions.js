const { check, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");

const User = require("../model/userModel");
const FriendRequest = require("../model/friendList");
const mongoose = require("mongoose");

module.exports = {
    async sendFriendRequest(req, res) {
        try {
            const user = await User.findById(req.params.id);
            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }
            if (req.user._id == req.params.id) {
                return res
                    .status(400)
                    .json({ error: "You cannot send friend request to yourself" });
            }

            if (user.friends.includes(req.user._id)) {
                console.log("aalal");
                return res.status(400).json({ error: "Already Friends" });
            }

            const friendRequest = await FriendRequest.findOne({
                sender: req.user._id,
                receiver: req.params.id,
            });

            if (friendRequest) {
                return res.status(400).json({ error: "Friend Request already send" });
            }

            const newFriendRequest = new FriendRequest({
                sender: req.user._id,
                receiver: req.params.id,
            });

            const save = await newFriendRequest.save();

            const friend = await FriendRequest.findById(save.id).populate("receiver");

            const chunkData = {
                id: friend.id,
                user: User(friend.receiver),
            };

            res
                .status(200)
                .json({ message: "Friend Request Sended", friend: chunkData });
        } catch (err) {
            console.log(err);
            return res.status(500).json({ error: "Something went wrong" });
        }
    },

    async acceptFriendRequest(req, res) {
        try {
            const friendsRequest = await FriendRequest.findById(req.params.id);
            if (!friendsRequest) {
                return res
                    .status(404)
                    .json({ error: "Request already accepted or not sended yet" });
            }
            if (friendsRequest.sender == req.user._id) {
                return res.status(404).json({ error: "Not Accessed" });
            }

            const sender = await User.findById(friendsRequest.sender);
            if (sender.friends.includes(friendsRequest.receiver)) {
                return res.status(400).json({ error: "already in your friend lists" });
            }
            sender.friends.push(req.user._id);
            await sender.save();
            const currentUser = await User.findById(req.user._id);
            if (currentUser.friends.includes(friendsRequest.sender)) {
                return res.status(400).json({ error: "already  friend " });
            }
            currentUser.friends.push(friendsRequest.sender);
            await currentUser.save();

            const chunkData = User(sender);

            await FriendRequest.deleteOne({ _id: req.params.id });
            res
                .status(200)
                .json({ message: "Friend Request Accepted", user: chunkData });
        } catch (err) {
            console.log(err);
            return res.status(500).json({ error: "Something went wrong" });
        }
    },

    async declineFriendRequest(req, res) {
        try {
            const friendsRequest = await FriendRequest.findById(
                req.params.id
            ).populate("sender");
            if (!friendsRequest) {
                return res
                    .status(404)
                    .json({ error: "Request already declined or not sended yet" });
            }
            await FriendRequest.deleteOne({ _id: req.params.id });

            res.status(200).json({ message: "Friend Request Declined" });
        } catch (err) {
            console.log(err);
            return res.status(500).json({ error: "Something went wrong" });
        }
    },

    async unfriend(req, res) {
        try {
            const user = await User.findById(req.user._id);
            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }
            if (!user.friends.includes(req.params.id)) {
                return res.status(404).json({ error: "User not in your friend list" });
            }
            user.friends = user.friends.filter((friend) => friend != req.params.id);
            await user.save();
            const friend = await User.findById(req.params.id);
            if (!friend) {
                return res.status(404).json({ error: "User not found" });
            }
            friend.friends = friend.friends.filter(
                (friend) => friend != req.user._id
            );
            await friend.save();
            res.status(200).json({ message: "Unfriended" });
        } catch (err) {
            console.log(err);
            return res.status(500).json({ error: "Something went wrong" });
        }
    },

    async getFriendList(req, res) {
        try {
            const user = await User.findById(req.user._id);
            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }
            const friends = await User.find({
                _id: { $in: user.friends },
            }).populate("friends");
            res.status(200).json({ friends });
        } catch (err) {
            console.log(err);
            return res.status(500).json({ error: "Something went wrong" });
        }
    },

    async getFriendRequest(req, res) {
        try {
            const user = await User.findById(req.user._id);
            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }
            const friendRequest = await FriendRequest.find({
                receiver: req.user._id,
            }).populate("sender");
            res.status(200).json({ friendRequest });
        } catch (err) {
            console.log(err);
            return res.status(500).json({ error: "Something went wrong" });
        }
    }
};
