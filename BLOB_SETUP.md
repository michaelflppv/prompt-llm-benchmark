# Vercel Blob Setup

## Steps to Upload Files

### 1. Generate Blob Token

1. Go to your Vercel project dashboard
2. Navigate to **Storage** → **Blob**
3. Click **Create Blob Store** (if you haven't already)
4. Go to **Settings** → **Tokens**
5. Click **Generate Token** and select **Read & Write** permissions
6. Copy the token

### 2. Set Environment Variable

```bash
export BLOB_READ_WRITE_TOKEN="your_token_here"
```

### 3. Upload Files

```bash
npm run upload-blob
```

This will upload:
- `demo/demo_video.MOV` → Vercel Blob
- All files in `public/downloads/` → Vercel Blob

### 4. Update Code with URLs

After upload completes, the script will output URLs. Update these files:

**lib/downloads.ts** - Replace `href` values with blob URLs:
```typescript
mac: {
  // ...
  href: "https://your-blob-url.vercel-storage.com/downloads/...",
  // ...
}
```

**app/page.tsx** - Replace demo video source:
```tsx
<source src="https://your-blob-url.vercel-storage.com/demo/demo_video.MOV" type="video/quicktime" />
```

### 5. Commit and Deploy

```bash
git add lib/downloads.ts app/page.tsx
git commit -m "Update file URLs to use Vercel Blob"
git push
```

## Alternative: Manual Upload

You can also upload files via Vercel dashboard:
1. Go to **Storage** → **Blob**
2. Click **Upload**
3. Select files to upload
4. Copy the generated URLs and update the code
