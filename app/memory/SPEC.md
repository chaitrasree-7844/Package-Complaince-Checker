# Package Compliance Checker — Living Spec

## Purpose
Responsive SIH26034 hackathon prototype for package-label compliance assistance. It is not an official government portal and does not issue legally binding determinations.

## Data model
- `UserAccount`: local prototype account with full name, email, password, and account type (`normal` or `authorized`).
- `PackageRecord`: uploaded package metadata, local image/PDF preview information, and timestamps.
- `ComplianceResult`: backend-shaped analysis response containing package, returned status, score, summary, checks, violations, and analysis timestamp.
- `ComplianceCheck`: requirement, applicability, returned status, detected value, reason, and recommendation.
- `Violation`: title, severity, returned evidence, required information, recommendation, and optional image coordinates.

## Key flows
1. Signup stores a new user in localStorage and forwards the entered email to Login.
2. Login requires the selected account type and stores a local session.
3. Authenticated users enter Dashboard, Upload Package, Results, Reports, or Settings through the responsive sidebar.
4. Upload uses a focused “Scan a Product” experience, validates JPG/JPEG/PNG/PDF, preserves optional product metadata, stores package metadata locally, then navigates to Analysis.
5. Analysis visualizes five staged MOCKED lifecycle states (Image Received, OCR Extraction, Declaration Detection, Compliance Checking, Report Preparation) without fake percentages, then redirects to `/results/:analysisId` when the existing service completes.
6. Compliance Screening Result maps returned statuses to COMPLIANT, REQUIRES REVIEW, or POTENTIAL VIOLATION; it shows product evidence, returned declarations, inline reasons/recommendations, and image highlights only when coordinates exist.
7. Reports can select any stored result, print, share, or download a generated PDF summary.
8. Dashboard greeting uses the user's local time and refreshes automatically: Morning 00:00–11:59, Afternoon 12:00–16:59, Evening 17:00–18:59, Night 19:00–23:59.
9. Theme defaults to the device preference on first visit, can be toggled from the header or Settings, and persists in localStorage.
10. Header search finds navigation pages plus stored analyses by product or manufacturer; keyboard shortcut Cmd/Ctrl+K focuses it and selecting a match navigates to that page/result.
11. Header notifications list recent completed analyses, link to their results, and persist read/unread state in localStorage.

## Auth roles and login
Auth is intentionally localStorage-backed for the demo and replaceable via `src/services/mockAuthApi.ts`. The seeded normal-user demo login is documented in `memory/test_credentials.md`.

## Integration boundary
The frontend uses dedicated mock services under `src/services/`. UI components only render the typed response models; no OCR, score, violation, applicability, or legal-decision logic is implemented in the UI.