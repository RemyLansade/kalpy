# Kalpy — Glossaire métier

> Ce fichier est la référence du vocabulaire métier du projet Kalpy.
> Il évolue au fur et à mesure de l'analyse des cas d'usage.
> Tout nouveau concept métier doit être défini ici avant d'être modélisé en code.

---

## Utilisateurs

### Utilisateur invité
Accès libre à l'application sans création de compte.
Peut modéliser une pièce et simuler un calepinage mais **ne peut ni sauvegarder ni exporter**.

### Utilisateur connecté
Accès complet à l'application après authentification.
Peut sauvegarder ses projets, les recharger et exporter un plan PDF.
Authentification supportée : email / mot de passe, Google OAuth.

---

## Projet

### Projet
L'ensemble du travail sur un chantier donné.
Appartient à un **utilisateur connecté** — un invité ne peut pas créer de projet persistant.
Contient une ou plusieurs pièces avec des revêtements différents.

Propriétés :
- Nom libre choisi par l'utilisateur (ex: "Rénovation appartement Dupont")
- Date de création automatique
- Numéro de devis généré uniquement à l'export PDF

> V1 : un projet contient une seule pièce.

---

## Pièce

### Pièce
L'espace physique à couvrir d'un ou plusieurs revêtements.
A un nom libre choisi par l'utilisateur (ex: "Cuisine", "Chambre 1", "Couloir").
Définie par son contour (rectangulaire ou forme libre), sa surface nette, ses obstacles et ses ouvertures.
Peut contenir plusieurs zones de revêtement différentes.

### Contour
La forme géométrique d'une pièce, définie par ses murs.
Deux modes :
- **Rectangulaire** — saisie par largeur × longueur en cm
- **Forme libre** — tracé point par point avec cotes éditables en cm

### Surface nette
La surface réelle à couvrir, en m², après soustraction des obstacles.
Base de calcul des quantités de matériaux.

---

## Zones et revêtements

### Zone
Une partie délimitée d'une pièce avec son propre revêtement et sa propre configuration de pose.
Une pièce peut contenir plusieurs zones — chaque zone est calculée indépendamment.
Peut être rectangulaire ou de forme libre.

*Exemple : dans un séjour, Zone 1 = parquet en chevron (40m²) / Zone 2 = carrelage grès cérame près de la cuisine (15m²)*

### Frise
Une bande décorative séparant deux zones de revêtement différentes.
Possède sa propre largeur (unique et uniforme), son propre matériau et sa propre configuration.
Une pièce peut contenir plusieurs frises.

*Exemple : rangée de carreaux de ciment entre parquet massif et carrelage hexagonal.*

> ⚠️ **Reporté en V2** — la frise est définie dans le glossaire mais ne sera pas implémentée en V1.

### Revêtement
Le matériau de sol choisi pour une zone.
Types supportés :
- **Carrelage / Grès cérame** — avec joint
- **Travertin** — pierre naturelle, opus romain courant, joint très fin ou nul
- **Parquet** — pose flottante ou clouée
- **Sol vinyle / LVT** — en dalles clipsées ou en rouleau
- **Moquette** — en lés ou en dalles

Chaque revêtement a une couleur de rendu par défaut (le choix de couleur / texture est prévu en V2).

---

## Unités de pose

### Carreau
Unité de pose pour le **carrelage** et le **grès cérame**.
Défini par : largeur (cm) × hauteur (cm) × épaisseur (mm).
*Exemple : 60×60 cm, épaisseur 10mm*

### Pierre naturelle (dalle de travertin)
Unité de pose pour le **travertin**.
Définie par : largeur (cm) × hauteur (cm) × épaisseur (mm).
Épaisseur souvent irrégulière — à prendre en compte pour le ragréage.
*Exemple : 40×40 cm, épaisseur 12mm*

### Lame
Unité de pose pour le **parquet**.
Définie par : largeur (cm) × longueur (cm) × épaisseur (mm).
*Exemple : lame 19×180 cm, épaisseur 14mm*

### Dalle vinyle / LVT
Unité de pose pour le **sol vinyle** en dalles clipsées.
Définie par : largeur (cm) × longueur (cm) × épaisseur (mm).
*Exemple : dalle LVT 30×60 cm, épaisseur 5mm*

