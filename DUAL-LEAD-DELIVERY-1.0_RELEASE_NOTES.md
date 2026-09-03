# 408FARMERS — DUAL-LEAD-DELIVERY-1.0

Every confirmed first-name and phone checkpoint now uses two complementary deliveries:

- CoverageFit D1 remains the primary durable lead record.
- Formspree receives the same bounded form submission for Dylan's immediate notification.
- If the Worker-side Formspree request fails after D1 succeeds, the non-success response activates the existing browser-direct Formspree fallback.
- If D1 is unavailable, Formspree remains the independent lead-capture fallback.

The existing consent evidence, secure CoverageFit handoff, AgencyZoom projection boundary, callback scheduling, RingCentral behavior, and all existing forms are preserved.

No D1 schema change or SQL migration is required.
