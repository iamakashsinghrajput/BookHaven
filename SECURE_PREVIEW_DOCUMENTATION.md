# Secure Preview System Documentation

## Overview

The Secure Preview System allows users to preview question papers before purchasing them, while implementing multiple security layers to prevent unauthorized downloads, screenshots, and screen recordings.

## 🔐 Security Features Implemented

### 1. **Anti-Screenshot Protection**
- Disables Print Screen key
- Prevents common screenshot shortcuts (Ctrl+Shift+S, etc.)
- Monitors for unusual performance delays that indicate screen capture
- Shows security violation warnings

### 2. **Anti-Screen Recording Protection**
- Detects window focus changes
- Automatically closes preview when window loses focus for >3 seconds
- Prevents Alt+Tab and Cmd+Tab window switching
- Monitors document visibility changes

### 3. **Download Prevention**
- Disables right-click context menu
- Prevents Save As (Ctrl+S) and Print (Ctrl+P)
- Blocks DevTools access (F12, Ctrl+Shift+I, etc.)
- Disables text selection and copying
- Sets iframe with restricted sandbox permissions

### 4. **Visual Security Measures**
- Watermarks overlaid on content ("PREVIEW ONLY • MY LIBRARY APP")
- Semi-transparent anti-screenshot pattern overlay
- Limited preview content (only sample questions)
- "Preview Only" badges and notices

### 5. **Server-Side Security**
- Authentication required for all preview requests
- User email verification for preview access
- Time-limited preview sessions (5 minutes)
- Secure API endpoints with proper headers
- Request logging for monitoring

## 🏗️ System Architecture

```
User Request → Question Papers Page → Preview Button → Authentication Check
    ↓
SecurePreviewModal → /api/preview-paper → Verify User & Paper
    ↓
Generate Secure Preview URL → /api/secure-embed → Serve Protected Content
    ↓
Display with Security Measures → Monitor User Actions → Auto-Close on Violation
```

## 📁 Files Structure

```
src/
├── app/
│   ├── components/
│   │   └── SecurePreviewModal.tsx       # Main preview modal with security
│   ├── api/
│   │   ├── preview-paper/route.ts       # Preview request handler
│   │   └── secure-embed/route.ts        # Secure content serving
│   └── question-papers/page.tsx         # Updated with preview buttons
```

## 🎯 User Experience Flow

### 1. **Accessing Preview**
- User signs in to their account
- Clicks "Preview (Free)" button on any question paper
- System verifies authentication and paper availability

### 2. **Preview Modal Opens**
- Full-screen modal with security headers
- Sample content displayed with watermarks
- Security notice explaining restrictions
- Anti-screenshot measures activated

### 3. **Security Monitoring**
- Real-time monitoring of user actions
- Instant warnings for security violations
- Automatic closure on unauthorized attempts
- Performance monitoring for screen capture detection

### 4. **Call-to-Action**
- "Pay ₹10 & Download Full Paper" button
- Seamless transition from preview to payment
- Close preview option always available

## 🔧 Technical Implementation Details

### Security Headers Applied
```typescript
'X-Frame-Options': 'SAMEORIGIN'
'Content-Security-Policy': "default-src 'self'; script-src 'none'; object-src 'none';"
'X-Content-Type-Options': 'nosniff'
'Referrer-Policy': 'no-referrer'
'Cache-Control': 'no-cache, no-store, must-revalidate'
'Pragma': 'no-cache'
'Expires': '0'
```

### Event Listeners
- `contextmenu` - Disabled right-click
- `keydown` - Blocks screenshot/DevTools shortcuts
- `visibilitychange` - Detects window focus loss
- `selectstart` - Prevents text selection
- `blur` - Window blur detection

### CSS Security
```css
user-select: none;
-webkit-user-select: none;
-moz-user-select: none;
-ms-user-select: none;
pointer-events: none; /* For iframe content */
```

## 🚨 Security Violations Handling

### Detected Violations
1. **Right-click attempts**
2. **Keyboard shortcut usage**
3. **DevTools opening attempts**
4. **Window focus loss**
5. **Unusual performance patterns**

### Response Actions
1. **Warning Display** - Shows security violation notice
2. **Preview Closure** - Automatically closes after repeated violations
3. **Event Logging** - Server-side logging of security events
4. **User Notification** - Clear explanation of why preview closed

## 🧪 Testing Checklist

### Functional Testing
- [ ] Preview opens only for authenticated users
- [ ] Sample content displays correctly
- [ ] Watermarks are visible and positioned properly
- [ ] Payment button triggers correct flow
- [ ] Close button works properly

### Security Testing
- [ ] Right-click is disabled
- [ ] Print Screen doesn't work
- [ ] Ctrl+S (Save) is blocked
- [ ] Ctrl+P (Print) is blocked
- [ ] F12 (DevTools) is blocked
- [ ] Window switching closes preview
- [ ] Text selection is disabled
- [ ] Context menu is disabled

### Performance Testing
- [ ] Preview loads within 3 seconds
- [ ] Security monitoring doesn't impact performance
- [ ] Modal animations are smooth
- [ ] No memory leaks from event listeners

## 🔒 Security Considerations

### What's Protected
- ✅ Screenshot attempts via keyboard
- ✅ Print Screen functionality
- ✅ Right-click context menu
- ✅ Text selection and copying
- ✅ DevTools access
- ✅ Window switching during preview
- ✅ Basic screen recording detection

### Limitations
- ⚠️ Advanced screen recording software may still work
- ⚠️ Mobile screenshot gestures are harder to prevent
- ⚠️ Browser extensions can potentially bypass some restrictions
- ⚠️ Physical camera recording cannot be prevented

### Recommended Additional Security
1. **Server-side rendering** for more sensitive content
2. **Canvas-based content** instead of HTML/text
3. **WebRTC-based DRM** for high-security requirements
4. **Behavioral analysis** to detect suspicious patterns
5. **Device fingerprinting** for advanced monitoring

## 🚀 Deployment Considerations

### Production Setup
1. Monitor preview access logs for unusual patterns
2. Set up alerts for high-frequency security violations
3. Implement rate limiting for preview requests
4. Consider adding CAPTCHA for repeated violations

### Performance Optimization
1. Cache preview content when possible
2. Use CDN for static preview assets
3. Implement preview content pre-generation
4. Monitor server resources for preview generation

## 📊 Analytics & Monitoring

### Metrics to Track
- Preview access frequency
- Security violation counts
- Preview-to-purchase conversion rate
- User engagement time in preview
- Most previewed question papers

### Logging Format
```typescript
{
  timestamp: "2024-01-15T10:30:00Z",
  action: "preview_accessed",
  paperId: 123,
  userEmail: "user@example.com",
  securityViolation: false,
  violationType: null
}
```

## 🔧 Configuration Options

### Environment Variables
```env
# Preview session timeout (milliseconds)
PREVIEW_TIMEOUT=300000

# Maximum preview attempts per user per day
MAX_PREVIEW_ATTEMPTS=50

# Enable/disable security monitoring
SECURITY_MONITORING=true
```

### Feature Flags
- `WATERMARK_ENABLED`: Show/hide watermarks
- `SCREENSHOT_PROTECTION`: Enable/disable screenshot blocking
- `PERFORMANCE_MONITORING`: Monitor for screen capture
- `AUTO_CLOSE_ON_BLUR`: Close preview on window blur

This comprehensive security system provides multiple layers of protection while maintaining a good user experience and clear path to purchase.