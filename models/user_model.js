import mongoose, { Schema } from 'mongoose';
// create a PostSchema with a title field
const UserSchema = new Schema({
  email: String,
  posts: [{ sublet: { type: Schema.Types.ObjectId, ref: 'Sublet' }, status: String }],
  liked: [{ sublet: { type: Schema.Types.ObjectId, ref: 'Sublet' }, status: String }],
  seen: [{ sublet: { type: Schema.Types.ObjectId, ref: 'Sublet' }, status: String }],
  gid: String,
}, {
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
  timestamps: true,
});

// create UserModel class from schema
const UserModel = mongoose.model('User', UserSchema);

export default UserModel;
