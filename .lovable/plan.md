

# Create a Printable PDF Page for the Methodology Document

## What We'll Build
A new route `/methodology` in the app that renders the keyword analysis methodology as a professionally styled, print-ready HTML page. The page will include a "Print / Save as PDF" button so you can easily export it.

## Implementation Details

### New Files

1. **`src/pages/Methodology.tsx`** - A dedicated page component that renders the full methodology content as styled HTML (not raw markdown). Includes:
   - Professional typography with clear headings hierarchy
   - Styled tables with borders and alternating row colors
   - Code blocks with background highlighting
   - A "Print as PDF" button at the top
   - Print-optimized CSS (`@media print`) that hides the button and navigation, and ensures clean page breaks

2. **Route in `src/App.tsx`** - Add `/methodology` route pointing to the new page

### Design
- Clean white background with readable fonts
- Tables styled with borders and padding
- Code formulas in monospace blocks with gray background
- Numbered sections with clear visual hierarchy
- Print styles that produce a clean A4-friendly PDF
- No app navigation/sidebar - standalone document feel

### Content Sections (from the current document)
1. DataForSEO Terminology note
2. Keyword Base Data table
3. Competition Mapping
4. Analysis Categories (Domain Power, Backlinks Power, Page Power) with formulas
5. Final Difficulty Score formula
6. Difficulty Labels table
7. Recommended Site Type table
8. API Endpoints Reference table
9. Data Flow diagram

### How to Use
1. Navigate to `/methodology` in the app
2. Click "Print / Save as PDF" button
3. In the print dialog, select "Save as PDF" as the destination
4. Save the file

