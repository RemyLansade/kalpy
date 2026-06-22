# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project state

Kalpy is a tiling/flooring layout planner (calepinage) for tilers, architects, and homeowners: model a room, configure a floor covering, and get a precise installation plan exportable to PDF, with automatic quantity/cut calculations and symmetry alerts. See `README.md` for the full feature list and supported laying patterns (tile, parquet, vinyl/LVT, carpet).

This is an early-stage scaffold: `frontend/` is a freshly generated Angular shell (no modules/components beyond the root `App` component yet) and `backend/` is a bare Spring Boot app (no controllers/services/entities yet). `todo.md` is the implementation plan — modules, services (`RoomService`, `TilingService`, `CanvasService`, `ExportService`), data models, and components — written before the code exists. Treat it as the design spec/roadmap, not as documentation of current code; check actual files before assuming something is implemented.

## Commands

### Frontend (Angular 22, in `frontend/`)
- `npm install` — install dependencies
- `ng serve` / `npm start` — dev server on `http://localhost:4200`
- `ng build` / `npm run build` — production build
- `ng test` / `npm test` — unit tests (Vitest, via `@angular/build:unit-test` builder)
- No e2e test runner is configured yet despite the `ng e2e` reference in `README.md`.

### Backend (Spring Boot 3 / Java 17, in `backend/`)
- `mvn install` — install dependencies / build
- `mvn spring-boot:run` — run the API on `http://localhost:8080`
- `mvn test` — run unit tests
- To run a single test class: `mvn test -Dtest=ClassName`

There is no Angular dev-server proxy file (`proxy.conf.json`) yet, even though `README.md` describes one redirecting `/api/*` to the backend — add it under `frontend/` when backend integration begins.

## Architecture

- **Frontend**: Angular standalone-component app (no NgModules — root `App` component in `frontend/src/app/app.ts` uses `imports: [...]` directly). Routing is configured via `provideRouter` in `frontend/src/app/app.config.ts` against `frontend/src/app/app.routes.ts` (currently empty). Styling is SCSS; the planned UI is built around an HTML5 Canvas for room drawing and live tiling preview (canvas logic, world↔canvas coordinate conversion, etc. — see `CanvasService` in `todo.md`).
- **Backend**: Standard Spring Boot layering planned as `controller/` → `service/` → `model/` under `com.kalpy.backend`. Lombok is on the classpath (annotation processor wired into both compile and test-compile in `backend/pom.xml`) — use it for model boilerplate. JPA + H2 (runtime/dev) + PostgreSQL (runtime/prod) are configured as dependencies; no entities or `application.properties`/`.yaml` profiles beyond the default `spring.application.name` exist yet.
- **Division of responsibilities** (per `README.md`): real-time tiling math and canvas rendering live in the Angular frontend; PDF generation is a backend responsibility (Spring Boot), with CSV export likely frontend-side.
- **Core domain concepts** (see `todo.md` for full interface shapes): a `Room` is either rectangular (width/length) or free-form (ordered `Point[]`, closable into a polygon, area via the shoelace formula), can contain `Obstacle`s and `Door`s, and is combined with a `TilingConfig` (tile size, joint size, pattern, origin, overcote %) to produce a `TilingResult` (net area, tile counts, per-wall `Cut`s, symmetry/waste `Alert`s).
