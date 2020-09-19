import Sublet from '../models/sublet_model';
import User from '../models/user_model';

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
  s.latitude = req.body.latitude;
  s.longitude = req.body.longitude;
  s.uid = s.id;
  s.save().then(() => {
    res.json(s);
  });
};
export const getSublets = (req, res) => {
  Sublet.find().then((sublets) => {
    console.log(sublets);
    res.json(sublets);
  }).catch((error) => {
    res.send(`error: ${error}`);
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

const getHomePageSublets = async (req, user) => {
  const ids = user.seen ? user.seen.map((sublet) => { return sublet._id; }) : [];
  const sublets = await Sublet.find({ _id: { $nin: ids } }).sort('-createdAt');
  return sublets.slice(0, req.params.amount || 10);
};

const getInitSublets = async (req, res) => {
  const user = await User.find({ email: req.params.email });
  const homeSublets = await getHomePageSublets(req, user);
  return {
    liked: user.liked || [],
    home: homeSublets,
    seen: user.seen || [],
    posted: user.posts || [],
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

export const getNewHomeItems = (req, res) => {
  User.find({ email: req.params.email }).then((user) => {
    getHomePageSublets(req, user).then((sublets) => {
      res.json(sublets);
    });
  });
};

export const deleteSublet = (req, res) => {
  Sublet.findById(req.params.subletID).remove().exec().then(() => {
    res.json({ status: 'deleted' });
  });
};
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
  Sublet.findOneAndUpdate({ _id: req.params.subletID }, update).then(() => {
    res.json(update);
  });
};
