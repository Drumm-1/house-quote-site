# InstantHomeBuyer Testing Guide

## 🚀 Quick Setup

1. **Start the application:**
   ```bash
   npm run dev
   ```

2. **Run the debug script:**
   ```bash
   node debug-app.js
   ```

3. **Open browser:** http://localhost:3000

## 🧪 Manual Testing Checklist

### 1. Landing Page (`/`)
- [ ] Page loads without errors
- [ ] Hero section displays correctly
- [ ] Navigation menu works
- [ ] "Get Started" button redirects to signup
- [ ] "Get Quote" button redirects to login (if not authenticated)

### 2. Authentication System

#### Signup Flow (`/auth/signup`)
- [ ] Email field shows real-time availability checking
- [ ] Password strength indicators work
- [ ] Email validation prevents existing emails
- [ ] Form validation works for all fields
- [ ] Successful signup shows "Check Your Email" message
- [ ] Error handling displays appropriate messages

**Test Cases:**
```
✅ Valid Email: test@example.com
❌ Existing Email: (use an email you've already registered)
✅ Strong Password: TestPassword123
❌ Weak Password: 123
```

#### Login Flow (`/auth/login`)
- [ ] Valid credentials log in successfully
- [ ] Invalid credentials show error message
- [ ] Unverified accounts are redirected to verification
- [ ] Password visibility toggle works
- [ ] Redirect after login works

#### Email Verification (`/auth/verify`)
- [ ] Verification page displays correctly
- [ ] Resend verification button works
- [ ] Verified users are redirected appropriately

### 3. Property Form (`/get-quote`)

#### Step 1: Address
- [ ] All address fields are required
- [ ] ZIP code validation works
- [ ] Form prevents submission with invalid data
- [ ] "Continue" button advances to step 2

**Test Data:**
```
Address: 123 Main Street
City: San Francisco
State: CA
ZIP: 94102
```

#### Step 2: Property Details
- [ ] Bedroom/bathroom dropdowns work
- [ ] Square footage accepts only numbers
- [ ] Year built validation (1800-current year)
- [ ] Property type selection works
- [ ] Lot size is optional
- [ ] Back button returns to step 1

**Test Data:**
```
Bedrooms: 3
Bathrooms: 2
Square Feet: 1500
Year Built: 1995
Property Type: Single Family Home
Lot Size: 0.25 acres
```

#### Step 3: Property Condition
- [ ] Condition selection is required
- [ ] Visual feedback for selected condition
- [ ] Additional notes are optional
- [ ] Info boxes appear based on selection

**Test Data:**
```
Condition: Good
Notes: Recently updated kitchen
```

#### Step 4: Contact Information
- [ ] Phone number formatting works
- [ ] Timeline selection is required
- [ ] Motivation field is optional
- [ ] Privacy notice is displayed
- [ ] Submit button shows loading state

**Test Data:**
```
Phone: (555) 123-4567
Timeline: Within 30 days
Motivation: Relocating for work
```

### 4. Form Submission
- [ ] Complete form submits successfully
- [ ] Loading state during submission
- [ ] Error handling for submission failures
- [ ] Redirect to quote results page
- [ ] Database records are created

### 5. Quote Results (`/quote-results`)
- [ ] Page loads with quote ID parameter
- [ ] Quote information displays correctly
- [ ] Property details are shown
- [ ] Contact information is available
- [ ] Download/share options work

### 6. Dashboard (`/dashboard`)
- [ ] User properties list displays
- [ ] Quote history is available
- [ ] Account information is shown
- [ ] Navigation to other pages works

### 7. Navigation & Routing
- [ ] Protected routes redirect unauthenticated users
- [ ] Header navigation works
- [ ] Footer links are functional
- [ ] Breadcrumbs work correctly

### 8. Responsive Design
- [ ] Mobile layout works (< 768px)
- [ ] Tablet layout works (768px - 1024px)
- [ ] Desktop layout works (> 1024px)
- [ ] Touch interactions work on mobile

### 9. Error Handling
- [ ] Network errors are handled gracefully
- [ ] Form validation errors are clear
- [ ] Database errors show user-friendly messages
- [ ] 404 pages work correctly

### 10. Performance
- [ ] Initial page load is fast (< 3 seconds)
- [ ] Form interactions are responsive
- [ ] Images load efficiently
- [ ] No console errors in production

## 🐛 Debugging Features

### Console Logging
The application includes comprehensive console logging:

- 🔐 Auth operations: Look for logs starting with "🔐 AuthProvider:" or "🔐 AuthContext:"
- 🛡️ Protected routes: Look for logs starting with "🛡️ ProtectedRoute:"
- 🏠 Form submission: Look for logs starting with "handleStep4Complete called"

### Browser Developer Tools
1. **Open DevTools:** F12 or Right-click → Inspect
2. **Console Tab:** Check for errors and debug logs
3. **Network Tab:** Monitor API calls to Supabase
4. **Application Tab:** Check localStorage and session storage

### Common Issues & Solutions

#### "Unknown error occurred"
- Check browser console for detailed error messages
- Run `node debug-app.js` to test database connectivity
- Verify environment variables in `.env.local`

#### Email not received
- Check spam folder
- Verify email configuration in Supabase dashboard
- Try resending verification email

#### Form submission fails
- Check user authentication status
- Verify all form steps are completed
- Check database permissions in Supabase

#### Page won't load
- Clear browser cache and cookies
- Check if development server is running
- Verify no port conflicts (try different port)

## 📊 Testing Scenarios

### Happy Path Testing
1. New user signs up → verifies email → submits property → receives quote
2. Existing user logs in → submits property → views dashboard
3. User navigates through all pages without errors

### Edge Case Testing
1. Submit form with missing data
2. Try to access protected pages without authentication
3. Submit form with invalid data types
4. Test with very long text inputs
5. Test with special characters in inputs

### Error Path Testing
1. Network disconnection during form submission
2. Invalid email formats
3. Weak passwords
4. Duplicate email registration
5. Database connection failures

## 📈 Success Criteria

✅ **All manual tests pass**
✅ **No console errors in normal usage**
✅ **Form submission completes successfully**
✅ **Email verification works**
✅ **Database records are created correctly**
✅ **Responsive design works on all devices**
✅ **Error handling is user-friendly**

## 🔧 Automated Testing

While this guide focuses on manual testing, you can also:
1. Run the debug script: `node debug-app.js`
2. Check database with: `node check-data.js`
3. Monitor logs during development

## 📝 Bug Reporting

When reporting bugs, include:
1. Steps to reproduce
2. Expected vs actual behavior
3. Browser and device information
4. Console error messages
5. Screenshots if applicable

## 🎯 Next Steps

After completing manual testing:
1. Set up automated testing with Jest/React Testing Library
2. Add end-to-end testing with Playwright
3. Implement monitoring and analytics
4. Set up CI/CD pipeline
5. Deploy to production with proper monitoring 