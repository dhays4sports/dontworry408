# TECH-PVX-UX-1.1

- Added exact callback-time scheduling to the shared CoverageFit “Finish for Now” result while retaining direct text and call actions.
- Kept the existing “Call me when available” and explicit “No contact right now” choices.
- Added the same callback, text, and call exit path to the `/home/` personalized payoff through “Ask Dylan instead.”
- Changed `/tech/` so a saved lead sees the optional CoverageFit continue-or-finish choice before any CoverageFit launch.
- Kept the existing callback scheduling on post-lead and life finish-later surfaces.
- Preserved the secure CoverageFit handoff, submission-scoped fresh journey behavior, lead persistence, consent evidence, RingCentral SMS, and maintenance infrastructure.
- CoverageFit receiver code is unchanged from the paired v3.20.216 build.

Verification: `node --test tests/*.test.cjs` — 27 passed, 0 failed.
