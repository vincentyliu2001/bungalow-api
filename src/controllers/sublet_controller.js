import Sublet from '../models/sublet_model';
import User from '../models/user_model';

export const getSublets = (req, res) => {
  Sublet.find().then((sublets) => {
    res.json(sublets);
  });
};
export const getSublet = (req, res) => {
  console.log(req.params.subletID);
  Sublet.findById(req.params.subletID).then((subletID) => {
    res.json(subletID);
  }).catch((error) => {
    res.send(`error: ${error}`);
  });
};

/* ********************************************************************************* */
const getHomePageSublets = async (amount, user) => {
  const ids = user.seen ? user.seen.map((sublet) => { return sublet._id; }) : [];
  const sublets = await Sublet.find({ _id: { $nin: ids } }).sort('-createdAt');
  return sublets.slice(0, amount || 10);
};

export const getNewHomeItems = (req, res) => {
  User.find({ email: req.params.email }).then((user) => {
    getHomePageSublets(req.params.amount, user).then((sublets) => {
      res.json(sublets);
    });
  });
};
/* ********************************************************************************* */

/* ********************************************************************************* */
const getInitSublets = async (req, res) => {
  const user = await User.find({ email: req.params.email });
  const homeSublets = await getHomePageSublets(req.params.amount, user);
  const allSublets = await Sublet.find();
  return {
    liked: user.liked || [],
    home: homeSublets,
    seen: user.seen || [],
    added: user.posts || [],
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
  Sublet.findOneAndUpdate({ _id: req.params.subletId }, update).then(() => {
    res.json(update);
  });
};
