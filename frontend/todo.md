# Calepinage — Plan d'implémentation

## 1. Setup du projet

- [X] Initialiser le projet Angular 17 (`ng new kalpy`)
- [ ] Configurer ESLint + Prettier
- [ ] Installer les dépendances : `jsPDF`, `paper.js` ou Canvas natif, `Angular Material` (optionnel)
- [ ] Configurer le routing principal (`AppRoutingModule`)
- [ ] Mettre en place l'environnement (`environment.ts` / `environment.prod.ts`)
- [ ] Configurer le proxy Spring Boot (`proxy.conf.json`)

---

## 2. Architecture — Modules

- [ ] `AppModule` — module racine
- [ ] `RoomModule` — gestion de la pièce (rectangle + forme libre)
- [ ] `TilingModule` — logique de calepinage
- [ ] `ExportModule` — génération PDF
- [ ] `SharedModule` — composants et pipes partagés

### Tests unitaires — Modules
- [ ] `AppModule` — test de chargement
- [ ] `RoomModule` — test d'import des déclarations
- [ ] `TilingModule` — test d'import des déclarations
- [ ] `ExportModule` — test d'import des déclarations

---

## 3. Modèles de données (interfaces / classes)

- [ ] `Room` — interface pièce (`id`, `name`, `type: 'rect' | 'free'`, `width?`, `length?`, `points?: Point[]`)
- [ ] `Point` — interface point 2D (`x: number`, `y: number`)
- [ ] `Segment` — interface segment (`start: Point`, `end: Point`, `length: number`)
- [ ] `Obstacle` — interface obstacle (`position: Point`, `width: number`, `height: number`, `label: string`)
- [ ] `Door` — interface porte (`position: Point`, `wallIndex: number`, `width: number`)
- [ ] `Tile` — interface carreau (`width: number`, `height: number`, `jointSize: number`)
- [ ] `TilingConfig` — interface config (`tile: Tile`, `pattern: 'straight' | 'diagonal' | 'offset-half' | 'offset-third'`, `origin: 'center' | 'corner' | 'wall'`, `overcote: number`)
- [ ] `TilingResult` — interface résultat (`netArea: number`, `tileCount: number`, `tileCountWithOvercote: number`, `cuts: Cut[]`, `alerts: Alert[]`)
- [ ] `Cut` — interface coupe (`label: string`, `value: string`)
- [ ] `Alert` — interface alerte (`type: 'warn' | 'ok' | 'danger'`, `message: string`)

### Tests unitaires — Modèles
- [ ] Validation de la construction d'un objet `Room` rectangulaire
- [ ] Validation de la construction d'un objet `Room` forme libre
- [ ] Validation d'un `TilingConfig` complet

---

## 4. Services

### `RoomService`
- [ ] `createRoom(type)` — crée une pièce vide
- [ ] `updateRectRoom(width, length)` — met à jour une pièce rectangulaire
- [ ] `addPoint(point)` — ajoute un point (mode forme libre)
- [ ] `removeLastPoint()` — annule le dernier point
- [ ] `closeShape()` — ferme la forme libre
- [ ] `addObstacle(obstacle)` — ajoute un obstacle
- [ ] `addDoor(door)` — ajoute une porte
- [ ] `resetRoom()` — réinitialise la pièce
- [ ] `getArea()` — calcule la surface nette (algo shoelace pour polygone)

#### Tests unitaires — `RoomService`
- [ ] `createRoom('rect')` retourne une pièce valide
- [ ] `createRoom('free')` retourne une pièce avec tableau de points vide
- [ ] `updateRectRoom(420, 560)` met à jour correctement les dimensions
- [ ] `addPoint()` ajoute le point au tableau
- [ ] `removeLastPoint()` retire le dernier point
- [ ] `closeShape()` passe `closed` à `true` si ≥ 3 points
- [ ] `closeShape()` ne ferme pas si < 3 points
- [ ] `addObstacle()` ajoute l'obstacle à la liste
- [ ] `addDoor()` ajoute la porte à la liste
- [ ] `resetRoom()` vide tous les champs
- [ ] `getArea()` retourne 23.52 pour une pièce 420×560
- [ ] `getArea()` retourne 0 si pièce non fermée
- [ ] `getArea()` calcule correctement un polygone en L

---

### `TilingService`
- [ ] `compute(room, config)` — calcule le calepinage complet
- [ ] `countTiles(area, tile)` — nombre de carreaux bruts
- [ ] `applyOvercote(count, pct)` — applique la surcote
- [ ] `computeCuts(room, config)` — calcule les chutes par mur
- [ ] `checkAlerts(result, config)` — génère les alertes (chutes < 10%, asymétrie)
- [ ] `computeOriginOffset(room, config)` — calcule le décalage selon le point de départ

