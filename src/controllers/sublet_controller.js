import mongoose from 'mongoose';
import axios from 'axios';

import Sublet from '../models/sublet_model';
import User from '../models/user_model';

export const getSublets = (req, res) => {
  Sublet.find().then((sublets) => {
    res.json(sublets);
  });
};
export const getSublet = (req, res) => {
  Sublet.findById(req.params.id).then((subletID) => {
    res.json(subletID);
  }).catch((error) => {
    res.send(`error: ${error}`);
  });
};

/* ********************************************************************************* */
const callPythonAlgo = async (sublets, filters) => {
  const subletsMapped = sublets.map((sublet) => {
    return {
      name: sublet.name,
      sqft: sublet.footage,
      price: sublet.price,
      bedroom: sublet.bedrooms,
      address: sublet.id,
      lat: sublet.latitude,
      lon: sublet.longitude,
    };
  });
  const payload = {
    sublet: {
      sqft: filters ? filters.footage : 1000,
      lowPrice: filters ? filters.lowPrice : 0,
      highPrice: filters ? filters.highPrice : 50000,
      bedroom: filters ? filters.bedroom : 3,
      bathroom: filters ? filters.bathroom : 2,
      lat: filters ? filters.latitude : 0,
      lon: filters ? filters.longitude : 0,
      range: filters ? filters.range : 0,
    },
    subleasers: subletsMapped,
  };

  const res = await axios.post('https://bungalow-filter.herokuapp.com/api/filterAlgo', payload).catch((err) => {
    console.log('Failed to reach Matt\'s API', err);
  });

  return res && res.data ? res.data : sublets; // axios uses .data not .body
};

const getHomePageSublets = async (amount, seenIds, filters) => {
  const sublets = await Sublet.find({
    _id: {
      $nin: seenIds.map((id) => {
        return mongoose.Types.ObjectId(id); // eslint-disable-line
      }),
    },
  });
  // Call Matt's API on sublets to get them in sorted Order
  let homes = await callPythonAlgo(sublets, filters);

  homes = homes.sort((a, b) => {
    return a[1] - b[1];
  });

  homes = homes.map((subArray) => {
    const id = subArray[0];
    return sublets.find((sublet) => { return sublet.id === id; });
  });

  console.log('WHAT IS FOLLOWING THIS TEXT:', homes);
  return homes.slice(0, amount || 10);
};

export const getNewHomeItems = (req, res) => {
  User.findOne({ email: req.body.email }).then((user) => {
    getHomePageSublets(req.body.amount, user.seen, user.filters).then((sublets) => {
      res.json(sublets);
    });
  });
};
/* ********************************************************************************* */

/* ********************************************************************************* */
const getSubletsWithIds = async (ids) => {
  return Sublet.find({
    _id: {
      $in: ids.map((id) => {
        return mongoose.Types.ObjectId(id); // eslint-disable-line
      }),
    },
  }).sort('-createdAt');
};

const getInitSublets = async (req, res) => {
  const user = await User.findOne({ email: req.body.email }).then();
  const homeSublets = await getHomePageSublets(req.body.amount, user.seen);
  const allSublets = await Sublet.find().then();
  const likedSublets = await getSubletsWithIds(user.liked);
  const addedSublets = await getSubletsWithIds(user.posts);

  return {
    liked: likedSublets,
    home: homeSublets,
    seen: user.seen,
    added: addedSublets,
    all: allSublets,
    filters: user.filters,
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
