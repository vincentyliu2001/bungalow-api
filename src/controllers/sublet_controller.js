import Sublet from '../models/sublet_model';
import User from '../models/user_model';

export const getSublets = (req, res) => {
  Sublet.find().then((sublets) => {
    res.json(sublets);
  });
};
export const getSublet = (req, res) => {
  console.log(req.params.id);
  Sublet.findById(req.params.id).then((subletID) => {
    res.json(subletID);
  }).catch((error) => {
    res.send(`error: ${error}`);
  });
};

/* ********************************************************************************* */
const getHomePageSublets = async (amount, seenIds) => {
  const sublets = await Sublet.find({ id: { $nin: seenIds } }).sort('-createdAt').then();
  return sublets.slice(0, amount || 10);
};

export const getNewHomeItems = (req, res) => {
  User.findOne({ email: req.body.email }).then((user) => {
    getHomePageSublets(req.body.amount, user.seen).then((sublets) => {
      res.json(sublets);
    });
  });
};
/* ********************************************************************************* */

/* ********************************************************************************* */
const getSubletsWithIds = async (ids) => {
  return Sublet.find({ id: { $in: ids } }).sort('-createdAt').then();
};

const getInitSublets = async (req, res) => {
  const user = await User.findOne({ email: req.body.email }).then();
  console.log('USER!!!!!!!!!!!!!!', user);
  const homeSublets = await getHomePageSublets(req.body.amount, user.seen);
  const allSublets = await Sublet.find().then();
  const likedSublets = await getSubletsWithIds(user.liked);
  const addedSublets = await getSubletsWithIds(user.posts);
  console.log('AFTER MONGOSE QUERIES: ', addedSublets);
  return {
    liked: likedSublets,
    home: homeSublets,
    seen: user.seen,
    added: addedSublets,
    all: allSublets,
  };
};

export const loadInitialState = (req, res) => {
  getInitSublets(req, res).then(
    (sublets) => {
      res.json(sublets);
    },
  ).catch(
    (error) => {
      res.send(`error: ${error}`);
    },
  );
};
/* ********************************************************************************* */

export const updatePost = (req, res) => {
  const update = {
    title: req.body.title,
    address: req.body.address,
    description: req.body.description,
    bathrooms: req.body.bathrooms,
    price: req.body.price,
    footage: req.body.footage,
    bedrooms: req.body.bedrooms,
    phone: req.body.phone,
    images: req.body.images,
    email: req.body.email,
    name: req.body.name,
    latitude: req.body.latitude,
    longitude: req.body.longitude,
  };
  Sublet.findOneAndUpdate({ _id: req.body.id }, update).then(() => {
    res.json(update);
  });
};
