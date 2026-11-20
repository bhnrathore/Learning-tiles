# Independent Design And Release Checklist

## Status

Functional prototype, not an IP opinion or commercial release approval. A new colour scheme, AI-generated reference, different checking picture, or unregistered product name does not establish non-infringement. No patent, trademark, registered-design, or product-comparison clearance search has been completed.

## Design Decisions

- User requirement: exactly twelve circular numbered counters at every age level.
- The supplied AI-generated image guided discussion of tactile counters and a tray only. It is not shipped, traced, cropped into assets, or used as a background. Its generation terms and provenance have not been independently verified.
- New question-focused screen composition, subject navigation, original counter and recess styling, responsive four-column or three-column answer layout, and no physical hinge or flip-over tray recreation.
- Answers are evaluated by a stable-ID, one-to-one mapping. Correctness is independent of illustration, tile orientation, responsive order, and any original product's checking method.
- Original twelve-fragment garden illustration reveals only correct matches. An incorrect board cannot receive the completed image or success state. A complete image is not the evaluator.
- No reproduction of branded worksheets, instructions, original product exercise collections, or marketing claims of compatibility/affiliation.
- "Learning Tiles" is a provisional working name, not a cleared trademark. Do not publish commercially under this or the reference image's name without appropriate clearance.

## Asset Provenance

| Asset                     | Origin                                       | Distribution / Review                                                                                   |
| ------------------------- | -------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| Garden mosaic             | Original SVG authored for this project       | `public/assets/garden-mosaic.svg`; no external bitmap or reference-image pixels                         |
| Square mark               | Original geometric prototype mark            | `public/assets/mark.svg`; final branding and similarity review pending                                  |
| Culture illustrations     | Original in-code SVGs, except the train icon | `src/components/LearningVisual.tsx`; adult/editorial review pending                                     |
| Train and interface icons | Lucide                                       | ISC; upstream licence bundled and viewable in Grown-ups' corner                                         |
| Nunito and Fraunces       | Fontsource packages                          | SIL Open Font License; fonts hosted locally, upstream notices bundled and viewable in Grown-ups' corner |
| Reference JPEG            | User supplied; user reports AI generation    | Discussion-only, deliberately outside `public` and imports; not in `dist`                               |
| Exercises                 | Authored for this prototype                  | Nine sets of twelve pairs; no copied worksheets or generated-at-runtime content                         |

Package dependencies retain their respective upstream licences. Review the dependency inventory and notices for any future additions or distribution changes.

## Content Review

Maths and letter lessons use elementary facts and independently phrased questions. India activities depict everyday objects, a small selection of cultural objects, monuments, a tree, fruit, and animals; these are not presented as an exhaustive account of India's cultures or as official national symbols. The activity "Places & stories" is introductory culture/history vocabulary, not a history curriculum. The spinning-wheel question refers to Gandhi's documented use of spinning, not the invention of the wheel.

Background starting points, not endorsements or a completed fact-check:

- Ministry of Tourism, Incredible India: https://www.incredibleindia.gov.in/
- Archaeological Survey of India: https://asi.nic.in/
- Gandhi Heritage Portal: https://www.gandhiheritageportal.org/

Before release, an educator should check all 108 prompt-answer pairs, reading level, twelve-tile workload for ages 3-4, clarity of images, monument depiction, and cultural inclusivity. Counting to twelve may exceed some younger learners' readiness. Source pages supporting the historical and cultural wording should be recorded with retrieval dates after editorial verification. Do not equate stories or folklore with documented history. Future religious/festival content requires inclusive treatment and review.

## Commercial Release Gates In India

- [ ] Compare the final interaction, tray/counter appearance, checking system, and overall presentation against relevant products with an India-qualified IP professional.
- [ ] Review copyright, trademarks/passing off, applicable registered designs, and any relevant patent claims separately. Investigate territorial scope, validity and current status; do not assume any right has expired.
- [ ] Search and clear the final name, logo, domains, and store listing. Do not use the inspiration product's marks, or the reference image's proposed name, in branding or imply affiliation.
- [ ] Confirm rights and notices for every shipped asset; preserve commissioning/generation records where applicable.
- [ ] Complete educational/content review and targeted primary-source verification.
- [ ] Review applicable Indian child-data requirements and infrastructure data flows, including server logs. Local-only application storage is not a blanket legal exemption.
- [ ] Test real iPadOS/Safari and Android tablets, assistive technology, contrast, motor accessibility, and usability with supervised age-appropriate participants.
- [ ] Add commerce, accounts, or analytics only as a separate reviewed scope with appropriate privacy and security design.

Official starting point for Indian IP resources: https://ipindia.gov.in/. No legal guarantee is made by this checklist or the software.
