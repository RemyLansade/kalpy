# Kalpy — Plan d'implémentation

> **Approche BDD** — chaque section technique est précédée d'une validation métier.
> Aucun modèle ou service ne doit être codé sans être d'abord défini dans [`GLOSSAIRE.md`](GLOSSAIRE.md).

---

## 1. Setup du projet

- [x] Initialiser le projet Angular 22 (`ng new kalpy`)
- [x] Configurer ESLint + Prettier
- [x] Installer les dépendances : Canvas natif, jsPDF
- [x] Mettre en place l'environnement (`environment.ts` / `environment.development.ts`)
- [x] Configurer le proxy Spring Boot (`proxy.conf.json`)
- [x] Initialiser le backend Spring Boot (Web, JPA, H2, PostgreSQL, Lombok)

---

## 2. Analyse métier & glossaire

- [ ] Valider les termes fondamentaux du glossaire (Projet, Pièce, Revêtement, Carreau, Joint...)
- [ ] Définir et valider les cas d'usage principaux (poseur pro, particulier, architecte)
- [ ] Valider le lexique des unités de pose par matériau (Carreau, Lame, Lé, Dalle LVT)
- [ ] Valider le lexique des coupes et chutes
- [ ] Valider le lexique des obstacles et ouvertures
- [ ] Compléter la section "À définir" du glossaire (Opus romain, Point de Hongrie, Raccord...)
- [ ] Valider les règles métier des alertes (seuils chutes, symétrie)
- [ ] Valider les règles métier de la surcote par type de pose

---

## 3. Modèles de données

> ⚠️ À faire uniquement après validation complète de la section 2.
> Chaque modèle doit correspondre à un terme défini dans le glossaire.

- [ ] `Project` — projet complet (id, nom, date, liste de pièces)
- [ ] `Room` — pièce (contour rect ou libre, obstacles, ouvertures)
- [ ] `Point` — point 2D (x, y) en cm
- [ ] `Segment` — segment entre deux points (start, end, longueur)
- [ ] `Obstacle` — obstacle dans la pièce (position, dimensions, label)
- [ ] `Opening` — ouverture dans un mur (porte, fenêtre au sol)
- [ ] `Flooring` — revêtement choisi (type, unité de pose, couleur)
- [ ] `TilingUnit` — unité de pose (carreau, lame, lé, dalle) avec ses dimensions
- [ ] `TilingConfig` — configuration complète de pose (unité, motif, origine, surcote)
- [ ] `TilingResult` — résultat du calcul (surface, quantités, coupes, alertes)
- [ ] `Cut` — coupe (mur concerné, dimension de la chute)
- [ ] `Alert` — alerte métier (type, message, règle déclenchante)

### Tests unitaires — Modèles
- [ ] Validation d'un `Project` avec plusieurs pièces
- [ ] Validation d'une `Room` rectangulaire
- [ ] Validation d'une `Room` en forme libre fermée
- [ ] Validation d'une `Room` avec obstacle
- [ ] Validation d'un `TilingConfig` carrelage pose droite
- [ ] Validation d'un `TilingConfig` parquet chevron
- [ ] Validation d'un `TilingResult` complet

---

## 4. Services Angular

> ⚠️ À faire uniquement après validation des modèles (section 3).

### `RoomService`
- [ ] `createRoom(type)` — crée une pièce vide
- [ ] `updateRectRoom(width, length)` — met à jour une pièce rectangulaire
- [ ] `addPoint(point)` — ajoute un point (mode forme libre)
- [ ] `removeLastPoint()` — annule le dernier point
- [ ] `closeShape()` — ferme la forme libre
- [ ] `addObstacle(obstacle)` — ajoute un obstacle
- [ ] `addOpening(opening)` — ajoute une ouverture (porte / fenêtre)
- [ ] `resetRoom()` — réinitialise la pièce
- [ ] `getArea()` — calcule la surface nette (algo Shoelace pour polygone)

#### Tests — `RoomService`
- [ ] `createRoom('rect')` retourne une pièce valide
- [ ] `createRoom('free')` retourne une pièce avec tableau de points vide
- [ ] `updateRectRoom(420, 560)` met à jour correctement les dimensions
- [ ] `addPoint()` ajoute le point au tableau
- [ ] `removeLastPoint()` retire le dernier point
- [ ] `closeShape()` passe `closed` à `true` si ≥ 3 points
- [ ] `closeShape()` ne ferme pas si < 3 points
- [ ] `addObstacle()` ajoute l'obstacle à la liste
- [ ] `addOpening()` ajoute l'ouverture à la liste
- [ ] `resetRoom()` vide tous les champs
- [ ] `getArea()` retourne 23.52 pour une pièce 420×560 cm
- [ ] `getArea()` retourne 0 si pièce non fermée
- [ ] `getArea()` calcule correctement un polygone en L
- [ ] `getArea()` soustrait correctement la surface d'un obstacle

