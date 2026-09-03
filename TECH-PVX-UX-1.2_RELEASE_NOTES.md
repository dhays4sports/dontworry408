# TECH-PVX-UX-1.2

- Reworded the optional CoverageFit choice around the consumer’s actual decision: **Continue my CoverageFit Snapshot** or **Talk with Dylan instead**.
- The Dylan path now says exactly what is available before the visitor opens it: an exact callback time, an anytime callback, text, call, or no contact.
- Preserved the all-flow callback scheduler, `/home/` “Ask Dylan instead” path, submission-scoped fresh journey identifier, same-submission retry behavior, secure handoff, lead persistence, consent evidence, RingCentral SMS, and maintenance infrastructure.

Verification: `node --test tests/*.test.cjs` — 27 passed, 0 failed.
