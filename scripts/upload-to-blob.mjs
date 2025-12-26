#!/usr/bin/env node
import { put } from '@vercel/blob';
import { readFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

const BLOB_READ_WRITE_TOKEN = process.env.BLOB_READ_WRITE_TOKEN;

if (!BLOB_READ_WRITE_TOKEN) {
  console.error('Error: BLOB_READ_WRITE_TOKEN environment variable is required');
  console.error('Get your token from: https://vercel.com/docs/storage/vercel-blob/using-blob-sdk#generate-a-blob-read-write-token');
  process.exit(1);
}

async function uploadFile(filePath, blobPath) {
  console.log(`Uploading ${filePath} to ${blobPath}...`);

  const fileBuffer = readFileSync(filePath);
  const blob = await put(blobPath, fileBuffer, {
    access: 'public',
    token: BLOB_READ_WRITE_TOKEN,
  });

  console.log(`✓ Uploaded: ${blob.url}`);
  return blob.url;
}

async function uploadDirectory(dirPath, blobPrefix = '') {
  const urls = {};
  const files = readdirSync(dirPath);

  for (const file of files) {
    const filePath = join(dirPath, file);
    const stat = statSync(filePath);

    if (stat.isFile()) {
      const blobPath = blobPrefix ? `${blobPrefix}/${file}` : file;
      urls[file] = await uploadFile(filePath, blobPath);
    }
  }

  return urls;
}

async function main() {
  console.log('Starting upload to Vercel Blob...\n');

  const results = {
    demo: {},
    downloads: {}
  };

  // Upload demo video
  console.log('📹 Uploading demo video...');
  results.demo = await uploadDirectory('demo', 'demo');

  // Upload download files
  console.log('\n📦 Uploading download files...');
  results.downloads = await uploadDirectory('public/downloads', 'downloads');

  console.log('\n✅ All files uploaded successfully!\n');
  console.log('File URLs:');
  console.log(JSON.stringify(results, null, 2));

  console.log('\n📝 Next steps:');
  console.log('1. Copy the URLs above');
  console.log('2. Update lib/downloads.ts with the download URLs');
  console.log('3. Update app/page.tsx with the demo video URL');
}

main().catch((error) => {
  console.error('Upload failed:', error);
  process.exit(1);
});
