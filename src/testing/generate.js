import mongoose from 'mongoose';
import { createSublet } from '../controllers/user_controller';

const mongoURI = 'mongodb+srv://vincentyliu2001:cXHjkIYGc9MWjSy8@cluster0.r95vj.mongodb.net/hackMIT';
mongoose.connect(mongoURI);
// set mongoose promises to es6 default
mongoose.Promise = global.Promise;

const randText = (length) => {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i += 1) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

const generateSublets = (email, iterations) => {
  for (let i = 0; i < iterations; i += 1) {
    createSublet({
      body: {
        title: randText(10),
        address: randText(10),
        description: randText(10),
        bathrooms: 5 * Math.random(),
        price: 800 * Math.random(),
        footage: 800 * Math.random(),
        bedrooms: 5 * Math.random(),
        phone: 5555555555,
        images: [
          `https://picsum.photos/${Math.round(100 * Math.random() + 200)}/${Math.round(100 * Math.random() + 200)}`,
          `https://picsum.photos/${Math.round(100 * Math.random() + 200)}/${Math.round(100 * Math.random() + 200)}`,
          `https://picsum.photos/${Math.round(100 * Math.random() + 200)}/${Math.round(100 * Math.random() + 200)}`,
          `https://picsum.photos/${Math.round(100 * Math.random() + 200)}/${Math.round(100 * Math.random() + 200)}`,
          `https://picsum.photos/${Math.round(100 * Math.random() + 200)}/${Math.round(100 * Math.random() + 200)}`,
        ],
        email,
        name: randText(10),
        latitude: 180 * Math.random() - 90,
        longitude: 360 * Math.random() - 180,
      },
    }, {
      json: () => {},
    });
  }
};

generateSublets('josishmail@gmail.com', 25);
generateSublets('vyliu19@mail.strakejesuit.org', 25);
