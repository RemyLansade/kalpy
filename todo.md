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

- [x] Valider les termes fondamentaux (Projet, Pièce, Zone, Revêtement)
- [x] Valider les types d'utilisateurs (invité, particulier, professionnel)
- [x] Valider le modèle de monétisation (abonnement, achat unité, TVA/HT) — V2
- [x] Valider les unités de pose par matériau (Carreau, Lame, Lé, Dalle LVT)
- [x] Valider le concept de paquet et sa logique V1/V2
- [x] Valider les types de pose V1 par matériau
- [x] Valider les règles de chutes et coupes par matériau
- [x] Valider le joint de dilatation périphérique et ses valeurs par défaut
- [x] Valider la marge périphérique et le sens des lés (moquette/vinyle rouleau)
- [x] Valider les fournitures de pose avec rendements colle et formule joint
- [x] Valider les règles esthétiques du calepinage
- [x] Valider la référence de pose et le périmètre du calepinage V1 (rect uniquement)
- [x] Valider le contenu du plan PDF (entête particulier vs professionnel)
- [x] Valider le contenu de l'export CSV
- [x] Consolider la liste complète des alertes métier
- [x] Compléter la section "À définir en V2-V3" du glossaire

---

## 3. Modèles de données

> ✅ Glossaire validé — on peut commencer les modèles.
> Chaque modèle correspond à un terme défini dans le glossaire.

### Utilisateurs
- [ ] `UserType` — enum (`GUEST` | `PARTICULAR` | `PROFESSIONAL`)
- [ ] `UserProfile` — profil utilisateur (nom, prénom, adresse, email)
- [ ] `ProfessionalProfile` — extension pro (raison sociale, SIRET, statut validation)
- [ ] `BillingMode` — enum (`UNIT` | `SUBSCRIPTION`)
- [ ] `Subscription` — abonnement (période, date début, date fin)
- [ ] `PlanHistory` — historique des plans générés (plan PDF, date, projet associé)

### Projet & pièce
- [ ] `Project` — projet (id, nom, date création, utilisateur, pièce)
- [ ] `Room` — pièce (nom, contour rect ou libre, zones, obstacles, ouvertures)
- [ ] `RoomType` — enum (`RECT` | `FREE`)
- [ ] `Point` — point 2D (x, y) en cm
- [ ] `Segment` — segment entre deux points (start, end, longueur en cm)
- [ ] `Obstacle` — obstacle (position, largeur, hauteur, label)
- [ ] `Opening` — ouverture dans un mur (position, largeur, type)

### Revêtement & calepinage
- [ ] `Zone` — zone de revêtement (nom, contour, revêtement, config de pose)
- [ ] `FlooringType` — enum (`TILE` | `TRAVERTIN` | `VINYL_TILE` | `VINYL_ROLL` | `CARPET`)
- [ ] `TilingUnit` — unité de pose (largeur, hauteur, épaisseur, type)
- [ ] `PosePattern` — enum des types de pose V1 par matériau
- [ ] `PoseOrigin` — enum (`CENTER` | `CORNER`)
- [ ] `TilingConfig` — config complète (unité, motif, origine, joint, joint dilatation, surcote)
- [ ] `TilingResult` — résultat calcul (surface, quantités, coupes, fournitures, alertes)
- [ ] `Cut` — coupe (mur concerné, dimension chute, nombre de pièces)
- [ ] `Alert` — alerte métier (type, message, règle déclenchante)
- [ ] `AlertType` — enum (`OK` | `WARN` | `DANGER`)
- [ ] `Supply` — fourniture de pose (type, désignation, quantité, unité)

### Tests unitaires — Modèles
- [ ] Validation d'un `Project` avec une pièce rectangulaire
- [ ] Validation d'une `Room` avec plusieurs zones
- [ ] Validation d'une `Room` avec obstacle et ouverture
- [ ] Validation d'un `TilingConfig` carrelage pose droite avec joint de dilatation
- [ ] Validation d'un `TilingConfig` travertin pose diagonale
- [ ] Validation d'un `TilingConfig` vinyle LVT décalage ½
- [ ] Validation d'un `TilingResult` complet avec alertes et fournitures
- [ ] Validation d'un `Supply` colle avec rendement standard

---

