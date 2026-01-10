# Frontend - Système de Gestion de Flotte (FDC)

Application React avec TypeScript, Tailwind CSS et shadcn/ui pour la gestion de flotte de camions.

## Technologies utilisées

- **React 19** avec TypeScript
- **Vite** comme build tool
- **React Router** pour la navigation avec nested routes
- **Tailwind CSS** pour le styling
- **shadcn/ui** pour les composants UI
- **Context API** pour la gestion d'état globale
- **Axios** pour les appels API
- **jsPDF** pour la génération de PDF
- **date-fns** pour la gestion des dates

## Structure du projet

```
src/
├── components/        # Composants réutilisables
│   ├── ui/           # Composants shadcn/ui
│   ├── Layout.tsx    # Layout principal avec sidebar
│   └── ProtectedRoute.tsx  # Protection des routes
├── contexts/         # Context API
│   └── AuthContext.tsx
├── pages/           # Pages de l'application
│   ├── admin/       # Pages admin
│   ├── driver/      # Pages driver
│   └── Login.tsx
├── services/        # Services API
│   ├── api.ts
│   ├── auth.service.ts
│   ├── truck.service.ts
│   └── trip.service.ts
├── types/           # Types TypeScript
│   └── index.ts
└── utils/           # Utilitaires
    └── pdf.ts       # Génération PDF
```

## Installation

```bash
npm install
```

## Configuration

Créez un fichier `.env` à la racine du dossier `web` :

```env
VITE_API_URL=http://localhost:4000/api
```

## Démarrage

```bash
npm run dev
```

L'application sera accessible sur `http://localhost:3000`

## Build

```bash
npm run build
```

## Fonctionnalités

### Admin
- Tableau de bord avec statistiques
- Gestion des camions (CRUD)
- Gestion des trajets
- Rapports (consommation, kilométrage, maintenance)
- Configuration de la maintenance
- Paramètres

### Chauffeur
- Liste des trajets assignés
- Détails d'un trajet
- Mise à jour du statut du trajet
- Saisie du kilométrage et consommation
- Téléchargement de l'ordre de mission en PDF
- Profil

## Routes protégées

Les routes sont protégées selon le rôle de l'utilisateur :
- `/admin/*` : Accessible uniquement aux administrateurs
- `/driver/*` : Accessible uniquement aux chauffeurs
- `/login` : Route publique

## Authentification

L'authentification utilise JWT. Le token est stocké dans le localStorage et ajouté automatiquement aux requêtes API via un interceptor Axios.
