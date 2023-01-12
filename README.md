# Project-6-Openclassroom-Piiquante

PROJET 6 : Construire une API sécurisée

Hot Takes par Piiquante

Objectif : développer une application web de critique de sauces piquantes, ayant pour but de permettre aux utilisateurs de télécharger leurs sauces piquantes préférées et de liker ou disliker celles que les autres partagent

## Installation

### Backend

Démarrer le serveur backend : A partir du fichier backend, taper la commande "**Nodemon Server**".
Par défault : *http://localhost:3000/*

Créer un dossier "**images**" dans le dossier backend pour y stocker temporairement les images des sauces ajoutés.

### Frontend

Demarrer le serveur frontend : A partir du fichier frontend, taper la commande "**npm start**".
Par défault : *http://localhost:4200/*

Dossier Frontend à cette adresse : https://github.com/OpenClassrooms-Student-Center/Web-Developer-P6

### Routes
Les routes nécéssitent une authentification par TOKEN (jwt)

Créer un fichier "**.env**" dans le dossier "**backend**" et remplir la ligne "**MONGO_ACCESS**" par la clé d'utilisateur mongodb

Contenue du dossier "**.env**"

MONGO_ACCESS = 'clé d'acces mongodb'

SECRET_TOKEN = "insérer ici un token aléatoire"

## Security

- bcrypt : hash le mot de passe
- dotenv : stocke les informations sensibles en dehors de l'application
- email-validator : test l'email de l'utilisateur et valide son format
- password-validator : test le mot de passe de l'utilisateur et valide son format
- helmet : définit des en-têtes HTTP pour sécuriser l'application Express
- JSWT : JSon Web Token, sécurise l'authentification par l'utilisation d'un TOKEN
- express-rate-limit : limite le nombre de requêtes envoyées par l'utilisateur
