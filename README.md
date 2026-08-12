# Nikhil Javvaji — 3D motion portfolio

A single-page portfolio where the hero is a **live service topology** instead of decoration.
Nineteen services, thirty-five dependencies, and packets in flight — the graph reorganises
as you scroll: running system → career timeline → architecture tiers → convergence.

The Java backend is load-bearing. It owns the topology graph, the resume content, and a
Server-Sent Events stream that drives the throughput counter in the HUD. Change a node in
`PortfolioService.java` and the 3D scene changes with it.

```
portfolio/
├── backend/      Spring Boot 3.3 · Java 17 — content API + SSE throughput stream
└── frontend/     React 18 · Vite · React Three Fiber · Framer Motion
```

## Run it

**1 — Backend** (needs JDK 17+ and Maven 3.9+)

```bash
cd backend
mvn spring-boot:run
```

Serves on `http://localhost:8080`.

**2 — Frontend** (needs Node 18+)

```bash
cd frontend
npm install
npm run dev
```

Opens on `http://localhost:5173`. Vite proxies `/api` to Spring Boot, so both dev and
production use identical URLs.

If the API is down the site still renders — it falls back to `src/api/fallback.js` and the
HUD switches from `LIVE` to `CACHED`.

## API

| Method | Path | Returns |
| --- | --- | --- |
| GET | `/api/bootstrap` | Everything the page needs, in one request |
| GET | `/api/profile` | Name, title, contact, lede |
| GET | `/api/roles` | The four roles with their highlights |
| GET | `/api/skills` | Skills grouped by architecture tier |
| GET | `/api/metrics` | The four headline numbers |
| GET | `/api/topology` | Nodes + edges the WebGL scene renders |
| GET | `/api/throughput/stream` | SSE — one tick per second |
| GET | `/api/throughput` | Snapshot, for clients that can't hold SSE open |
| POST | `/api/contact` | Validated contact message, one per minute per IP |
| GET | `/actuator/health` | Liveness — used as the Render health check |

## How the scene works

`frontend/src/scene/layouts.js` defines four arrangements of the same nodes.
`System.jsx` interpolates between the two nearest ones based on scroll position, then writes
transforms straight into an `InstancedMesh` — nineteen services and nine hundred packets cost
three draw calls, not nine hundred. Edge and packet positions are recomputed each frame from
the same position array, so nothing drifts out of sync.

Interaction:
- **Hover a node** — the inspector names the service and what it does.
- **Hover a stack layer** — every node outside that tier dims in the graph above.
- **Move the cursor** — the whole graph parallaxes.
- **Scroll** — the layout re-forms.

`prefers-reduced-motion` drops the packet field and the node drift, and turns off smooth scrolling.

## Deploying

```bash
docker build -t portfolio .
docker run -p 8080:8080 portfolio     # whole site on http://localhost:8080
```

The Dockerfile builds the React app, copies `dist/` into the jar's static resources, and ships
one image — no CORS, one URL. `render.yaml` deploys exactly that as a free Render web service.

To split them instead: host `frontend/dist` on any static host, run the jar anywhere, then set
`VITE_API_BASE` on the frontend build and `PORTFOLIO_ALLOWED_ORIGINS` on the backend.

## Things worth changing first

- `PortfolioService.java` — all content lives here. Add projects as a fifth section.
- `layouts.js` — add a fifth stage if you add a section.
- `TIER_COLOR` / `ROLE_COLOR` — the palette is amber (hot path), mint (services),
  violet (batch), slate (data).
- Swap `ContactService`'s in-memory map for JPA or an SES send. The controller won't change.