---

### `TilingService`
- [ ] `compute(room, config)` — calcule le calepinage complet
- [ ] `countUnits(area, unit)` — nombre d'unités brutes
- [ ] `applyOvercote(count, pct)` — applique la surcote
- [ ] `computeCuts(room, config)` — calcule les chutes par mur
- [ ] `checkAlerts(result, config)` — génère les alertes métier
- [ ] `computeOriginOffset(room, config)` — calcule le décalage selon le point de départ

#### Tests — `TilingService`
- [ ] `countUnits()` pour 23.52 m² avec carreau 60×60 cm → résultat correct
- [ ] `applyOvercote(66, 10)` → 73 unités
- [ ] `applyOvercote(66, 15)` → 76 unités (pose diagonale)
- [ ] `computeCuts()` pour pièce 420 cm avec carreau 60 cm → chute symétrique
- [ ] `computeCuts()` pour pièce 450 cm avec carreau 60 cm → chute 30 cm
- [ ] `checkAlerts()` génère `warn` si chute < 10% de la largeur de l'unité
- [ ] `checkAlerts()` génère `warn` si asymétrie détectée
- [ ] `checkAlerts()` génère `ok` si symétrie correcte
- [ ] `compute()` retourne un `TilingResult` complet et cohérent
- [ ] `compute()` avec obstacle soustrait la surface de l'obstacle
- [ ] `computeOriginOffset()` centre correctement la grille en mode `center`

---

### `CanvasService`
- [ ] `init(canvasElement)` — initialise le contexte 2D
- [ ] `drawGrid()` — dessine la grille de fond
- [ ] `drawTilingUnits(room, config)` — dessine le calepinage
- [ ] `drawRoomRect(room)` — dessine le contour rectangulaire
- [ ] `drawRoomFree(points, closed)` — dessine le contour polygonal
- [ ] `drawCenterLines(room)` — dessine les axes de centrage
- [ ] `drawObstacles(obstacles)` — dessine les obstacles
- [ ] `drawOpenings(openings)` — dessine les ouvertures
- [ ] `drawDimensions(room)` — affiche les cotes
- [ ] `drawSegmentLabels(points)` — affiche les cotes de chaque segment
- [ ] `worldToCanvas(point)` — conversion coordonnées monde → canvas
- [ ] `canvasToWorld(point)` — conversion coordonnées canvas → monde
- [ ] `getScale(room)` — calcule l'échelle d'affichage

#### Tests — `CanvasService`
- [ ] `worldToCanvas()` et `canvasToWorld()` sont inverses
- [ ] `getScale()` retourne un facteur correct pour une pièce 420×560 dans un canvas 500×600
- [ ] `drawGrid()` ne lève aucune exception
- [ ] `drawRoomRect()` ne lève aucune exception avec une pièce valide

---

### `ExportService`
- [ ] `generatePDF(project, config, result)` — génère le PDF complet
- [ ] `buildTitleBlock(doc, project)` — entête du plan
- [ ] `buildLegend(doc, config)` — légende des matériaux
- [ ] `buildMaterialList(doc, result)` — liste des matériaux
- [ ] `buildCutList(doc, result)` — liste des coupes
- [ ] `buildCanvasSnapshot(canvasElement)` — capture le canvas en image base64
- [ ] `exportCSV(result)` — export liste matériaux en CSV

#### Tests — `ExportService`
- [ ] `exportCSV()` retourne une chaîne avec les bons en-têtes
- [ ] `exportCSV()` contient le bon nombre de lignes
- [ ] `buildMaterialList()` contient la quantité avec surcote
- [ ] `generatePDF()` ne lève aucune exception avec des données valides

---

## 5. Composants Angular

> Angular 22 — standalone components (pas de NgModule)

### `AppComponent`
- [ ] Barre de navigation principale
- [ ] Nom du projet éditable
- [ ] Bouton export PDF (appel `ExportService`)

