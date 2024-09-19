const Book = require('../models/Book');
const fs = require('fs');

// Ajouter un livre
exports.addBook = (req, res, next) => {
  // Conversion du body de la request en JSON pour un meilleur traitement des clefs
  const bookObj = JSON.parse(req.body.book);
  // Suppression des clefs id et userId qui seront générées par la base de données
  delete bookObj._id;
  delete bookObj._userId;

  // Création du nouvel objet livre en déstructurant le corps de la request
  const book = new Book({
    ...bookObj,
    userId: req.auth.userId,
    // Génération de l'URL de l'image : http://localhost:4000/images/[nom de l'image]
    imageUrl: `${req.protocol}://${req.get('host')}/images/${
      req.file.filename
    }`,
  });

  // Enregistrement du nouveau livre
  book
    .save()
    .then(() => res.status(201).json({ message: 'Objet enregistré' }))
    .catch((error) => res.status(400).json({ error }));
};

// Modification d'un livre existant
exports.updateBook = (req, res, next) => {
  // Destructuration de la request pour remplir les champs de l'objet
  const updateContent = { ...req.body, _id: req.params.id };
  if (req.file) {
    updateContent.imageUrl = `${req.protocol}://${req.get('host')}/images/${
      req.file.filename
    }`;
  }
  Book.updateOne({ _id: req.params.id }, updateContent)
    .then(() => {
      res.status(200).json({ message: 'Objet modifié' });
    })
    .catch((error) => res.status(400).json({ error }));
};

// Suppression d'un livre existant
exports.deleteBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      // Vérification que l'utilisateur connecté est bien le créateur du livre
      if (book.userId != req.auth.userId) {
        res.status(401).json({ message: 'Not authorized' });
      } else {
        // Suppression de l'image dans le stockage local
        const filename = book.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
          Book.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({ message: 'Objet supprimé' }))
            .catch((error) => res.status(401).json({ error }));
        });
      }
    })
    .catch((error) => res.status(500).json({ error }));
};

// Récupérer un livre spécifique
exports.getOneBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then((book) => res.status(200).json(book))
    .catch((error) => res.status(404).json({ error }));
};

// Voir la liste de tous les livres
exports.getBooks = (req, res, next) => {
  Book.find()
    .then((books) => res.status(200).json(books))
    .catch((error) => res.status(400).json({ error }));
};

// Voir les 3 livres les mieux notés
exports.getBestRatings = (req, res, next) => {
  // Récupération de la liste complète des livres
  Book.find()
    .then((books) => {
      // Tri des livres en fonction des notes moyennes
      const sortedBooks = books
        .sort((a, b) => {
          return b.averageRating - a.averageRating;
        })
        // Conservation des 3 premiers éléments
        .slice(0, 3);
      res.status(200).json(sortedBooks);
    })
    .catch((error) => res.status(400).json({ error }));
};

// Ajout d'une note à un livre
exports.addRating = (req, res, next) => {
  Book.findOne({ _id: req.params.id }).then((book) => {
    // Ajout de la nouvelle note dans la liste de l'objet
    book.ratings.push({
      userId: req.body.userId,
      grade: req.body.rating,
      _id: req.params.id,
    });
    // Calcul de la moyenne des notes
    let sommeRatings = 0;
    for (let i = 0; i < book.ratings.length; i++) {
      // Addition de toutes les notes
      sommeRatings += book.ratings[i].grade;
    }
    // Division par le nombre de notes
    book.averageRating = sommeRatings / book.ratings.length;

    // Enregistrement de l'objet mis à jour
    book
      .save()
      .then((book) => res.status(200).json(book))
      .catch((error) => {
        res.status(400).json({ error });
      });
  });
};
