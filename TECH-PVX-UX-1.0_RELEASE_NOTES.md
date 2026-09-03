# TECH-PVX-UX-1.0

- Replaced the browser-durable CoverageFit bootstrap identifier with a submission-scoped identifier.
- A retry of the same handoff remains idempotent; a genuinely new submission receives a new CoverageFit journey.
- Preserved the secure POST handoff, lead checkpoint, consent evidence, lead relay, RingCentral behavior, and callback choices.
- Added regression coverage for fresh-versus-retry bootstrap behavior.
