import mongoose, { Schema } from 'mongoose';

const FilterSchema = new Schema({
  sqft: Number,
  price: Number,
  bedroom: Number,
  coordinates: Number,
  amenities: Number,
  Hospital: Number,
  Range: Number,
},
{
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
  timestamps: true,
});
// create a PostSchema with a title field
const UserSchema = new Schema({
  email: String,
  posts: [String],
  liked: [String],
  seen: [String],
  preferences: {
    minPrice: Number,
    maxPrice: Number,
    footage: Number,
    bedroom: Number,
    bathroom: Number,
    latitude: Number,
    longitude: Number,
    range: Number,
  },
  gid: String,
  filters: FilterSchema,
},
{
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
  timestamps: true,
});

// create UserModel class from schema
const UserModel = mongoose.model('User', UserSchema);

export default UserModel;
