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
- Export à l'unité (achat ponctuel par plan)
- Abonnement mensuel (accès illimité sur la période)

Dispose d'un **historique complet** de tous les plans générés sur son compte, qu'ils aient été achetés à l'unité ou via abonnement.

Champs du profil :
- Nom / Prénom
- Adresse complète (pour ses propres archives et documents)
- Email

### Utilisateur professionnel
Utilisateur enregistré avec un numéro SIRET valide correspondant au secteur du bâtiment.
Authentification : email / mot de passe ou Google OAuth.
Facturation **HT** (hors taxes — le professionnel récupère la TVA).
Peut choisir entre :
- Export à l'unité (tarification pro HT)
- Abonnement mensuel (accès illimité sur la période, tarification pro HT)

Dispose d'un **historique complet** de tous les plans générés sur son compte, qu'ils aient été achetés à l'unité ou via abonnement.

Champs du profil :
- Nom / Prénom
- Raison sociale
- Adresse complète (obligatoire pour la facturation HT)
- Email
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
Présent sur tous les comptes connectés, indépendamment du mode de facturation.
Chaque entrée contient : le plan PDF, la date de génération, le projet associé.

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

## Plan PDF

### Plan PDF
Document généré à l'export d'un projet. Contient le plan technique de calepinage et les informations nécessaires à la commande des matériaux.
Disponible uniquement pour les **utilisateurs connectés** (particulier ou professionnel).
Adapté automatiquement à l'échelle selon les dimensions de la pièce.

### Contenu du plan PDF

**Entête — Particulier**
- Nom / Prénom
- Adresse
- Date de génération
- Numéro de projet
- Mention TTC

**Entête — Professionnel**
- Raison sociale
- Adresse complète
- Numéro SIRET
- Date de génération
- Numéro de devis
- Mention HT + TVA applicable

**Bloc plan de calepinage**
- Vue de dessus de la pièce à l'échelle (adaptée automatiquement aux dimensions)
- Représentation des zones avec leur revêtement
- Axes de centrage
- Cotes de la pièce
- Joint de dilatation périphérique visible
- Obstacles et ouvertures représentés
- Numérotation des rangées de coupe
- Indication du point de départ et du sens de pose
- Échelle graphique + orientation (Nord)

**Bloc liste de matériaux**
- Par zone : type de revêtement, dimensions de l'unité, surface nette, quantité brute, quantité commandée avec surcote
- Fournitures de pose associées (liste générique V1, avec références V2)

**Bloc liste de coupes**
- Par mur : dimension de la chute, nombre de pièces à couper
- Alertes si chutes problématiques

**Bloc récapitulatif**
- Surface totale nette
- Surface totale avec surcote
- Nombre total d'unités à commander

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
Types supportés en V1 :
- **Carrelage / Grès cérame** — avec joint, formes rectangulaires
- **Travertin** — pierre naturelle, joint fin ou nul
- **Sol vinyle / LVT** — en dalles clipsées ou en rouleau
- **Moquette** — en lés (rouleau)

Reportés en V2-V3 :
- Carrelage hexagonal
- Parquet (toutes variantes)

Chaque revêtement a une couleur de rendu par défaut (le choix de couleur / texture est prévu en V2).

---

## Unités de pose

### Carreau
Unité de pose pour le **carrelage** et le **grès cérame**.
En V1 : forme rectangulaire uniquement.
Défini par : largeur (cm) × hauteur (cm) × épaisseur (mm).
*Exemple : 60×60 cm, épaisseur 10mm*

> V2-V3 : formes hexagonales, opus romain (multi-formats).

### Pierre naturelle (dalle de travertin)
Unité de pose pour le **travertin**.
Définie par : largeur (cm) × hauteur (cm) × épaisseur (mm).
Les carreaux peuvent être troués — cela ne change pas le plan de calepinage.
*Exemple : 40×40 cm, épaisseur 12mm*

### Lame de parquet
Unité de pose pour le **parquet**.
Il n'existe pas de pose droite en parquet — la pose minimale est toujours à l'anglaise (décalage).
Variantes :
- **Contrecollé / Stratifié** — longueur unique par paquet, pose à l'anglaise (décalage ⅓, ½, ¼...)
- **Massif** — plusieurs longueurs dans un même paquet (ex: 30 / 60 / 90 / 120 cm), optimisation des chutes nécessaire
- **Point de Hongrie / Chevron** — lames symétriques, vendues 50% gauches + 50% droites dans chaque paquet