## 4. Services Angular

> ⚠️ À faire uniquement après validation des modèles (section 3).

### `RoomService`
- [ ] `createRoom(name, type)` — crée une pièce vide
- [ ] `updateRectRoom(width, length)` — met à jour une pièce rectangulaire
- [ ] `addPoint(point)` — ajoute un point (mode forme libre)
- [ ] `removeLastPoint()` — annule le dernier point
- [ ] `closeShape()` — ferme la forme libre
- [ ] `addZone(zone)` — ajoute une zone de revêtement
- [ ] `addObstacle(obstacle)` — ajoute un obstacle
- [ ] `addOpening(opening)` — ajoute une ouverture
- [ ] `resetRoom()` — réinitialise la pièce
- [ ] `getArea()` — calcule la surface nette (algo Shoelace pour polygone)

#### Tests — `RoomService`
- [ ] `createRoom('Cuisine', 'rect')` retourne une pièce valide
- [ ] `createRoom('Séjour', 'free')` retourne une pièce avec tableau de points vide
- [ ] `updateRectRoom(420, 560)` met à jour correctement les dimensions
- [ ] `addPoint()` ajoute le point au tableau
- [ ] `removeLastPoint()` retire le dernier point
- [ ] `closeShape()` passe `closed` à `true` si ≥ 3 points
- [ ] `closeShape()` ne ferme pas si < 3 points
- [ ] `addZone()` ajoute la zone à la liste
- [ ] `addObstacle()` ajoute l'obstacle à la liste
- [ ] `addOpening()` ajoute l'ouverture à la liste
- [ ] `resetRoom()` vide tous les champs
- [ ] `getArea()` retourne 23.52 pour une pièce 420×560 cm
- [ ] `getArea()` retourne 0 si pièce non fermée
- [ ] `getArea()` calcule correctement un polygone en L
- [ ] `getArea()` soustrait correctement la surface des obstacles

---

### `TilingService`
- [ ] `compute(room, config)` — calcule le calepinage complet
- [ ] `countUnits(area, unit)` — nombre d'unités brutes
- [ ] `applyOvercote(count, pct)` — applique la surcote
- [ ] `computeCuts(room, config)` — calcule les chutes par mur
- [ ] `computeSupplies(area, config)` — calcule les fournitures (colle, joint, plinthes, profilés)
- [ ] `checkAlerts(result, config)` — génère les alertes métier
- [ ] `computeOriginOffset(room, config)` — calcule le décalage selon le point de départ
- [ ] `computeDilationMargin(room, config)` — applique le joint de dilatation périphérique

#### Tests — `TilingService`
- [ ] `countUnits()` pour 23.52 m² avec carreau 60×60 cm → résultat correct
- [ ] `applyOvercote(66, 10)` → 73 unités
- [ ] `applyOvercote(66, 15)` → 76 unités (pose diagonale)
- [ ] `computeCuts()` pour pièce 420 cm avec carreau 60 cm → chute symétrique
- [ ] `computeCuts()` pour pièce 450 cm avec carreau 60 cm → chute 30 cm
- [ ] `computeSupplies()` colle carrelage 10m² → 60 kg
- [ ] `computeSupplies()` plinthes pièce 420×560 cm avec 1 ouverture de 90 cm → linéaire correct
- [ ] `checkAlerts()` génère `WARN` si chute carrelage < 3cm
- [ ] `checkAlerts()` génère `WARN` si chute LVT < ½ largeur unité
- [ ] `checkAlerts()` génère `WARN` si asymétrie > 5%
- [ ] `checkAlerts()` génère `WARN` si joint dilatation < valeur recommandée
- [ ] `checkAlerts()` génère `WARN` si surcote < 10%
- [ ] `checkAlerts()` génère `WARN` si surcote < 15% en pose diagonale
- [ ] `checkAlerts()` génère `OK` si symétrie correcte
- [ ] `compute()` retourne un `TilingResult` complet et cohérent
- [ ] `compute()` avec obstacle soustrait la surface de l'obstacle
- [ ] `computeDilationMargin()` retourne 5mm pour carrelage par défaut
- [ ] `computeOriginOffset()` centre correctement la grille en mode `CENTER`

---

