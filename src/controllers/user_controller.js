import jwt from 'jwt-simple';
import dotenv from 'dotenv';
import User from '../models/user_model';
import Sublet from '../models/sublet_model';
import verifyToken from '../services/verify_token';

dotenv.config({ silent: true });

function tokenForUser(user) {
  const timestamp = new Date().getTime();
  return jwt.encode({ sub: user, iat: timestamp }, process.env.AUTH_SECRET);
}

export const signin = (req, res, next) => {
  return verifyToken(req.body.accessToken).then((payload) => {
    if (!payload) return res.status(422).send('You must provide valid ID token');
    return User.findOne({ gid: payload.sub }).then((user) => {
      if (!user) {
        const newUser = new User();
        newUser.email = req.body.email;
        newUser.gid = payload.sub;
        return newUser.save()
          .then((result) => {
            res.json({ jwt: tokenForUser(payload.sub) });
          })
          .catch((error) => {
            res.status(500).json({ error });
          });
      } else {
        return res.send({ jwt: tokenForUser(payload.sub) });
      }
    });
  }).catch((e) => { res.status(400).send(e); });
};

export const getUser = (req, res) => {
  console.log(req.params.email);
  User.find({ email: req.params.email }).then((user) => {
    res.json(user);
  }).catch((error) => {
    res.send(`error: ${error}`);
  });
};

export const createSublet = (req, res) => {
  const s = new Sublet();
  s.title = req.body.title;
  s.address = req.body.address;
  s.description = req.body.description;
  s.bathrooms = req.body.bathrooms;
  s.price = req.body.price;
  s.footage = req.body.footage;
  s.bedrooms = req.body.bedrooms;
  s.phone = req.body.phone;
  s.images = req.body.images;
  s.email = req.body.email;
  s.name = req.body.name;
  s.uid = s.id;
  s.latitude = req.body.latitude;
  s.longitude = req.body.longitude;

  User.findOneAndUpdate(
    { email: s.email },
    { $push: { posts: s.id, seen: s.id } },
  ).then(() => {
    s.save().then(() => {
      res.json(s);
    });
  }).catch((err) => {
    console.log('Failed to add New Post: ', err);
  });
};

export const removePost = (req, res) => {
  User.findOneAndUpdate(
    { email: req.body.email },
    { $pull: { posts: req.body.id } },
  ).then(() => {
    Sublet.findById(req.body.id).remove().exec().then(() => {
      res.json({ status: 'success' });
    });
  }).catch((err) => {
    console.log('Failed to Remove Post: ', err);
  });
};

export const addLiked = (req, res) => {
  User.findOneAndUpdate(
    { email: req.body.email },
    { $push: { liked: req.body.id } },
  ).then(() => {
    res.json({ status: 'success' });
  }).catch((err) => {
    console.log('Failed to Add to Liked: ', err);
  });
};

export const removeLiked = (req, res) => {
  User.findOneAndUpdate(
    { email: req.body.email },
    { $pull: { liked: req.body.id } },
  ).then(() => {
    res.json({ status: 'success' });
  }).catch((err) => {
    console.log('Failed to Remove Post: ', err);
  });
};

export const addSeen = (req, res) => {
  User.findOneAndUpdate(
    { email: req.body.email },
    { $push: { seen: req.body.id } },
  ).then(() => {
    res.json({ status: 'success' });
  }).catch((err) => {
    console.log('Failed to Add to Liked: ', err);
  });
};
