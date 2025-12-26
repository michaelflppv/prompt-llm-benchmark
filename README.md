# Prompt LLM Bench - Website

Professional Next.js website for Prompt LLM Bench desktop downloads. Features a modern dark theme with teal accent colors and an intuitive download interface.

## Features

- **Enhanced Download Button**: Professional dropdown selector for different platforms (.dmg, .exe, .AppImage)
- **Auto Platform Detection**: Automatically detects user's OS and recommends the appropriate installer
- **Responsive Design**: Fully responsive layout that works on all devices
- **Dark Theme**: Modern dark color scheme with teal accent colors
- **Component Architecture**: Well-organized React components for maintainability
- **TypeScript**: Full TypeScript support for type safety

## Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Production

```bash
npm run build
npm run start
```

## Project Structure

```
prompt-llm-benchmark/
├── app/                      # Next.js App Router pages
│   ├── page.tsx             # Home page
│   ├── download/            # Download page
│   ├── layout.tsx           # Root layout
│   └── globals.css          # Global styles and design tokens
├── components/              # React components
│   ├── download/            # Download-specific components
│   │   ├── download-button.tsx    # Enhanced dropdown button
│   │   ├── download-panel.tsx     # Download panel with metadata
│   │   └── download-section.tsx   # Section wrapper
│   ├── layout/              # Layout components
│   │   ├── navbar.tsx       # Navigation bar
│   │   └── footer.tsx       # Footer
│   └── ui/                  # Reusable UI components
│       ├── button.tsx
│       ├── badge.tsx
│       ├── card.tsx
│       ├── section.tsx
│       └── ...
├── lib/                     # Utilities and data
│   ├── downloads.ts         # Download metadata and OS detection
│   └── cn.ts               # Class name utility
└── public/                  # Static files
    └── downloads/           # Installer files (served statically)

```

## Design Tokens

The design system is defined in `app/globals.css` with CSS custom properties:

### Colors
- **Background**: Pure black with subtle gradients
- **Surface**: Dark gray surfaces with transparency
- **Teal Accent** (`--teal-500`, `--teal-600`, `--teal-700`): Primary action colors
- **Border**: Subtle borders with transparency
- **Text**: White foreground with muted gray for secondary text

### Spacing & Layout
- Consistent spacing scale from `--space-xxs` to `--space-2xl`
- Border radius scale for consistent roundness
- Shadow system for depth and hierarchy

To customize the theme, modify the CSS variables in `app/globals.css` under `:root`.

## Download System

### Download Metadata

Download information is managed in `lib/downloads.ts`:

```typescript
export const downloads: Record<OSKey, DownloadOption> = {
  mac: {
    key: "mac",
    label: "macOS",
    fileName: "Prompt LLM Bench-0.1.0-arm64.dmg",
    href: "/downloads/Prompt%20LLM%20Bench-0.1.0-arm64.dmg",
    architecture: "Apple Silicon (ARM64)",
    requirements: "Requires macOS 13+",
    steps: [...]
  },
  // ... windows and linux
};
```

### Platform Detection

The `detectOS()` function automatically identifies the user's operating system from the User-Agent string and pre-selects the appropriate installer.

### Download Button Component

The enhanced download button (`components/download/download-button.tsx`) features:
- Split button design (download action + platform selector)
- Dropdown menu for switching platforms
- Keyboard navigation support
- Accessibility features (ARIA attributes)
- Teal color scheme matching the design

## Publishing New Releases

1. Update version in `lib/downloads.ts`:
   ```typescript
   export const releaseInfo = {
     version: "0.2.0",  // Update version
     ...
   };
   ```

2. Update download file paths and names:
   ```typescript
   mac: {
     fileName: "Prompt LLM Bench-0.2.0-arm64.dmg",
     href: "/downloads/Prompt%20LLM%20Bench-0.2.0-arm64.dmg",
     ...
   }
   ```

3. Place installer files in `public/downloads/`

4. Update checksums and signatures:
   - `public/downloads/checksums.txt`
   - `public/downloads/signatures.txt`

## Browser Support

- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)

## License

See parent project for license information.
