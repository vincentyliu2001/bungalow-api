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
        newUser.preferences = {
          minPrice: 0,
          maxPrice: 99999,
          footage: 0,
          bedroom: 0,
          bathroom: 0,
          latitude: 0,
          longitude: 0,
          range: 0,
        };
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

// export const updatePreferences = (req, res) => {
//   User.findOneAndUpdate(
//     { email: req.body.email },
//     {
//       preferences: {
//         minPrice: req.body.minPrice,
//         maxPrice: req.body.maxPrice,
//         footage: req.body.footage,
//         bedroom: req.body.bedroom,
//         bathroom: req.body.bathroom,
//         latitude: req.body.latitude,
//         longitude: req.body.longitude,
//         range: req.body.range,
//       },
//     },
//   ).then(() => {
//     res.json({ status: 'success' });
//   }).catch((err) => {
//     console.log('Failed to Add to Liked: ', err);
//   });
// };

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
  console.log('pushed id', req.body.id, req.body.email);
  User.findOneAndUpdate(
    { email: req.body.email },
    { $addToSet: { liked: req.body.id } },
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
    { $addToSet: { seen: req.body.id } },
  ).then(() => {
    res.json({ status: 'success' });
  }).catch((err) => {
    console.log('Failed to Add to Liked: ', err);
  });
};

export const addFilter = (req, res) => {
  User.findOne({ email: req.body.email }).then((user) => {
    user.filters = req.body.preferences;
    user.save().then(() => {
      res.json({ status: 'success' });
    });
  }).catch((err) => {
    console.log('Failed to Add to Liked: ', err);
  });
};
