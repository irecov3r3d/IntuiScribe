## 2026-05-28 - TherapyChat Accessibility
**Learning:** In TherapyChat component, interactive elements like the Voice Selection `<select>` and Voice Toggle `<button>` were missing ARIA labels and clear focus indicators, which made them difficult for screen readers and keyboard users to navigate.
**Action:** Add `aria-label`s to all interactive icon-only or unlabeled elements and ensure `focus-visible` utility classes are present for keyboard focus.
