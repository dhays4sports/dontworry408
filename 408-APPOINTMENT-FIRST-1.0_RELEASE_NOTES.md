# 408-APPOINTMENT-FIRST-1.0

## Outcome

All primary cold-traffic acquisition pages now use a short, appointment-first path. The public intake collects only campaign-relevant context, first name, mobile number, and explicit agency contact permission before opening CoverageFit's secure callback calendar.

## Included routes

- `/home/` and every `/home/qr/.../` flyer route
- `/auto-bundle/`
- `/buyer/`
- `/healthcare/`
- `/teachers/`
- `/engineers/`
- `/life/`
- `/tech/` remains on its already-short appointment path
- `/snapshot/` now sends its primary action into the short `/home/` appointment intake instead of launching a long assessment

The homepage primary CTA now enters `/home/#form` instead of starting a long CoverageFit assessment.
The contact page now offers scheduling alongside Text Dylan, Call Dylan, and email.

## Intake boundaries

- No date of birth, full legal name, street address, policy upload, driver-license data, VIN, or detailed household data is requested before booking.
- Buyer traffic supplies only closing timing and a five-digit property ZIP.
- Professional traffic supplies role, housing, review type, and reason.
- Life traffic supplies a protection goal and reason for looking now.
- Text Dylan and Call Dylan remain visible as secondary direct-contact options.

## Preserved systems

- Lead delivery is confirmed before navigation.
- D1/Agent Workspace persistence and same-record appointment updates remain in place.
- Formspree remains the notification/fallback delivery path.
- Consent evidence remains versioned and separate from automated marketing consent.
- The secure 408FARMERS-to-CoverageFit POST handoff is preserved.

No D1 migration is required for this release.
