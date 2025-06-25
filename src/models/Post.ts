import mongoose, { Schema, Document} from "mongoose";

interface IComment {
    _id: mongoose.Types.ObjectId;
    user_id: mongoose.Types.ObjectId,
    post_id: mongoose.Types.ObjectId,
    content: string,
    createdAt?: Date
}

interface IPost extends Document {
    user_id: mongoose.Types.ObjectId,
    spot_name: string,
    location: string,
    description: string,
    fish_type: string,
    image: string,
    comments?: IComment[]
    createdAt?: Date;
    updatedAt?: Date;
}

const PostSchema: Schema = new Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    spot_name: { type: String, required: true },
    location: { type: String, required: true },
    description: { type: String, required: true },
    fish_type: { type: String, required: true },
    image: { type: String, default: "" },
    comments: [{
        _id: { type: mongoose.Types.ObjectId, default: () => new mongoose.Types.ObjectId() },
        user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        post_id: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true },
        content: { type: String, required: true },
        createdAt: { type: Date, default: Date.now }
    }]
},
{ timestamps: true }
);

const Post = mongoose.model<IPost>("Post", PostSchema);
export default Post;