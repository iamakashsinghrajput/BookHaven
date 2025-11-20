# Deployment Notes

## File Upload 413 Error - RESOLVED ✓

### Problem
When deploying to Vercel, file uploads were failing with a **413 Payload Too Large** error, even though the same uploads worked fine on localhost.

### Root Cause
Vercel's serverless functions have a **4.5MB body size limit** for API routes on the Hobby and Pro plans. The app was configured to accept files up to 10MB, which exceeded this limit when deployed.

### Solution Implemented
Reduced the maximum file upload size from **10MB to 4MB** to stay within Vercel's limits.

### Files Changed

1. **src/app/api/upload-paper/route.ts**
   - Added `export const maxDuration = 60` for longer upload processing
   - Changed `MAX_FILE_SIZE` from 10MB to 4MB
   - Added documentation comments about Vercel limits

2. **src/app/components/UploadModal.tsx**
   - Updated client-side validation to match 4MB limit
   - Changed UI text from "max 10MB" to "max 4MB"
   - Updated error messages

3. **next.config.mjs**
   - Added Vercel Blob storage domain to image remotePatterns
   - Set `bodySizeLimit: '4mb'` for Server Actions

4. **vercel.json** (NEW)
   - Added function-specific timeout configuration
   - Set `maxDuration: 60` for the upload route

### Current File Size Limits

| File Type | Maximum Size | Reason |
|-----------|-------------|---------|
| PDF | 4MB | Vercel API route body limit |
| Images (JPG, PNG, GIF) | 4MB | Vercel API route body limit |

### If You Need Larger File Uploads

To support files larger than 4MB, you have two options:

#### Option 1: Upgrade Vercel Plan (Recommended for simplicity)
1. Upgrade to Vercel Pro plan
2. Contact Vercel support to request increased body size limits
3. Update `MAX_FILE_SIZE` in the code to your new limit

#### Option 2: Implement Client-Side Upload (Recommended for cost)
Use Vercel Blob's client-side upload feature with presigned URLs:

```typescript
// This bypasses API route limits by uploading directly from browser to Vercel Blob
import { upload } from '@vercel/blob/client';

const blob = await upload(file.name, file, {
  access: 'public',
  handleUploadUrl: '/api/upload-handler',
});
```

This approach allows files up to 500MB but requires code refactoring.

### Testing
- ✅ Files under 4MB upload successfully on production
- ✅ Files over 4MB show clear error message before upload attempt
- ✅ Mobile number is captured and saved with uploads
- ✅ Rewards are properly tracked

### Environment Variables Required
Make sure these are set in Vercel:
- `BLOB_READ_WRITE_TOKEN` - Vercel Blob storage token
- `MONGODB_URI` - Database connection
- `NEXTAUTH_SECRET` - NextAuth secret
- `NEXTAUTH_URL` - Production URL
- Other environment variables as needed

### Deployment Checklist
- [x] File size limits updated
- [x] Frontend validation matches backend
- [x] Vercel configuration added
- [x] Error messages are user-friendly
- [x] Dynamic rendering configured for all auth routes
- [x] Mobile number field added for rewards

## Additional Notes

The second error you saw in console:
```
Uncaught (in promise) Error: Could not establish connection. Receiving end does not exist.
```

This is from a browser extension (likely an ad blocker or developer tool) and does NOT affect your application's functionality. You can safely ignore it.
