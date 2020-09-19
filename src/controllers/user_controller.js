import jwt from 'jwt-simple';
import dotenv from 'dotenv';
import User from '../models/user_model';
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