### Lé
Unité de pose pour la **moquette** et le **sol vinyle** en rouleau.
Défini par : largeur du rouleau (cm) × longueur coupée (cm) × épaisseur (mm).
*Exemple : lé moquette 400 cm de large, épaisseur 8mm*

### Joint
L'espace laissé entre deux carreaux adjacents, rempli de mortier de jointoiement.
Défini par sa largeur en mm.
S'applique au carrelage, au grès cérame et au travertin (joint très fin pour ce dernier).
*Exemple : joint de 3mm*

---

## Épaisseur et nivellement

### Épaisseur du revêtement
La hauteur totale d'une unité de pose en mm.
Doit être prise en compte lorsque plusieurs revêtements coexistent dans une même pièce pour garantir un niveau de sol uniforme.
Stockée dans le modèle dès la V1 — le calcul de compensation est prévu en V2.

*Exemple : carrelage 10mm + colle 5mm = 15mm / carreaux de ciment 20mm + colle 3mm = 23mm → compensation de 8mm nécessaire.*

### Ragréage
Produit de nivellement appliqué sur la chape avant la pose pour rattraper les différences d'épaisseur entre deux revêtements.
Permet d'obtenir un sol parfaitement horizontal et au même niveau final malgré des épaisseurs de revêtements différentes.

*Exemple : si le parquet (14mm) est posé à côté d'un carrelage (10mm), un ragréage de 4mm est appliqué sous le parquet pour compenser.*

> ⚠️ Le calcul automatique du ragréage est prévu en V2.

---

## Calepinage

### Calepinage
Le plan de pose : organisation et disposition des unités de revêtement dans une zone.
Détermine le point de départ, le sens de pose, les coupes nécessaires et les quantités à commander.

### Sens de pose
L'orientation et le motif selon lequel les unités sont posées dans une zone.
Varie selon le type de revêtement (voir types de pose dans README.md).

### Point de départ
Le point de référence à partir duquel le calepinage est calculé.
Options : centre de la zone, coin bas-gauche, milieu du mur principal.

### Axe de centrage
La ligne imaginaire passant par le centre de la zone.
Sert de référence pour garantir la symétrie du calepinage.

---

## Coupes et chutes

### Chute
La partie d'une unité de revêtement qui reste après découpe pour s'adapter au bord de la zone ou à un obstacle.
Une chute trop petite (< 10% de la largeur de l'unité) est à éviter — difficile à poser et inesthétique.

### Coupe
L'action de découper une unité de revêtement à la bonne dimension.
Une coupe génère une chute réutilisable ou perdue.

### Rangée de coupe
La rangée d'unités en bord de mur qui nécessite une découpe.
Idéalement symétrique de chaque côté de la zone.

---

## Quantités et commande

### Surcote
Le pourcentage de matériaux commandés en supplément pour anticiper les erreurs de coupe, les casses et les chutes non réutilisables.
Valeurs recommandées :
- **10%** pour une pose droite
- **15%** pour une pose diagonale ou complexe (chevron, point de Hongrie)

### Quantité brute
Le nombre d'unités nécessaires pour couvrir la surface nette d'une zone, sans surcote.

### Quantité commandée
La quantité brute augmentée de la surcote. C'est la quantité à commander.

---

## Obstacles et ouvertures

### Obstacle
Un élément fixe dans la pièce qui réduit la surface à couvrir et nécessite des découpes spécifiques.
Forme rectangulaire en V1.
*Exemples : colonne, îlot de cuisine, baignoire encastrée, WC*

### Ouverture
Une interruption dans un mur impactant la pose des rangées de coupe en bord de mur.
*Exemples : porte, fenêtre au sol, baie vitrée*

---

## À définir en V2

> Les termes ci-dessous sont identifiés mais pas encore complètement définis.
> Ils seront précisés lors de l'analyse de la V2.

- **Opus romain** — pose mixant 4 formats de carreaux différents
- **Point de Hongrie** — variante du chevron à 45°
- **Raccord** — alignement de motifs entre deux lés de moquette
- **Calepinage symétrique** — calepinage où les chutes sont égales de chaque côté
- **Calcul de ragréage** — compensation automatique des différences d'épaisseur
- **Calcul de frise** — intégration de la frise dans le calepinage et les quantités
- **Choix de couleur / texture** — personnalisation du rendu visuel par revêtement