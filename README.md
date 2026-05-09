# Resumind

Resumind is a React Router resume review app that lets users upload a PDF resume, provide job details, and receive AI-assisted feedback for ATS readiness, tone, content, structure, and skills.

## Features

- PDF resume upload with drag-and-drop support
- First-page PDF preview generation using PDF.js
- Puter authentication, file storage, key-value storage, and AI feedback
- Resume dashboard with previous reviews
- Detailed review page with ATS suggestions and category breakdowns
- Light and dark mode
- Wipe Data page for clearing uploaded files and stored review records
- Responsive UI built with React, React Router, Tailwind CSS, and custom CSS tokens

## Tech Stack

- React 19
- React Router 7
- TypeScript
- Tailwind CSS
- Zustand
- Puter.js
- PDF.js
- Vite

## Author

Built by Elyse Joyeux.

## Project Structure

```text
app/
  components/        Reusable UI components
  lib/               Puter, PDF, and utility helpers
  routes/            React Router route screens
constants/           AI prompt and sample resume constants
public/assets/       Images, icons, PDF worker, and static assets
types/               Shared TypeScript declarations
```

## Getting Started

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open the app in your browser:

```text
http://localhost:5173
```

If another dev server is already using that port, React Router/Vite may use another port.

## Available Scripts

```bash
npm run dev
```

Runs the app locally with hot reload.

```bash
npm run typecheck
```

Generates React Router types and runs TypeScript checks.

```bash
npm run build
```

Creates a production build.

```bash
npm run start
```

Serves the built app.

## Main Routes

- `/` - Dashboard and resume history
- `/auth` - Puter login flow
- `/upload` - Resume upload and AI analysis
- `/resume/:id` - Detailed resume review
- `/wipe` - Clear stored app data

## Puter Integration

The app uses Puter for:

- Authentication
- File uploads and reads
- Key-value storage for resume review records
- AI chat feedback

The Puter script is loaded in `app/root.tsx`:

```html
<script src="https://js.puter.com/v2/"></script>
```

## PDF Worker

PDF conversion depends on `public/assets/pdf.worker.min.mjs`. This worker must match the installed `pdfjs-dist` package version. If PDF conversion fails with an API/worker mismatch, replace the public worker with:

```bash
copy node_modules\pdfjs-dist\build\pdf.worker.min.mjs public\assets\pdf.worker.min.mjs
```

On macOS/Linux:

```bash
cp node_modules/pdfjs-dist/build/pdf.worker.min.mjs public/assets/pdf.worker.min.mjs
```

## Data Reset

Use the Wipe Data page at `/wipe` to delete uploaded files and flush saved review records. The page asks for confirmation before clearing data.

## Docker

Build the image:

```bash
docker build -t resumind .
```

Run the container:

```bash
docker run -p 3000:3000 resumind
```

## Troubleshooting

If icons do not appear, confirm asset paths use `/assets/icons/...`.

If dark mode text is hard to read, avoid hard-coded classes like `text-black`, `bg-white`, and `text-gray-*` in shared UI. Prefer theme-aware classes such as `text-muted`, `review-card`, or CSS variables from `app/app.css`.

If upload redirects fail, run:

```bash
npm run typecheck
```

React Router route file casing matters. The route config should match the actual filenames.

## Copyright

Copyright © 2026 Resumind. All rights reserved.