> ⚠️ Le parquet est reporté en V2 dans sa totalité.

### Paquet
Unité de vente d'un revêtement. Contient un nombre défini d'unités de pose.
Comportement selon le matériau :
- **Carrelage / Travertin** : carreaux identiques dans chaque paquet
- **Sol vinyle / LVT (dalles ou lames)** : unités identiques dans chaque paquet
- **Parquet contrecollé / stratifié** : lames de longueur unique
- **Parquet massif** : lames de longueurs variées (ex: 30 / 60 / 90 / 120 cm)
- **Parquet point de Hongrie** : 50% lames gauches + 50% lames droites

En V1 : calcul en nombre d'unités uniquement.
En V2 : conversion automatique unités → paquets, intégration catalogue fournisseurs avec référence produit et code-barre.

### Dalle ou lame vinyle / LVT
Unité de pose pour le **sol vinyle** vendu en paquet (format clipsé).
Deux formats possibles :
- **Dalle** : format carré ou rectangulaire court
- **Lame** : format allongé imitant le parquet

Définie par : largeur (cm) × longueur (cm) × épaisseur (mm).
Vendu en **paquets** (plusieurs unités par paquet).
*Exemple : dalle LVT 30×60 cm, épaisseur 5mm / lame LVT 18×120 cm, épaisseur 5mm*

### Lé
Unité de pose pour la **moquette** et le **sol vinyle** en rouleau.
La largeur du rouleau est fixe (définie par le fabricant — ex: 4m) et ne peut pas être modifiée.
On coupe uniquement la longueur à la commande.
Si la pièce est plus large que le rouleau → plusieurs lés posés côte à côte avec raccord.

Défini par : largeur du rouleau (cm) × longueur coupée (cm) × épaisseur (mm).
*Exemple : lé moquette, rouleau 400 cm de large, épaisseur 8mm*

### Joint
L'espace laissé entre deux carreaux adjacents, rempli de mortier de jointoiement.
Saisi par l'utilisateur en mm.
S'applique au carrelage, au grès cérame et au travertin.
*Exemple : joint de 3mm*

### Joint de dilatation périphérique
Espace laissé entre le revêtement et les murs en périphérie de la pièce.
Permet au matériau de se dilater librement sous l'effet des variations de température et d'humidité, sans se soulever ni se fissurer.
Impacte directement le calepinage : la surface posable et le positionnement de la première et dernière rangée sont calculés en tenant compte de cette marge.

Valeurs par défaut selon le matériau :
- **Carrelage / Grès cérame** : 5mm
- **Travertin** : 5mm
- **Parquet massif** : 10mm
- **Parquet contrecollé / stratifié** : 8mm
- **Sol vinyle / LVT** : 5mm

L'utilisateur peut modifier ces valeurs manuellement. Une alerte est générée si la valeur saisie s'éloigne des recommandations.

---

## Épaisseur et nivellement

### Épaisseur du revêtement
La hauteur totale d'une unité de pose en mm.
Doit être prise en compte lorsque plusieurs revêtements coexistent dans une même pièce pour garantir un niveau de sol uniforme.
Stockée dans le modèle dès la V1 — le calcul de compensation est prévu en V2.

*Exemple : carrelage 10mm + colle 5mm = 15mm / parquet 14mm + colle 3mm = 17mm → compensation de 2mm nécessaire.*

### Ragréage
Produit de nivellement appliqué sur la chape avant la pose pour rattraper les différences d'épaisseur entre deux revêtements.
Permet d'obtenir un sol parfaitement horizontal et au même niveau final malgré des épaisseurs différentes.

*Exemple : si le parquet (14mm) est posé à côté d'un carrelage (10mm), un ragréage de 4mm est appliqué sous le parquet pour compenser.*

> ⚠️ Le calcul automatique du ragréage est prévu en V2.

---

## Calepinage

### Calepinage
Le plan de pose : organisation et disposition des unités de revêtement dans une zone.
Détermine le point de départ, le sens de pose, les coupes nécessaires et les quantités à commander.

