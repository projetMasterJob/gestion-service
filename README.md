# JobAzur API

API REST sécurisée pour la gestion des utilisateurs de l'application JobExplorer. Cette API fournit des endpoints pour la gestion des profils utilisateurs avec authentification JWT.

## Fonctionnalités

- **Authentification JWT** : Toutes les routes sont protégées par des tokens JWT
- **Gestion des utilisateurs** : CRUD complet pour les profils utilisateurs
- **Sécurité** : Middleware d'authentification et d'autorisation
- **Base de données PostgreSQL** : Stockage sécurisé des données utilisateurs
- **Validation des données** : Vérification des entrées utilisateur

## Prérequis

- **Node.js** (version 14 ou supérieure)
- **PostgreSQL** (version 12 ou supérieure)
- **npm** ou **yarn**

## Installation

1. **Cloner le repository**
   ```bash
   git clone https://github.com/projetMasterJob/jobazur-api.git
   cd jobazur-api
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Configuration de la base de données**
   
   Créer un fichier `.env` à la racine du projet :
   ```env
   # Configuration de la base de données
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=jobazur
   DB_USER=your_username
   DB_PASSWORD=your_password
   JWT_SECRET=cle_secrete_jwt
   
   # Configuration du serveur
   PORT=5000
   ```
   
## Lancement du projet

### Mode développement
```bash
npm run dev
```

### Mode production
```bash
npm start
```

Le serveur sera accessible sur `http://localhost:5000`

## Authentification

**⚠️ Important :** Toutes les routes de cette API nécessitent un token JWT valide.

### Obtenir un token JWT

Pour utiliser cette API, vous devez d'abord obtenir un token JWT depuis le service d'authentification (`auth-service`) :

1. **Connexion** : POST vers `auth-service/login`
2. **Récupération du token** : Le token sera retourné dans la réponse
3. **Utilisation** : Inclure le token dans le header `Authorization`

### Format du header d'authentification

```
Authorization: Bearer <token_jwt>
```

### Routes protégées (nécessitent un token JWT)

| Méthode | Route | Description | Protection |
|---------|-------|-------------|------------|
| `GET` | `/api/users` | Récupérer tous les utilisateurs | `authenticateToken` |
| `GET` | `/api/users/:id` | Récupérer un utilisateur spécifique | `authenticateToken` + `authorizeUser` |
| `PUT` | `/api/users/:id` | Mettre à jour un utilisateur | `authenticateToken` + `authorizeUser` |
| `DELETE` | `/api/users/:id` | Supprimer un utilisateur | `authenticateToken` + `authorizeUser` |

### Niveaux de protection

- **`authenticateToken`** : Vérifie que le token JWT est valide
- **`authorizeUser`** : Vérifie que l'utilisateur peut modifier son propre profil uniquement

## Codes de réponse

| Code | Description |
|------|-------------|
| `200` | Succès |
| `201` | Créé avec succès |
| `400` | Requête invalide |
| `401` | Token d'accès requis |
| `403` | Accès non autorisé |
| `404` | Ressource non trouvée |
| `500` | Erreur serveur interne |

## Structure du projet

```
jobazur-api/
├── src/
│   ├── config/
│   │   └── dbConfig.js          # Configuration de la base de données
│   ├── controllers/
│   │   └── userController.js    # Contrôleurs pour les utilisateurs
│   ├── middleware/
│   │   └── authMiddleware.js    # Middleware d'authentification
│   ├── models/
│   │   └── userModel.js         # Modèles de données
│   ├── routes/
│   │   └── userRoutes.js        # Définition des routes
│   ├── services/
│   │   └── userService.js       # Logique métier
│   └── app.js                   # Configuration Express
├── index.js                     # Point d'entrée
├── package.json                 # Dépendances
└── README.md                    # Documentation
```

## Sécurité

- **JWT Tokens** : Authentification sécurisée
- **Autorisation** : Les utilisateurs ne peuvent modifier que leur propre profil
- **Validation** : Vérification des données d'entrée
- **Base de données** : Connexion sécurisée avec PostgreSQL