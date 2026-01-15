# Tests Unitaires

Ce dossier contient les tests unitaires et d'intégration pour le backend.

## Structure

```
__tests__/
├── setup.ts                    # Configuration globale des tests
├── integration/                # Tests d'intégration
│   └── auth.test.ts
└── services/
    └── __tests__/             # Tests unitaires des services
        ├── auth.service.test.ts
        ├── truck.service.test.ts
        ├── driver.service.test.ts
        ├── trip.service.test.ts
        └── maintenance.service.test.ts
```

## Exécution des tests

```bash
# Exécuter tous les tests
npm test

# Exécuter les tests en mode watch (re-exécution automatique)
npm run test:watch

# Exécuter les tests avec couverture de code
npm run test:coverage

# Exécuter un fichier de test spécifique
npm test auth.service.test.ts

# Exécuter les tests en mode verbose
npm test -- --verbose
```

## Couverture de code

Après avoir exécuté `npm run test:coverage`, vous pouvez consulter le rapport de couverture dans :
- Terminal : Résumé textuel
- HTML : `coverage/index.html` (ouvrir dans un navigateur)
- LCOV : `coverage/lcov.info` (pour les outils CI/CD)

## Écriture de nouveaux tests

### Structure d'un test

```typescript
import service from "../service.ts";
import Model from "../../models/model.ts";

jest.mock("../../models/model.ts");

describe("ServiceName", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("methodName", () => {
    it("should do something", async () => {
      // Arrange
      const mockData = { ... };
      (Model.find as jest.Mock).mockResolvedValue(mockData);

      // Act
      const result = await service.methodName();

      // Assert
      expect(result).toEqual(mockData);
    });
  });
});
```

### Bonnes pratiques

1. **Isoler les tests** : Utiliser `beforeEach` pour nettoyer les mocks
2. **Nommer clairement** : Les noms de tests doivent décrire ce qu'ils testent
3. **AAA Pattern** : Arrange, Act, Assert
4. **Mock les dépendances** : Ne pas utiliser de vraies bases de données
5. **Tester les cas d'erreur** : Vérifier que les erreurs sont bien gérées

## Configuration

La configuration Jest se trouve dans `jest.config.js` à la racine du projet.

Les variables d'environnement de test sont dans `.env.test`.