### Types de pose — V1

**Carrelage / Grès cérame**
- Pose droite (0°)
- Pose diagonale (45°)
- Décalage ½
- Décalage ⅓

**Travertin**
- Pose droite (0°)
- Pose diagonale (45°)

**Sol vinyle / LVT (dalles)**
- Pose droite
- Décalage ½

**Moquette / Vinyle en rouleau**
- Pose en lés (sens de la longueur)

### Types de pose — V2-V3
- Carrelage : Opus romain, Hexagonal
- Parquet contrecollé / stratifié : À l'anglaise (décalage ⅓, ½, ¼), Pont de bateau
- Parquet massif : optimisation multi-longueurs
- Parquet point de Hongrie / Chevron
- Moquette / Vinyle : optimisation positionnement raccords

### Sens de pose
L'orientation et le motif selon lequel les unités sont posées dans une zone.
Varie selon le type de revêtement (voir Types de pose ci-dessus).

### Point de départ
Le point de référence à partir duquel le calepinage est calculé.
Options : centre de la zone, coin bas-gauche, milieu du mur principal.

### Axe de centrage
La ligne imaginaire passant par le centre de la zone.
Sert de référence pour garantir la symétrie du calepinage.

---

## Coupes et chutes

### Chute
La partie d'une unité de revêtement qui reste après découpe.

Règles minimales par matériau :

**Carrelage / Grès cérame / Travertin**
- ⚠️ Chute < 3cm — découpe trop difficile, à éviter absolument

**Dalle / Lame vinyle LVT**
- ⚠️ Chute en largeur < ½ de la largeur de la dalle/lame
- ⚠️ Chute en longueur < 1,5× la largeur de la dalle/lame

**Parquet (V2)**
- ⚠️ Chute en largeur < ½ de la largeur de la lame
- ⚠️ Chute en longueur < 1,5× la largeur de la lame
- *Exemple : lame 19cm → chute min largeur = 9,5cm / chute min longueur = 28,5cm*

**Moquette / Vinyle en rouleau**
- Pas de règle de chute minimale — la marge périphérique de 5cm suffit pour araser proprement
- Chute en largeur = largeur rouleau − largeur pièce (ex: 4m − 3,30m = 70cm de chute)
- Chute en longueur quasi nulle — on commande longueur exacte + 10cm

### Coupe
L'action de découper une unité de revêtement à la bonne dimension.
Une coupe génère une chute réutilisable ou perdue.

### Rangée de coupe
La rangée d'unités en bord de mur qui nécessite une découpe.
Idéalement symétrique de chaque côté de la zone.

### Marge périphérique
Surplus de matériau ajouté en périphérie de la pièce pour les revêtements en rouleau (moquette, vinyle).
Compense le fait que les murs ne sont jamais parfaitement droits.
Valeur recommandée : **5 cm de chaque côté**.
Le client ajuste et coupe sur place avec un araseur.

Impact sur la commande :
- Longueur commandée = longueur réelle + 10cm
- La largeur n'est pas impactée — c'est la largeur fixe du rouleau qui s'applique

### Sens des lés
Orientation des lés par rapport aux dimensions de la pièce.
Kalpy calcule automatiquement les deux options et propose celle qui **minimise les chutes et le nombre de lés** :

- **Option A — lés dans le sens de la longueur** : nombre de lés = ⌈ largeur pièce / largeur rouleau ⌉
- **Option B — lés dans le sens de la largeur** : nombre de lés = ⌈ longueur pièce / largeur rouleau ⌉

L'utilisateur peut choisir manuellement le sens s'il a une contrainte spécifique (esthétique, raccord, sens du trafic).

*Exemple : pièce 3,30m × 5m, rouleau 4m*
- Option A : 1 lé × 5,10m — chute largeur 70cm ✅ recommandé
- Option B : 2 lés × 3,40m — raccord nécessaire ⚠️

### Raccord
La jonction entre deux lés posés côte à côte lorsque la pièce nécessite plusieurs lés.
En V1 : pris en compte dans le calcul des dimensions et du nombre de lés.
En V2-V3 : optimisation du positionnement pour rendre les raccords invisibles (sous les meubles).