### `CanvasService`
- [ ] `init(canvasElement)` — initialise le contexte 2D
- [ ] `drawGrid()` — dessine la grille de fond
- [ ] `drawTilingUnits(room, config)` — dessine le calepinage
- [ ] `drawRoomRect(room)` — dessine le contour rectangulaire avec joint de dilatation
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
- [ ] `buildTitleBlock(doc, project)` — entête adapté (particulier vs professionnel)
- [ ] `buildLegend(doc, config)` — légende des matériaux
- [ ] `buildMaterialList(doc, result)` — liste des matériaux avec fournitures
- [ ] `buildCutList(doc, result)` — liste des coupes par mur
- [ ] `buildCanvasSnapshot(canvasElement)` — capture le canvas en image base64
- [ ] `exportCSV(project, result)` — export CSV avec entête projet et colonnes métier

#### Tests — `ExportService`
- [ ] `exportCSV()` retourne une chaîne avec les bons en-têtes (projet, date, utilisateur)
- [ ] `exportCSV()` contient les colonnes : type produit, désignation, zone, quantité, unité
- [ ] `exportCSV()` contient le bon nombre de lignes
- [ ] `buildMaterialList()` contient la quantité avec surcote
- [ ] `buildTitleBlock()` affiche le SIRET pour un professionnel
- [ ] `buildTitleBlock()` affiche la mention HT pour un professionnel
- [ ] `generatePDF()` ne lève aucune exception avec des données valides

---

## 5. Composants Angular

> Angular 22 — standalone components (pas de NgModule)

### `AppComponent`
- [ ] Barre de navigation principale
- [ ] Nom du projet éditable
- [ ] Indicateur type utilisateur (particulier / pro)
- [ ] Bouton export PDF (désactivé si pièce non définie)
- [ ] Bouton export CSV

#### Tests — `AppComponent`
- [ ] Le composant se crée sans erreur
- [ ] Le titre du projet s'affiche et est éditable
- [ ] Le bouton export PDF est désactivé si la pièce n'est pas définie
- [ ] Le bouton export est absent pour un utilisateur invité

---

### `SidebarComponent`
- [ ] Sélecteur de revêtement (carrelage, travertin, vinyle dalle, vinyle rouleau, moquette)
- [ ] Champs dimensions unité de pose + joint (selon revêtement actif)
- [ ] Champ joint de dilatation périphérique (valeur par défaut selon matériau)
- [ ] Sélecteur sens de pose (filtré par revêtement)
- [ ] Sélecteur point de départ (centre / coin)
- [ ] Champ surcote (valeur recommandée selon la pose)
- [ ] Alerte si valeur hors recommandation
- [ ] Émission d'événement `configChange` à chaque modification

#### Tests — `SidebarComponent`
- [ ] Le composant se crée sans erreur
- [ ] La modification du champ largeur émet `configChange`
- [ ] La sélection d'un revêtement filtre les types de pose disponibles
- [ ] La valeur par défaut du joint est 3mm pour le carrelage
- [ ] La valeur par défaut du joint de dilatation est 5mm pour le carrelage
- [ ] La valeur par défaut du joint de dilatation est 10mm pour le parquet massif
- [ ] La surcote recommandée passe à 15% en pose diagonale
- [ ] Une alerte s'affiche si le joint de dilatation est inférieur à la valeur recommandée

---

### `CanvasComponent`
- [ ] Onglets "Pièce rectangulaire" / "Forme libre"
- [ ] Mode rect : redimensionnement par glisser-déposer des bords
- [ ] Mode rect : champs de cote inline éditables
- [ ] Mode rect : affichage du joint de dilatation périphérique
- [ ] Mode forme libre : barre d'outils (tracer / obstacle / ouverture)
- [ ] Mode forme libre : placement de points au clic
- [ ] Mode forme libre : fermeture au double-clic ou clic sur P1
- [ ] Mode forme libre : étiquettes de segments cliquables pour édition
- [ ] Affichage des axes de centrage
- [ ] Affichage du calepinage en temps réel (rect uniquement en V1)
- [ ] Émission d'événement `roomChange` à chaque modification

