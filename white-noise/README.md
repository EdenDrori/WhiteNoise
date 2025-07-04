# White-Noice Landing Page

A modern, clean landing page for White-Noice's professional audio equipment leasing service. Built with Vue 3, Tailwind CSS, and vue-i18n.

## Features

- Clean, modern design inspired by Void Acoustics
- Responsive layout for all devices
- Bilingual support (English/Hebrew)
- Interactive product showcase
- Contact form for leasing inquiries
- Optimized performance and accessibility

## Tech Stack

- Vue 3 (Composition API)
- Tailwind CSS
- vue-i18n for translations
- Vite for build tooling

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

## Project Structure

```
white-noice/
├── src/
│   ├── App.vue           # Main application component
│   ├── main.js          # Application entry point
│   ├── index.css        # Tailwind CSS entry point
│   └── locales/         # Translation files
│       ├── en.json      # English translations
│       └── he.json      # Hebrew translations
├── index.html           # HTML entry point
├── package.json         # Project dependencies
├── vite.config.js       # Vite configuration
└── tailwind.config.js   # Tailwind CSS configuration
```

## Development

- The application uses Vue 3's Composition API with `<script setup>`
- Styling is done with Tailwind CSS utility classes
- Translations are managed through vue-i18n
- The layout is mobile-first and responsive

## License

© 2025 White-Nsice. All rights reserved. 