# 408-APPOINTMENT-FIRST-1.1 UI/UX polish

## Outcome

The appointment-first experience is now shorter, calmer, and easier to understand across 408FARMERS. Cold and flyer traffic sees one clear job: share a few useful basics, provide a first name and mobile number, and choose a callback time with Dylan.

## User-facing improvements

- Replaced numbered multi-step circles with a compact progress bar so the intake feels lighter.
- Set the expected website effort to about one minute and clarified that quote details wait for the conversation.
- Shortened headings, helper text, reassurance, and consent copy while preserving the required meaning.
- Added Dylan's photo, name, agency, and local-producer context beside the contact step.
- Kept Text Dylan and Call Dylan available as direct secondary choices.
- Increased tap-target and input sizing, prevented input zoom on mobile, and improved narrow-screen stacking.
- Rewrote `/snapshot/` as a scheduling entry page instead of promising the paused CoverageFit Snapshot experience.
- Updated the homepage and campaign pages to describe the same basics → callback → conversation path.
- Reworked fallback confirmation pages so a blocked calendar is recoverable without resubmitting the form.
- Suppressed the legacy life-application fields before enhancement so sensitive quote fields do not flash on screen.

## Included routes

- `/`
- `/home/` and `/home/qr/.../`
- `/auto-bundle/`
- `/buyer/`
- `/healthcare/`
- `/teachers/`
- `/engineers/`
- `/life/`
- `/tech/`
- `/snapshot/`
- `/contact/`

## Preserved systems

- Lead capture before the calendar opens
- D1 and Agent Workspace persistence
- Same-record appointment updates
- Formspree notification fallback
- RingCentral notifications and appointment messaging
- Consent evidence
- Secure 408FARMERS-to-CoverageFit handoff

No D1 migration or SQL console execution is required for this release.

## Verification

- 40 automated regression tests passed.
- 714 public local asset and link references were checked with no broken targets.
- No duplicate IDs or images missing alternate text were found.
- JavaScript syntax checks passed for the shared and `/tech/` appointment controllers.
