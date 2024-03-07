import PostModel from "../models/Post.js";

export const getLastTags = async (req, res) => {
    try{
        const posts = await PostModel.find().limit(6).exec();

        const tags = posts.map((obj) => obj.tags).flat().slice(0, 6)

        res.json(tags)
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Could not get posts'
        })
    }
}


export const getAll = async (req, res) => {
    try{
        const posts = await PostModel.find().populate('user').exec();
        res.json(posts)
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Could not get posts'
        })
    }
}

export const getOne = async (req, res) => {
    try{
        const postId = req.params.id;    
        const doc = await PostModel.findOneAndUpdate(
            { _id: postId },
            { $inc: { viewsCount: 1 } },
            { returnDocument: 'after' },
        );
            if (!doc) {
                return res.status(404).json({
                    message: 'Post is not found',
                })
            }

            res.json(doc);
        
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Could not get post'
        })
    }
}

export const remove = async (req, res) => {
    try{
        const postId = req.params.id; 
        const doc = await PostModel.findOneAndDelete( { _id: postId },);
        

        if (!doc) {
            return res.status(404).json({
                message: 'Post is not found',
            })
        }

        res.status(200).json({
            message: 'Post removed successfully',
        });


        
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Could not get post'
        })
    }
}

export const create = async (req, res) => {
    try {
        const  doc = new PostModel({
            title: req.body.title,
            text:  req.body.text,
            tags: req.body.tags,
            imageUrl: req.body.imageUrl,
            user: req.userId,
        });

        const post = await doc.save();

        res.json(post);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Could not created post'
        })
    }
}

export const update = async (req, res) => {
    try {
        const postId = req.params.id; 
        await PostModel.updateOne({ _id: postId }, {
            title: req.body.title,
            text:  req.body.text,
            tags: req.body.tags,
            imageUrl: req.body.imageUrl,
            user: req.userId,
        })

        res.json({
            success: true,
        })

    } catch (err) {
        console.log('Error updating post:', err);
        res.status(500).json({
            success: false,
            message: 'Could not update post'
        })
    }

}