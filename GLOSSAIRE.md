# Kalpy — Glossaire métier

> Ce fichier est la référence du vocabulaire métier du projet Kalpy.
> Il évolue au fur et à mesure de l'analyse des cas d'usage.
> Tout nouveau concept métier doit être défini ici avant d'être modélisé en code.

---

## Termes fondamentaux

### Projet
L'ensemble du travail commandé par un client.
Un projet peut contenir une ou plusieurs pièces avec des revêtements différents.
*Exemple : "Rénovation appartement Dupont — juin 2026"*

### Pièce
L'espace physique à couvrir d'un revêtement.
Une pièce a un contour (ses murs), une surface nette calculée, et peut contenir des obstacles et des ouvertures.
*Exemple : cuisine, salle de bain, couloir*

### Contour
La forme géométrique d'une pièce, définie par ses murs.
Peut être rectangulaire (saisie par largeur × longueur) ou libre (tracé point par point).

### Surface nette
La surface réelle à couvrir, en m², après soustraction des obstacles.
C'est la base de calcul des quantités de matériaux.

### Revêtement
Le matériau de sol choisi pour une pièce.
Types supportés : carrelage / grès cérame, parquet, sol vinyle / LVT, moquette.

---

## Unités de pose

### Carreau
Unité de pose pour le carrelage et le grès cérame.
Défini par : largeur (cm) × hauteur (cm) × épaisseur (mm).
*Exemple : 60×60 cm, grès cérame*

### Lame
Unité de pose pour le parquet.
Définie par : largeur (cm) × longueur (cm) × épaisseur (mm).
*Exemple : lame 19×180 cm*

### Lé
Unité de pose pour la moquette et le sol vinyle en rouleau.
Défini par : largeur du rouleau (cm) × longueur coupée (cm).
*Exemple : lé de 400 cm de large*

### Dalle vinyle / LVT
Unité de pose pour le sol vinyle en dalles clipsées.
Définie par : largeur (cm) × longueur (cm).
*Exemple : dalle LVT 30×60 cm*

### Joint
L'espace laissé entre deux carreaux adjacents, rempli de mortier de jointoiement.
Défini par sa largeur en mm.
Ne s'applique qu'au carrelage et au grès cérame.
*Exemple : joint de 3 mm*

---

## Calepinage

### Calepinage
Le plan de pose : organisation et disposition des unités de revêtement dans la pièce.
Le calepinage détermine le point de départ, le sens de pose, les coupes nécessaires et les quantités.

### Sens de pose
L'orientation et le motif selon lequel les unités sont posées.
Varie selon le type de revêtement (voir types de pose dans README.md).

### Point de départ
Le point de référence à partir duquel le calepinage est calculé.
Options : centre de la pièce, coin bas-gauche, milieu du mur principal.

### Axe de centrage
La ligne imaginaire passant par le centre de la pièce.
Sert de référence pour garantir la symétrie du calepinage.

---

## Coupes et chutes

### Chute
La partie d'une unité de revêtement qui reste après découpe pour s'adapter au bord de la pièce ou à un obstacle.
Une chute trop petite (< 10% de la largeur de l'unité) est à éviter car difficile à poser et inesthétique.

### Coupe
L'action de découper une unité de revêtement à la bonne dimension.
Une coupe génère une chute réutilisable ou perdue.

### Rangée de coupe
La rangée de carreaux en bord de mur qui nécessite une découpe.
Idéalement symétrique de chaque côté de la pièce.

---

## Quantités et commande

### Surcote
Le pourcentage de matériaux commandés en supplément pour anticiper :
- les erreurs de coupe
- les carreaux cassés
- les chutes non réutilisables
Valeur recommandée : 10% pour une pose droite, 15% pour une pose diagonale.

### Quantité brute
Le nombre d'unités nécessaires pour couvrir la surface nette, sans surcote.

### Quantité commandée
La quantité brute augmentée de la surcote. C'est la quantité à commander.

---

## Obstacles et ouvertures

### Obstacle
Un élément fixe dans la pièce qui réduit la surface à couvrir et nécessite des découpes spécifiques.
*Exemples : colonne, îlot de cuisine, baignoire encastrée, WC*

### Ouverture
Une interruption dans un mur (porte, fenêtre au sol).
Impacte la pose des rangées de coupe en bord de mur.

---

## À définir

> Les termes ci-dessous sont identifiés mais pas encore complètement définis.
> Ils seront précisés au fur et à mesure de l'analyse des cas d'usage.

- **Opus romain** — pose mixant 4 formats de carreaux différents
- **Point de Hongrie** — variante du chevron à 45°
- **Raccord** — alignement de motifs entre deux lés de moquette
- **Calepinage symétrique** — calepinage où les chutes sont égales de chaque côté
- **Départ décalé** — pose où les rangées alternent avec un décalage (½, ⅓...)