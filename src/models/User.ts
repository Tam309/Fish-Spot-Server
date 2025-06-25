import mongoose, { Schema, Document} from "mongoose";

interface IUser extends Document {
    username: string;
    email: string;
    password: string;
    createdAt?: Date;
    avatar?: string;
    nick_name?: string;
    bio?: string;
    location?: string;
}

const UserSchema: Schema = new Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    avatar: { type: String, default: "" },
    nick_name: { type: String, default: "" },
    bio: { type: String, default: "" },
    location: { type: String, default: "" }
});

const User = mongoose.model<IUser>("User", UserSchema);
export default User;