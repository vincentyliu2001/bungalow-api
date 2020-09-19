import mongoose, { Schema } from 'mongoose';

// create a PostSchema with a title field
const SubletSchema = new Schema({
  title: String, // String is shorthand for {type: String}
  address: String,
  description: String,
  bathrooms: Number,
  price: Number,
  footage: Number,
  bedrooms: Number,
  phone: String,
  images: [String],
  email: String,
  name: String,
  uid: { type: String, unique: true, index: true },
}, {
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
  timestamps: true,
});
// create PostModel class from schema
const SubletModel = mongoose.model('Sublet', SubletSchema);

export default SubletModel;