#### Tests — `AppComponent`
- [ ] Le composant se crée sans erreur
- [ ] Le titre s'affiche correctement
- [ ] Le bouton export est présent dans le DOM

---

### `SidebarComponent`
- [ ] Sélecteur de revêtement (carrelage, parquet, vinyle, moquette)
- [ ] Champs dimensions unité de pose + joint (selon revêtement actif)
- [ ] Sélecteur sens de pose (filtré par revêtement)
- [ ] Sélecteur point de départ
- [ ] Champ surcote (avec valeur recommandée selon la pose)
- [ ] Émission d'événement `configChange` à chaque modification

#### Tests — `SidebarComponent`
- [ ] Le composant se crée sans erreur
- [ ] La modification du champ largeur émet `configChange`
- [ ] La sélection d'un revêtement filtre les types de pose disponibles
- [ ] La valeur par défaut du joint est 3 mm pour le carrelage
- [ ] La surcote recommandée passe à 15% en pose diagonale

---

### `CanvasComponent`
- [ ] Onglets "Pièce rectangulaire" / "Forme libre"
- [ ] Mode rect : redimensionnement par glisser-déposer des bords
- [ ] Mode rect : champs de cote inline éditables
- [ ] Mode forme libre : barre d'outils (tracer / obstacle / ouverture)
- [ ] Mode forme libre : placement de points au clic
- [ ] Mode forme libre : fermeture au double-clic ou clic sur P1
- [ ] Mode forme libre : étiquettes de segments cliquables pour édition
- [ ] Affichage des axes de centrage
- [ ] Affichage du calepinage en temps réel
- [ ] Émission d'événement `roomChange` à chaque modification

#### Tests — `CanvasComponent`
- [ ] Le composant se crée sans erreur
- [ ] Le switch d'onglet change le `tabMode`
- [ ] `addPoint()` ajoute un point et appelle `redraw()`
- [ ] `undoPoint()` appelle `RoomService.removeLastPoint()`
- [ ] `setTool()` met à jour l'outil actif
- [ ] Un double-clic avec ≥ 3 points ferme la forme

---

### `ResultPanelComponent`
- [ ] Affichage surface nette, unités brutes, unités avec surcote
- [ ] Affichage des alertes (warn / ok / danger) avec icône
- [ ] Liste des coupes par mur
- [ ] Boutons export PDF, CSV, conseil optimisation

#### Tests — `ResultPanelComponent`
- [ ] Le composant se crée sans erreur
- [ ] Affiche "—" si aucun résultat disponible
- [ ] Affiche correctement un badge `warn` si alerte présente
- [ ] Le bouton PDF est désactivé si la pièce n'est pas définie

---

### Composants partagés

- [ ] `BadgeComponent` — badge alerte réutilisable (`type`, `message`)
- [ ] `MetricCardComponent` — carte de métrique (`label`, `value`, `unit`)
- [ ] `SectionLabelComponent` — label de section uppercase
- [ ] `DimInputComponent` — input numérique avec unité inline

#### Tests — Composants partagés
- [ ] `BadgeComponent` applique la bonne classe CSS selon `type`
- [ ] `MetricCardComponent` affiche la valeur et l'unité
- [ ] `DimInputComponent` émet `valueChange` à chaque saisie

---

## 6. Backend Spring Boot

- [ ] `POST /api/projects` — créer un projet
- [ ] `GET /api/projects/:id` — charger un projet
- [ ] `PUT /api/projects/:id` — sauvegarder un projet
- [ ] `POST /api/export/pdf` — générer et retourner le PDF
- [ ] `POST /api/export/csv` — générer et retourner le CSV

### Tests — Backend
- [ ] Test d'intégration `POST /api/projects` retourne 201
- [ ] Test `PUT /api/projects/:id` avec données valides retourne 200
- [ ] Test `POST /api/export/pdf` retourne un blob PDF valide
- [ ] Test unitaire `TilingCalculatorService.compute()` côté Java

---

## 7. Intégration & recette finale

- [ ] Connexion Angular ↔ Spring Boot (HttpClient + proxy)
- [ ] Gestion des erreurs HTTP (interceptor)
- [ ] Sauvegarde automatique du projet (debounce 1s)
- [ ] Test end-to-end : créer pièce rect → configurer → exporter PDF
- [ ] Test end-to-end : dessiner forme libre → ajouter obstacle → exporter
- [ ] Recette responsive (tablette minimum)
- [ ] Audit accessibilité (labels ARIA, focus visible)