# SNAPSHOT-JOURNEY-1.0

## Outcome

- Replaces the public `/score/` experience with the honest, canonical `/snapshot/` entry.
- Permanently redirects legacy `/score/` requests to `/snapshot/`.
- Sets a clear promise: a quick, discovery-only CoverageFit Snapshot first; evidence-based Review Readiness only after current-policy details.
- Preserves the secure POST handoff and carries `snapshot` as the entry type.
- Adds an immediate “Talk with Dylan instead” path with browser callback scheduling, text, and call choices.
- Keeps callback choices available across the existing 408FARMERS finish-later surfaces.

## Data and operations

No D1 schema or SQL migration is required. Existing lead persistence, consent evidence, RingCentral handling, maintenance, and callback relay contracts remain in place.

## Deployment order

Deploy CoverageFit v3.20.218 first, then this 408FARMERS package.