#### Tests — `CanvasComponent`
- [ ] Le composant se crée sans erreur
- [ ] Le switch d'onglet change le `tabMode`
- [ ] `addPoint()` ajoute un point et appelle `redraw()`
- [ ] `undoPoint()` appelle `RoomService.removeLastPoint()`
- [ ] `setTool()` met à jour l'outil actif
- [ ] Un double-clic avec ≥ 3 points ferme la forme
- [ ] Le calepinage ne se calcule pas en mode forme libre (V1)

---

### `ResultPanelComponent`
- [ ] Affichage surface nette, unités brutes, unités avec surcote
- [ ] Affichage des alertes (WARN / OK / DANGER) avec icône
- [ ] Liste des coupes par mur
- [ ] Liste des fournitures de pose avec quantités
- [ ] Boutons export PDF et CSV (désactivés si utilisateur invité)

#### Tests — `ResultPanelComponent`
- [ ] Le composant se crée sans erreur
- [ ] Affiche "—" si aucun résultat disponible
- [ ] Affiche correctement un badge `WARN` si alerte présente
- [ ] Affiche correctement un badge `OK` si symétrie correcte
- [ ] Les boutons export sont désactivés pour un utilisateur invité
- [ ] La liste des fournitures affiche les quantités en unités V1

---

### Composants partagés
- [ ] `BadgeComponent` — badge alerte (`type: AlertType`, `message: string`)
- [ ] `MetricCardComponent` — carte de métrique (`label`, `value`, `unit`)
- [ ] `SectionLabelComponent` — label de section uppercase
- [ ] `DimInputComponent` — input numérique avec unité inline et alerte optionnelle

#### Tests — Composants partagés
- [ ] `BadgeComponent` applique la bonne classe CSS selon `type`
- [ ] `MetricCardComponent` affiche la valeur et l'unité
- [ ] `DimInputComponent` émet `valueChange` à chaque saisie
- [ ] `DimInputComponent` affiche une alerte si valeur hors recommandation

---

## 6. Backend Spring Boot

### Authentification
- [ ] `POST /api/auth/register` — inscription (particulier ou professionnel)
- [ ] `POST /api/auth/login` — connexion email/mot de passe
- [ ] `GET /api/auth/google` — connexion Google OAuth
- [ ] `GET /api/auth/me` — profil utilisateur connecté

### Projets
- [ ] `POST /api/projects` — créer un projet
- [ ] `GET /api/projects` — liste des projets de l'utilisateur connecté
- [ ] `GET /api/projects/:id` — charger un projet
- [ ] `PUT /api/projects/:id` — sauvegarder un projet
- [ ] `DELETE /api/projects/:id` — supprimer un projet

### Export
- [ ] `POST /api/export/pdf` — générer et retourner le PDF (entête adapté au type utilisateur)
- [ ] `POST /api/export/csv` — générer et retourner le CSV

### Tests — Backend
- [ ] `POST /api/auth/register` particulier retourne 201
- [ ] `POST /api/auth/register` professionnel retourne 201
- [ ] `POST /api/auth/login` avec credentials valides retourne token
- [ ] `POST /api/projects` retourne 201
- [ ] `GET /api/projects` retourne uniquement les projets de l'utilisateur connecté
- [ ] `PUT /api/projects/:id` avec données valides retourne 200
- [ ] `DELETE /api/projects/:id` retourne 204
- [ ] `POST /api/export/pdf` retourne un blob PDF valide
- [ ] `POST /api/export/pdf` entête professionnel contient SIRET et mention HT
- [ ] `POST /api/export/csv` retourne un fichier CSV valide

---

## 7. Intégration & recette finale

- [ ] Connexion Angular ↔ Spring Boot (HttpClient + proxy)
- [ ] Gestion des erreurs HTTP (interceptor)
- [ ] Sauvegarde automatique du projet (debounce 1s)
- [ ] Garde de route — pages protégées pour utilisateurs connectés uniquement
- [ ] Test end-to-end : inscription particulier → créer pièce rect → configurer → exporter PDF
- [ ] Test end-to-end : inscription professionnel → créer pièce → exporter PDF avec entête HT
- [ ] Test end-to-end : utilisateur invité → simuler calepinage → boutons export désactivés
- [ ] Test end-to-end : dessiner forme libre → ajouter obstacle → vérifier alertes
- [ ] Recette responsive (tablette minimum)
- [ ] Audit accessibilité (labels ARIA, focus visible)