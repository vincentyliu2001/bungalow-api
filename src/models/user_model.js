import mongoose, { Schema } from 'mongoose';
// create a PostSchema with a title field
const UserSchema = new Schema({
  email: String,
  posts: [String],
  liked: [String],
  seen: [String],
  gid: String,
}, {
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
  timestamps: true,
});

// create UserModel class from schema
const UserModel = mongoose.model('User', UserSchema);

export default UserModel;
