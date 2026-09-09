# MobiReport — Test technique Angular

Application Angular de gestion des **signalements** : création, modification et liste, avec observations sous forme de chips.

Le backend n’est pas utilisé. L’API est simulée par une couche mock qui respecte le contrat HTTP de l’annexe (payloads snake_case, `204` au succès, `400` si l’email existe déjà).

## Fonctionnalités

- Créer un signalement
- Modifier un signalement
- Lister les signalements
- Sélectionner des observations (chips, source API mock)
- Validation de formulaire (prénom/nom 50 caractères, email unique, date de naissance ≤ 100 ans)
- Affichage des erreurs API et formulaire
- UI responsive (desktop / mobile)

## Stack

- Angular 22 (standalone, zoneless, lazy loading)
- TypeScript
- Reactive Forms
- RxJS
- NgRx (Store, Effects, Store Devtools)
- Angular Material 3
- Tailwind CSS 4
- Vitest + Angular TestBed

## Prérequis

- Node.js `^22.22.3 || ^24.15.0 || >=26.0.0` (Angular 22). Un fichier `.nvmrc` pinne Node 26.

```bash
nvm use
npm install
npm start
```

L’application est disponible sur [http://localhost:4200](http://localhost:4200).

```bash
npm test
npm run build
```

## Architecture

Architecture **feature-based** : le métier « signalements » reste isolé, le core expose les contrats/services, le shared contient l’UI réutilisable.

```
src/app/
├── core/           modèles, services, mock API, erreurs
├── shared/         header, empty/error/loading, validators
└── features/reports/
    ├── components/ formulaire, liste, carte, chips
    ├── pages/      list + form (lazy)
    └── store/      actions, reducer, effects, selectors
```

Les dossiers « god folders » (`components/`, `services/`, `models/` à la racine) ont été évités volontairement : tout ce qui concerne un signalement vit dans `features/reports`.

## Flux de données

```
Page  →  NgRx (actions / effects / selectors)  →  ReportService
                                                 →  ObservationService
                                                 →  Mock API (static JSON)
```

Les composants de présentation restent « dumb » : ils reçoivent des `input()` et émettent des `output()`. Les pages dispatchent et lisent le store via `async` pipe.

## Mock API

Aucun `HttpClient` n’est branché, mais le frontend est écrit **comme si l’API existait**.

| Méthode | Chemin | Succès | Erreur |
| --- | --- | --- | --- |
| `GET` | `/reporting` | `200` liste | — |
| `GET` | `/observations` | `200` liste | — |
| `POST` | `/reporting` | `204` | `400` email déjà utilisé |
| `PUT` | `/reporting/:id` | `204` | `400` / `404` |

Le body d’écriture suit l’annexe (`sexe` + `observations: number[]`). La lecture suit le format liste (`sex` + observations hydratées). Ce mapping est volontaire : l’annexe mélange `sex` et `sexe`.

Exemple d’erreur 400 reproduite à l’identique :

```json
{
  "author": {
    "email": ["This value already exist"]
  }
}
```

La latence HTTP est simulée (`MOCK_API_DELAY`, 450 ms). Les tests la passent à `0`.

Pour brancher un vrai backend, il suffit de remplacer `MockApiClient` par un client HTTP : les composants, le store et les services ne changent pas.

## Gestion d’état (NgRx)

NgRx est utilisé parce que le sujet le demande, pas pour y mettre tout l’état local.

Le store contient uniquement :

- `reports`, `observations`
- `loading`, `saving`
- `error`, `saveError`, `fieldErrors`

Le formulaire Reactive Form reste local au composant. Après un `204`, un `loadReports` resynchronise la liste : la mock API reste la source de vérité.

## Validation

Les règles métier sont des **validators réutilisables**, pas de la logique cachée dans le template :

- `maxLength(50)` prénom / nom
- email Angular + unicité côté client
- `maxAgeValidator(100)` + date non future
- au moins une observation (`minSelectedValidator`)

L’unicité email est vérifiée **deux fois** :

1. Côté formulaire, à partir des signalements déjà chargés
2. Côté mock API (on ne fait jamais confiance au seul front)

Le message affiché : « Cette adresse email existe déjà. »

## UI

- **Angular Material** : champs, datepicker, select, chips, boutons, spinner, snackbar
- **Tailwind CSS** : layout, grille, espacements, responsive

Le preflight Tailwind est désactivé pour ne pas casser les styles Material.

## Performance

- Composants standalone (défaut Angular 22)
- `OnPush` par défaut (Angular 22)
- Application zoneless
- Lazy loading des pages
- `@for` avec `track report.id`
- `async` pipe (pas de `subscribe` dans les templates)
- Pages limitées à deux routes métier

## Tests

Les specs vivent à côté du code (`*.spec.ts`) plus deux fichiers d’intégration dans `src/app/features/reports/`.

```bash
npm test -- --watch=false
```

### Unitaires

- validators (`maxAge`, email unique, `maxLength`, required)
- services mock (`GET` / `POST` / `PUT`, erreur 400)
- reducer NgRx
- composants formulaire, liste, chips

### Intégration (Vitest + TestBed)

- ouvrir la liste
- créer un signalement
- le voir apparaître
- refuser un email déjà existant

## Choix technico-fonctionnels

1. **Reactive Forms plutôt que Signal Forms** — Angular 22 propose les Signal Forms, mais le sujet met l’accent sur Reactive Forms, RxJS et NgRx. Le formulaire reste donc classique, typé, et testable.
2. **Mock HTTP plutôt que données dans les composants** — le contrat d’annexe (204, 400, snake_case, `observations: [1, 2]`) est respecté pour rester branchable sans refactor.
3. **NgRx ciblé** — pas d’Entity Adapter ni de router-store : trop lourd pour deux pages. Effects + selectors suffisent.
4. **Feature-based** — isolation du domaine reporting, lisibilité en entretien.
5. **Français dans l’UI, anglais dans le code** — le métier du test est en français ; le code suit les conventions Angular.

## Améliorations possibles

- Vrai backend HTTP + intercepteur d’erreurs
- Authentification
- Pagination / filtres serveur
- Confirmation de suppression
- Accessibilité renforcée (focus trap sur les états d’erreur)
