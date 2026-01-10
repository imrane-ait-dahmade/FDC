# Fleet Management System - Backend

## Architecture

### Structure du projet

```
backend/
├── src/
│   ├── models/              # Modèles Mongoose
│   │   ├── user.model.ts
│   │   ├── truck.model.ts
│   │   ├── trailer.model.ts
│   │   ├── tire.model.ts
│   │   ├── driver.model.ts
│   │   ├── trip.model.ts
│   │   ├── fuel.model.ts
│   │   └── maintenance.model.ts
│   ├── services/            # Logique métier
│   │   ├── auth.service.ts
│   │   ├── truck.service.ts
│   │   └── trip.service.ts
│   ├── controllers/         # Gestion des requêtes HTTP
│   │   ├── auth.controller.ts
│   │   ├── truck.controller.ts
│   │   └── trip.controller.ts
│   ├── routes/              # Définition des routes
│   │   ├── truck.routes.ts
│   │   └── trip.routes.ts
│   ├── middleware/          # Middlewares Express
│   │   ├── auth.middleware.ts
│   │   ├── authorize.middleware.ts
│   │   └── error.middleware.ts
│   ├── auth.router.ts
│   ├── connection.ts
│   └── server.ts
├── package.json
├── tsconfig.json
└── README.md
```

## Fonctionnalités implémentées

### ✅ Authentification
- Login avec JWT
- Rôles utilisateurs (Admin/Driver)
- Middleware d'authentification
- Middleware d'autorisation par rôle

### ✅ Modèles de données
- **User** : Utilisateurs avec rôles
- **Truck** : Camions avec statut et kilométrage
- **Trailer** : Remorques
- **Tire** : Pneus avec suivi d'usure
- **Driver** : Chauffeurs liés aux utilisateurs
- **Trip** : Trajets avec statut et kilométrage
- **Fuel** : Consommation de carburant
- **Maintenance** : Opérations de maintenance

### ✅ Services métier
- **TruckService** : CRUD camions, mise à jour kilométrage
- **TripService** : CRUD trajets, gestion statuts, assignation

### ✅ Routes API

#### Authentification
- `POST /api/auth/login` - Connexion

#### Camions (Admin uniquement)
- `POST /api/trucks` - Créer un camion
- `GET /api/trucks` - Liste des camions
- `GET /api/trucks/:id` - Détails d'un camion
- `PUT /api/trucks/:id` - Modifier un camion
- `DELETE /api/trucks/:id` - Supprimer un camion
- `PATCH /api/trucks/:id/mileage` - Mettre à jour le kilométrage

#### Trajets
- `POST /api/trips` - Créer un trajet (Admin)
- `GET /api/trips` - Liste des trajets (Admin)
- `GET /api/trips/my-trips` - Mes trajets (Driver)
- `GET /api/trips/:id` - Détails d'un trajet
- `PUT /api/trips/:id` - Modifier un trajet (Admin)
- `PATCH /api/trips/:id/status` - Mettre à jour le statut (Driver)

## Installation

```bash
npm install
```

## Configuration

Créer un fichier `.env` :

```env
MONGO_URL=mongodb://localhost:27017/fleet_management
PORT=4000
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

## Démarrage

```bash
# Mode développement
npm run dev

# Compilation
npm run build

# Production
npm start
```

## Prochaines étapes

### À implémenter

1. **Services supplémentaires**
   - TrailerService
   - TireService
   - FuelService
   - MaintenanceService
   - DriverService

2. **Contrôleurs et routes**
   - Routes pour remorques, pneus, carburant, maintenance
   - Routes pour chauffeurs

3. **Génération PDF**
   - Installation de `pdfkit` ou `puppeteer`
   - Service de génération d'ordre de mission

4. **Tests unitaires**
   - Configuration Jest
   - Tests des services
   - Tests des contrôleurs

5. **Fonctionnalités avancées**
   - Rapports de consommation
   - Notifications de maintenance
   - Statistiques de flotte

## Sécurité

- Mots de passe hashés avec bcrypt
- Tokens JWT avec expiration
- Protection des routes par rôle
- Validation des entrées
- Gestion centralisée des erreurs

## Technologies

- Node.js
- Express.js
- TypeScript
- MongoDB
- Mongoose
- JWT
- bcrypt