#### Tests unitaires — `TilingService`
- [ ] `countTiles(23.52, {width:60, height:60})` → 66 carreaux
- [ ] `applyOvercote(66, 10)` → 73 carreaux
- [ ] `computeCuts()` pour pièce 420 cm avec carreau 60 cm → reste 0 cm (symétrique)
- [ ] `computeCuts()` pour pièce 450 cm avec carreau 60 cm → reste 30 cm
- [ ] `checkAlerts()` génère alerte `warn` si chute < 10% de la largeur du carreau
- [ ] `checkAlerts()` génère alerte `ok` si symétrie correcte
- [ ] `compute()` retourne un `TilingResult` complet et cohérent
- [ ] `compute()` avec obstacle soustrait la surface de l'obstacle
- [ ] `computeOriginOffset()` centre correctement la grille en mode `center`

---

### `CanvasService`
- [ ] `init(canvasElement)` — initialise le contexte 2D
- [ ] `drawGrid()` — dessine la grille de fond
- [ ] `drawTiles(room, config)` — dessine le calepinage
- [ ] `drawRoomRect(room)` — dessine le contour rectangulaire
- [ ] `drawRoomFree(points, closed)` — dessine le contour polygonal
- [ ] `drawCenterLines(room)` — dessine les axes de centrage
- [ ] `drawObstacles(obstacles)` — dessine les obstacles
- [ ] `drawDoors(doors)` — dessine les portes
- [ ] `drawDimensions(room)` — affiche les cotes
- [ ] `drawSegmentLabels(points)` — affiche les cotes de chaque segment
- [ ] `worldToCanvas(point)` — conversion coordonnées monde → canvas
- [ ] `canvasToWorld(point)` — conversion coordonnées canvas → monde
- [ ] `getScale(room)` — calcule l'échelle d'affichage

#### Tests unitaires — `CanvasService`
- [ ] `worldToCanvas()` et `canvasToWorld()` sont inverses l'une de l'autre
- [ ] `getScale()` retourne un facteur correct pour une pièce 420×560 dans un canvas 500×600
- [ ] `drawGrid()` ne lève aucune exception
- [ ] `drawRoomRect()` ne lève aucune exception avec une pièce valide

---

### `ExportService`
- [ ] `generatePDF(room, config, result)` — génère le PDF complet
- [ ] `buildTitleBlock(doc, projectName)` — entête du plan
- [ ] `buildLegend(doc, config)` — légende des matériaux
- [ ] `buildMaterialList(doc, result)` — liste des matériaux
- [ ] `buildCutList(doc, result)` — liste des coupes
- [ ] `buildCanvasSnapshot(canvasElement)` — capture le canvas en image base64
- [ ] `exportCSV(result)` — export liste matériaux en CSV

#### Tests unitaires — `ExportService`
- [ ] `exportCSV()` retourne une chaîne avec les bons en-têtes
- [ ] `exportCSV()` contient le bon nombre de lignes
- [ ] `buildMaterialList()` contient la quantité avec surcote
- [ ] `generatePDF()` ne lève aucune exception avec des données valides

---

## 5. Composants

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
- [ ] Champs dimensions carreau (largeur, hauteur, joint)
- [ ] Sélecteur sens de pose (droite, diagonale, décalage ½, décalage ⅓)
- [ ] Sélecteur point de départ
- [ ] Champ surcote
- [ ] Émission d'événement `configChange` à chaque modification

#### Tests — `SidebarComponent`
- [ ] Le composant se crée sans erreur
- [ ] La modification du champ largeur émet `configChange`
- [ ] La sélection d'un revêtement met à jour le style actif
- [ ] La valeur par défaut du joint est 3 mm

---

### `CanvasComponent`
- [ ] Onglets "Pièce rectangulaire" / "Forme libre"
- [ ] Mode rect : redimensionnement par glisser-déposer des bords
- [ ] Mode rect : champs de cote inline éditables
- [ ] Mode forme libre : barre d'outils (tracer / obstacle / porte)
- [ ] Mode forme libre : placement de points au clic
- [ ] Mode forme libre : fermeture au double-clic ou clic sur P1
- [ ] Mode forme libre : étiquettes de segments cliquables pour édition
- [ ] Affichage des axes de centrage (mode rect)
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
- [ ] Affichage surface nette, carreaux bruts, carreaux avec surcote
- [ ] Affichage des alertes (warn / ok / danger) avec icône
- [ ] Liste des coupes par mur
- [ ] Boutons export PDF, CSV, conseil optimisation

#### Tests — `ResultPanelComponent`
- [ ] Le composant se crée sans erreur
- [ ] Affiche "—" si aucun résultat disponible
- [ ] Affiche correctement un badge `warn` si alerte présente
- [ ] Le bouton PDF est désactivé si la pièce n'est pas définie

---

### `SharedModule` — composants partagés
- [ ] `BadgeComponent` — badge alerte réutilisable (`type`, `message`)
- [ ] `MetricCardComponent` — carte de métrique (`label`, `value`, `unit`)
- [ ] `SectionLabelComponent` — label de section uppercase
- [ ] `DimInputComponent` — input numérique avec unité inline

#### Tests — Shared
- [ ] `BadgeComponent` applique la bonne classe CSS selon `type`
- [ ] `MetricCardComponent` affiche la valeur et l'unité
- [ ] `DimInputComponent` émet `valueChange` à chaque saisie

---

## 6. Backend Spring Boot (rappel)

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
