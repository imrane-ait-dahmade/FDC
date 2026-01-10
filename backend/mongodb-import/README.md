# Import MongoDB Compass - Données d'exemple

Ce dossier contient des fichiers JSON prêts à être importés dans MongoDB Compass pour tester l'application FDC (Fleet Management System).

## Structure des fichiers

- `users.json` - Utilisateurs (1 admin + 4 drivers)
- `drivers.json` - Chauffeurs (liés aux users)
- `trucks.json` - Camions (5 véhicules)
- `trailers.json` - Remorques (4 remorques)
- `trips.json` - Trajets (4 trajets avec différents statuts)
- `fuel.json` - Consommations de carburant
- `maintenance.json` - Opérations de maintenance
- `tires.json` - Pneus des véhicules

## Instructions d'import

### Méthode 1 : Import via MongoDB Compass

1. Ouvrez MongoDB Compass
2. Connectez-vous à votre base de données
3. Sélectionnez votre base de données (ex: `fdc_db`)
4. Pour chaque collection :
   - Cliquez sur la collection (ou créez-la si elle n'existe pas)
   - Cliquez sur l'onglet "Documents"
   - Cliquez sur le bouton "ADD DATA" → "Import File"
   - Sélectionnez le fichier JSON correspondant
   - Cliquez sur "Import"

### Méthode 2 : Import via ligne de commande (mongoimport)

```bash
# Se connecter à MongoDB et importer chaque collection
mongoimport --uri="mongodb://localhost:27017/fdc_db" --collection=users --file=users.json --jsonArray
mongoimport --uri="mongodb://localhost:27017/fdc_db" --collection=drivers --file=drivers.json --jsonArray
mongoimport --uri="mongodb://localhost:27017/fdc_db" --collection=trucks --file=trucks.json --jsonArray
mongoimport --uri="mongodb://localhost:27017/fdc_db" --collection=trailers --file=trailers.json --jsonArray
mongoimport --uri="mongodb://localhost:27017/fdc_db" --collection=trips --file=trips.json --jsonArray
mongoimport --uri="mongodb://localhost:27017/fdc_db" --collection=fuel --file=fuel.json --jsonArray
mongoimport --uri="mongodb://localhost:27017/fdc_db" --collection=maintenance --file=maintenance.json --jsonArray
mongoimport --uri="mongodb://localhost:27017/fdc_db" --collection=tires --file=tires.json --jsonArray
```

## Ordre d'import recommandé

Importez les fichiers dans cet ordre pour respecter les dépendances :

1. `users.json` (doit être importé en premier)
2. `drivers.json` (référence users)
3. `trucks.json`
4. `trailers.json`
5. `tires.json` (référence trucks/trailers)
6. `trips.json` (référence drivers, trucks, trailers)
7. `fuel.json` (référence trucks, trips)
8. `maintenance.json` (référence trucks, trailers, tires)

## Comptes de test

### Administrateur
- Email: `admin@fdc.com`
- Password: (doit être hashé avec bcrypt dans votre application)
- Role: `admin`

### Chauffeurs
- Email: `ahmed.benali@fdc.com`
- Email: `fatima.alami@fdc.com`
- Email: `mohamed.idrissi@fdc.com`
- Email: `khadija.ouazzani@fdc.com`
- Role: `driver`

**Note:** Les mots de passe dans le fichier JSON sont des placeholders. Vous devrez créer les utilisateurs via l'API d'authentification de votre application pour avoir des mots de passe correctement hashés.

## Notes importantes

- Les ObjectIds sont cohérents entre les collections (les références sont valides)
- Les dates sont au format ISO 8601
- Les ObjectIds utilisent la syntaxe MongoDB Extended JSON (`{"$oid": "..."}`)
- Les dates utilisent la syntaxe MongoDB Extended JSON (`{"$date": "..."}`)

## Format des ObjectIds

Les fichiers utilisent le format MongoDB Extended JSON pour les ObjectIds et les dates, ce qui est compatible avec MongoDB Compass et mongoimport.

