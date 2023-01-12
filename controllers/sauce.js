const Sauce = require('../models/Sauce');
const fs = require('fs');


// Get all sauces
exports.getAllSauces = (req, res, next) => {
  Sauce.find()
    .then((sauces) => { res.status(200).json(sauces); })
    .catch((error) => { 
      res.status(400).json({ error }); 
    });
};

// Get only one sauce by Id
exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => { res.status(200).json(sauce); })
    .catch((error) => {
      res.status(404).json({ error });
    });
};

// Create new sauce
exports.createSauce = (req, res, next) => {
  console.log(req.body.sauce);
  const sauceObject = JSON.parse(req.body.sauce);

  delete sauceObject._id;
  delete sauceObject._userId;
  const sauce = new Sauce({
    ...sauceObject,
    userId: req.auth.userId,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
  });

  sauce.save()
    .then(() => { res.status(201).json({ message: 'Sauce sauvegardé !' }) })
    .catch(error => { 
      res.status(400).json({ error }) 
    })
};

// Modify existing sauce
exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file ? {
    ...JSON.parse(req.body.sauce),
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  } : { ...req.body };

  delete sauceObject._userId;
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      if (sauce.userId != req.auth.userId) {
        res.status(403).json({ message: 'Requête non-autorisé' });
      } else {
        Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
          .then(() => {
            if (req.file) {
              const filename = sauce.imageUrl.split('/images/')[1];
              fs.unlink(`images/${filename}`,
                (err) => {
                  if (err) console.log(err);
                })
            }
            res.status(200).json({ message: 'Sauce modifiée !' })
          })
          .catch(error => res.status(401).json({ error }));
      }
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

// Delete sauce
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      if (sauce.userId != req.auth.userId) {
        res.status(401).json({ message: 'non autorisé' });
      } else {
        const filename = sauce.imageUrl.split('/images/')[1];
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => {
            fs.unlink(`images/${filename}`,
              (err) => {
                if (err) console.log(err);
                else {
                  res.status(200).json({ message: 'Sauce supprimée !' })
                }
              })
          })
          .catch(error => { console.log(error); res.status(401).json({ message: error }) });
      };
    })
    .catch(error => {
      res.status(400).json({ error });
    });
};

// Like and dislike sauce
exports.likeDislike = (req, res) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      switch (req.body.like) {
        case -1:
          Sauce.findOne(req.params)
          Sauce.findByIdAndUpdate(req.params.id, {
            ...sauce,
            dislikes: sauce.dislikes++,
            usersDisliked: sauce.usersDisliked.push(req.auth.userId),
          })
            .then(() => res.status(200).json({message: "J'aime" }))
            .catch(error => res.status(401).json({ error }));
          break;
        case 0:
          if (sauce.usersLiked.includes(req.auth.userId)) {
            const indexOfUser = sauce.usersLiked.indexOf(req.auth.userId);
            Sauce.findByIdAndUpdate(req.params.id, {
              ...sauce,
              likes: sauce.likes--,
              usersLiked: sauce.usersLiked.splice(indexOfUser, 1),
            })
              .then(() => res.status(200).json({message: "Je retire mon like"}))
              .catch(error => res.status(401).json({ error }));
          }
          if (sauce.usersDisliked.includes(req.auth.userId)) {
            const indexOfUser = sauce.usersDisliked.indexOf(req.auth.userId);
            Sauce.findByIdAndUpdate(req.params.id, {
              ...sauce,
              dislikes: sauce.dislikes--,
              usersDisliked: sauce.usersDisliked.splice(indexOfUser, 1),
            })
              .then(() => res.status(200).json({message: "Je retire mon dislike"}))
              .catch(error => res.status(401).json({ error }));
          }
          break;
        case 1:
          Sauce.findByIdAndUpdate(req.params.id, {
            ...sauce,
            likes: sauce.likes++,
            usersLiked: sauce.usersLiked.push(req.auth.userId),
          })
            .then(() => res.status(200).json({message: "Je n'aime pas"}))
            .catch(error => res.status(401).json({ error }));
          break;
      }
    })
    .catch(error => res.status(401).json({ error }));
};