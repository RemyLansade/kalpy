# Kalpy — Glossaire métier

> Ce fichier est la référence du vocabulaire métier du projet Kalpy.
> Il évolue au fur et à mesure de l'analyse des cas d'usage.
> Tout nouveau concept métier doit être défini ici avant d'être modélisé en code.

---

## Utilisateurs

### Utilisateur invité
Accès libre à l'application sans création de compte.
Peut modéliser une pièce et simuler un calepinage mais **ne peut ni sauvegarder ni exporter**.
Aucune donnée n'est persistée — la session est perdue à la fermeture du navigateur.

### Utilisateur particulier
Utilisateur enregistré sans informations professionnelles.
Authentification : email / mot de passe ou Google OAuth.
Facturation **TTC** (TVA 20% incluse).
Peut choisir entre :
- Export à l'unité (achat ponctuel)
- Abonnement mensuel (accès illimité sur la période)

Dispose d'un **historique complet** de tous les plans générés sur son compte, qu'ils aient été achetés à l'unité ou via abonnement.

### Utilisateur professionnel
Utilisateur enregistré avec un numéro SIRET valide correspondant au secteur du bâtiment.
Authentification : email / mot de passe ou Google OAuth.
Facturation **HT** (hors taxes — le professionnel récupère la TVA).
Peut choisir entre :
- Export à l'unité (tarification pro HT)
- Abonnement mensuel (accès illimité sur la période, tarification pro HT)

Dispose d'un **historique complet** de tous les plans générés sur son compte, qu'ils aient été achetés à l'unité ou via abonnement.

Informations supplémentaires obligatoires à l'inscription :
- Numéro SIRET
- Statut de validation SIRET (voir ci-dessous)

### Validation SIRET
Vérification du numéro SIRET d'un utilisateur professionnel via une API externe (ex : API Entreprise / INSEE).
Deux niveaux de vérification :
1. **Société active** — la société existe et n'est pas radiée, en liquidation ou en cessation d'activité
2. **Secteur du bâtiment** — le code NAF / APE correspond au secteur de la construction ou des travaux (codes NAF 41.xx, 42.xx, 43.xx...)

Un professionnel hors secteur bâtiment (ex : coiffeur, code NAF 96.02A) ne peut pas accéder au tarif professionnel et est redirigé vers un compte particulier.

> ⚠️ L'intégration de l'API de validation SIRET est reportée en V2.

---

## Monétisation

> ⚠️ **Tout ce bloc est reporté en V2.** Les concepts sont définis maintenant pour guider la modélisation des données dès la V1.

### Achat à l'unité
Paiement ponctuel pour exporter un plan PDF.
Disponible pour les particuliers (TTC) et les professionnels (HT) avec des tarifications différentes.
Le plan est attaché définitivement au compte et re-téléchargeable à tout moment sans frais supplémentaires.

### Abonnement
Accès illimité à l'export PDF sur une période choisie.
Disponible pour les particuliers (TTC) et les professionnels (HT) avec des tarifications différentes.
L'abonnement est un **engagement ferme** sur la période — pas de résiliation anticipée avec remboursement.

Périodes disponibles :
- **1 mois** — tarif plein
- **6 mois** — tarif dégressif
- **12 mois** — tarif le plus avantageux

Tant que l'abonnement est actif, l'utilisateur peut exporter autant de plans qu'il le souhaite.
Sans abonnement actif, l'utilisateur repasse en mode achat à l'unité.

> Les montants exacts sont à définir ultérieurement.

### Historique des plans
L'ensemble des plans PDF générés par un utilisateur connecté (particulier ou professionnel).
Présent sur tous les comptes connectés, indépendamment du mode de facturation (à l'unité ou abonnement).
Chaque entrée de l'historique contient : le plan PDF, la date de génération, le projet associé.

### TVA
Taxe sur la valeur ajoutée appliquée aux utilisateurs particuliers (taux en vigueur en France : 20%).
Les utilisateurs professionnels sont facturés **hors taxes** — ils récupèrent la TVA dans le cadre de leur activité.

### Facturation
Document généré à chaque achat ou renouvellement d'abonnement.
- **Particulier** : facture TTC avec montant TVA détaillé
- **Professionnel** : facture HT avec numéro SIRET, sans TVA

---

## Projet

### Projet
L'ensemble du travail sur un chantier donné.
Appartient à un **utilisateur connecté** (particulier ou professionnel) — un invité ne peut pas créer de projet persistant.
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

*Exemple : carrelage 10mm + colle 5mm = 15mm / parquet 14mm + colle 3mm = 17mm → compensation de 2mm nécessaire.*

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
- **Validation SIRET** — intégration API Entreprise / INSEE pour vérification secteur bâtiment
- **Monétisation** — paiement à l'unité et abonnement (particulier TTC / professionnel HT)
