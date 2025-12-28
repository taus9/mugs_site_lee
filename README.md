## Mugs of Lee County

A small Go web application that mirrors the Lee County, FL public bookings feed. The server renders the home and booking pages, while lightweight JavaScript fetches booking, arrest, and charge data directly from the Sheriff public API.

### Features
- Recent booking grid with clickable arrest cards rendered from `/recent`
- Booking detail view with booking metadata and associated charges
- Graceful fallback UI with retry buttons when API calls fail
- Shared spinner/loader partial used across pages for consistent UX

### Requirements
- Go 1.25.4 or later
- Internet access to read data from https://www.sheriffleefl.org/public-api

### Getting Started
1. Install dependencies (standard library only).
2. Run the development server:

	```bash
	go run ./cmd/web
	```

3. Open http://localhost:8080 to view the site.

Provide `-addr` to change the listen address if needed:

```bash
go run ./cmd/web -addr=":9090"
```

### Project Structure
```
.
├── cmd/
│   └── web/
│       ├── arrests.go        # API client + view-model transforms for arrests
│       ├── charges.go        # API client + transforms for charge data
│       ├── handlers.go       # HTTP handlers for pages and JSON endpoints
│       ├── helpers.go        # Reusable HTTP error helpers
│       ├── main.go           # App wiring and server startup
│       └── routes.go         # Route registration
├── internal/                 # Reserved for future server-side packages
├── ui/
│   ├── html/
│   │   ├── pages/            # Page templates (home, booking)
│   │   └── partials/         # Shared template fragments (spinner)
│   ├── static/
│   │   ├── css/              # Global stylesheet(s)
│   │   ├── img/              # Logo + favicon assets
│   │   └── js/               # Client-side scripts (home grid, booking view)
│   └── ...
├── Dockerfile                # Container build instructions
├── fly.toml                  # Fly.io deployment config (if used)
├── go.mod                    # Module definition and Go version
└── LICENSE
```

### Deployment Notes
- Static assets are served from `/static` via `http.FileServer`.
- The app logs structured info/error messages to stdout/stderr.
- API calls time out after 10 seconds; retry UI informs users of transient errors.

### License
Released under the terms of the LICENSE file in this repository.
