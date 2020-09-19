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
const getHomePageSublets = async (amount, notSeenIds) => {
  const sublets = await Sublet.find({ id: { $nin: notSeenIds } }).sort('-createdAt');
  return sublets.slice(0, amount || 10);
};

export const getNewHomeItems = (req, res) => {
  User.findOne({ email: req.body.email }).then((user) => {
    const ids = user.seen ? user.seen.map((sublet) => { return sublet.id; }) : [];
    getHomePageSublets(req.body.amount, ids).then((sublets) => {
      res.json(sublets);
    });
  });
};
/* ********************************************************************************* */

/* ********************************************************************************* */
const getSubletsWithIds = async (seenIds, ids) => {
  const ret = await Sublet.find({ id: { $nin: seenIds, $in: ids } }).sort('-createdAt').then();
  console.log('PASSED PARAMS TO GET SUBLEST W IDS,', seenIds, ids, ret);
  return ret;
};

const getInitSublets = async (req, res) => {
  const user = await User.findOne({ email: req.body.email }).then();
  console.log('USER!!!!!!!!!!!!!!', user);
  const homeSublets = await getHomePageSublets(req.body.amount, user.seen);
  const allSublets = await Sublet.find().then();
  const likedSublets = await getSubletsWithIds(user.seen || [], user.liked || []);
  const addedSublets = await getSubletsWithIds(user.seen || [], user.posts || []);
  console.log('AFTER MONGOSE QUERIES: ', addedSublets);
  return {
    liked: likedSublets,
    home: homeSublets,
    seen: user.seen || [],
    added: addedSublets,
    all: allSublets || [],
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
