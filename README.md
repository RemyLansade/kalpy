# Kalpy

> Générateur de plans de calepinage pour tous types de revêtement de sol — carrelage, parquet, sol vinyle, moquette.

Kalpy permet à des professionnels (poseurs, artisans, architectes) comme à des particuliers de modéliser une pièce, configurer un revêtement, et obtenir un plan de pose précis exportable en PDF — avec calcul automatique des quantités, des coupes et des alertes de symétrie.

![Status](https://img.shields.io/badge/status-en%20développement-orange)
![License](https://img.shields.io/badge/license-MIT-green)
![Angular](https://img.shields.io/badge/Angular-22-red)
![Java](https://img.shields.io/badge/Java-17-blue)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3-brightgreen)

---

## Approche de développement

Kalpy suit une approche **BDD (Behaviour Driven Development)** — chaque fonctionnalité est définie à partir de cas d'usage métier concrets, en se mettant à la place de l'utilisateur, avant d'être modélisée en code.

### Documents de référence

| Fichier | Rôle |
|---|---|
| [`GLOSSAIRE.md`](GLOSSAIRE.md) | Lexique métier — définitions de tous les termes du domaine du calepinage. Référence commune pour les développeurs et les contributeurs. Tout nouveau concept métier est défini ici avant d'être codé. |
| [`todo.md`](todo.md) | Plan d'implémentation complet — liste de toutes les tâches à réaliser avec leurs tests unitaires associés. |
| [`CONTEXT.md`](CONTEXT.md) | Contexte technique complet du projet — architecture, modèles de données, charte graphique, conventions. Destiné aux outils d'assistance au développement. |

---

## Fonctionnalités

- Modélisation de pièce rectangulaire (par saisie des côtes) ou en forme libre (tracé vectoriel point par point avec cotes éditables)
- Ajout d'obstacles (colonnes, îlots) et de portes
- Calepinage en temps réel selon le revêtement choisi (voir types de pose ci-dessous)
- Calcul automatique : surface nette, nombre de carreaux, surcote, liste de coupes
- Alertes intelligentes : chutes trop petites, asymétrie détectée
- Export PDF (plan coté + légende + liste de matériaux)
- Export CSV de la liste de matériaux

### Types de pose disponibles

**Carrelage / Grès cérame**
- Pose droite (0°)
- Pose diagonale (45°)
- Décalage ½ (brick)
- Décalage ⅓
- À l'anglaise (lés de largeurs alternées)
- Opus romain (4 formats mixés)

**Parquet**
- Pose droite
- Pose à 45°
- À l'anglaise
- Chevron (V simple)
- Point de Hongrie (chevron à 45°)
- Pont de bateau (décalage ⅓)

**Sol vinyle / LVT**
- Pose droite
- Pose à 45°
- Décalage ½
- Pose à joints décalés

**Moquette**
- Pose droite (lés dans le sens de la longueur)
- Pose en raccord (motifs à aligner)

---

## Stack technique

| Couche | Technologie |
|---|---|
| Frontend | Angular 22 |
| Calculs temps réel | Angular — Canvas API (frontend) |
| Génération PDF | Spring Boot (backend) |
| Tests frontend | Vitest |
| Backend | Spring Boot 3 / Java 17 |
| Tests backend | JUnit 5 + Mockito |
| Style | CSS natif + Canvas API |

---

## Prérequis

- Node.js ≥ 22
- Angular CLI ≥ 22 (`npm install -g @angular/cli`)
- Java 17+
- Maven 3.8+

---

## Installation

### Frontend

```bash
git clone https://github.com/RemyLansade/kalpy
cd kalpy/frontend
npm install
```

### Backend

```bash
cd kalpy/backend
mvn install
```

---

## Lancer l'application

### Backend (Spring Boot)

```bash
cd backend
mvn spring-boot:run
```

Le serveur démarre sur `http://localhost:8080`.

### Frontend (Angular)

```bash
cd frontend
ng serve
```

L'application est accessible sur `http://localhost:4200`.
Le proxy Angular redirige automatiquement les appels `/api/*` vers le backend.

---

## Tests

### Tests unitaires frontend

```bash
cd frontend
ng test
```

### Tests unitaires backend

```bash
cd backend
mvn test
```

### Tests end-to-end

```bash
cd frontend
ng e2e
```

---

## Structure du projet

```
kalpy/
├── GLOSSAIRE.md               # Lexique métier
├── CONTEXT.md                 # Contexte technique
├── todo.md                    # Plan d'implémentation
├── frontend/                  # Application Angular 22
│   ├── src/
│   │   ├── app/
│   │   │   ├── core/
│   │   │   │   └── models/    # Interfaces TypeScript (issues du glossaire)
│   │   │   ├── room/          # Module pièce (rect + forme libre)
│   │   │   ├── tiling/        # Module calepinage
│   │   │   ├── export/        # Module export PDF / CSV
│   │   │   └── shared/        # Composants réutilisables
│   │   └── environments/
│   └── proxy.conf.json
│
└── backend/                   # API Spring Boot
    └── src/
        └── main/java/
            └── com/kalpy/
                ├── controller/
                ├── service/
                └── model/
```

---

## Licence

Ce projet est distribué sous licence [MIT](LICENSE).

---

## Contribuer

Les contributions sont les bienvenues. Avant de soumettre une pull request :

1. Consulte le [`GLOSSAIRE.md`](GLOSSAIRE.md) — tout nouveau concept métier doit y être défini en premier
2. Ouvre une issue pour décrire le cas d'usage
3. Assure-toi que chaque nouveau code est accompagné de ses tests unitaires