### Araseur
Outil de coupe utilisé pour ajuster un revêtement souple (moquette, vinyle) en périphérie de pièce contre le mur.
Permet de compenser les irrégularités des murs après pose du lé avec marge périphérique.

---

## Quantités et commande

### Surcote
Le pourcentage de matériaux commandés en supplément pour anticiper les erreurs de coupe, les casses et les chutes non réutilisables.
Valeurs recommandées :
- **10%** pour une pose droite
- **15%** pour une pose diagonale ou complexe

### Quantité brute
Le nombre d'unités nécessaires pour couvrir la surface nette d'une zone, sans surcote.

### Quantité commandée
La quantité brute augmentée de la surcote. C'est la quantité à commander.

### Fournitures de pose
Liste des produits nécessaires à la pose selon le revêtement choisi.

**V1 — unités techniques calculées automatiquement :**

| Élément | Unité V1 |
|---|---|
| Revêtement (carreaux / lames / lés) | Nombre d'unités |
| Colle | Kilogrammes (kg) |
| Joint carrelage | Kilogrammes (kg) |
| Plinthes | Mètres linéaires (ml) — périmètre pièce hors ouvertures |
| Profilés de seuil / finition | Mètres linéaires (ml) |

**V2 — unités d'achat :**

| Élément | Unité V2 |
|---|---|
| Revêtement | Paquets |
| Colle | Sacs (contenance en kg selon fabricant) |
| Joint | Sacs (contenance en kg selon fabricant) |
| Profilés | Nombre de barres (longueur standard 2,50m) |
| Plinthes | Nombre de paquets (2, 3 ou 4 pièces selon fabricant) |

**Rendements colle — valeurs par défaut V1 (ajustables par l'utilisateur) :**

| Revêtement | Méthode | Rendement |
|---|---|---|
| Carrelage / Grès cérame | Double encollage | 6 kg/m² |
| Travertin | Double encollage | 6 kg/m² |
| Sol vinyle / LVT collé | Simple encollage | 0,3 kg/m² |
| Moquette collée | Simple encollage | 0,3 kg/m² |
| Parquet collé | Double encollage | 1,5 kg/m² |

**Calcul du joint carrelage — formule V1 :**

La quantité de joint (en kg) dépend de la surface, de la largeur du joint, de l'épaisseur du carreau et des dimensions du carreau.

```
kg = surface × (largeur_joint × épaisseur_carreau × 1,6) / ((longueur_carreau + largeur_joint) × (hauteur_carreau + largeur_joint))
```

*Les dimensions sont en mm, la surface en m².*

**Produits spécifiques par revêtement :**
- **Carrelage / Grès cérame** : colle, joint, décapant ciment
- **Travertin** : colle, joint fin, bouche-pores, protecteur pierre naturelle
- **Sol vinyle collé** : colle contact, profilés de finition
- **Moquette** : colle, profilés de finition, araseur
- **Parquet** : colle, huile ou vitrificateur

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

## À définir en V2-V3

> Les termes ci-dessous sont identifiés mais pas encore complètement définis.
> Ils seront précisés lors de l'analyse des versions suivantes.

- **Carrelage hexagonal** — forme non rectangulaire, algorithme de pose spécifique
- **Opus romain** — pose mixant 4 formats de carreaux différents
- **Parquet à l'anglaise** — décalage variable (⅓, ½, ¼...) selon le produit
- **Parquet pont de bateau** — décalage ⅓ spécifique au parquet
- **Parquet massif multi-longueurs** — optimisation automatique de la combinaison de longueurs
- **Point de Hongrie / Chevron** — lames gauches et droites, calcul de commande en paires
- **Raccord optimisé** — positionnement des raccords sous les meubles pour les invisibiliser
- **Calcul de ragréage** — compensation automatique des différences d'épaisseur
- **Calcul de frise** — intégration de la frise dans le calepinage et les quantités
- **Choix de couleur / texture** — personnalisation du rendu visuel par revêtement
- **Validation SIRET** — intégration API Entreprise / INSEE pour vérification secteur bâtiment
- **Monétisation** — paiement à l'unité et abonnement (particulier TTC / professionnel HT)
- **Catalogue fournisseurs** — références produits Leroy Merlin, Castorama... avec tarification
- **Conversion unités → paquets** — calcul de commande en paquets selon le catalogue
