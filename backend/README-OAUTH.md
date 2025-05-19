# OAuth 2.0 Social Authentication Setup

This document provides instructions for setting up and using OAuth 2.0 social authentication with Google and LinkedIn in the Resume Builder application.

## Overview

We've implemented OAuth 2.0 authentication with the following providers:

- Google
- LinkedIn

This allows users to sign up and log in with their social accounts instead of creating a separate username and password.

## Setup Instructions

### 1. Create OAuth Credentials

#### Google OAuth Setup:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to "APIs & Services" > "Credentials"
4. Click "Create Credentials" > "OAuth client ID"
5. Select "Web application" as the application type
6. Add your authorized redirect URIs:
   - Development: `http://localhost:5000/api/auth/google/callback`
   - Production: `https://your-domain.com/api/auth/google/callback`
7. Note your Client ID and Client Secret

#### LinkedIn OAuth Setup:

1. Go to [LinkedIn Developer Portal](https://www.linkedin.com/developers/)
2. Create a new app
3. Configure the OAuth settings
4. Add your authorized redirect URIs:
   - Development: `http://localhost:5000/api/auth/linkedin/callback`
   - Production: `https://your-domain.com/api/auth/linkedin/callback`
5. Request the necessary permissions (`r_emailaddress`, `r_liteprofile`)
6. Note your Client ID and Client Secret

### 2. Configure Environment Variables

Add the following variables to your `.env` file:

```
# OAuth Configuration
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
LINKEDIN_CLIENT_ID=your_linkedin_client_id
LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret
```

### 3. Frontend Integration

Add social login buttons to your login and registration pages, pointing to the following endpoints:

- Google login: `GET /api/auth/google`
- LinkedIn login: `GET /api/auth/linkedin`

Example button implementation:

```jsx
<a href="http://localhost:5000/api/auth/google" className="google-login-button">
  Login with Google
</a>

<a href="http://localhost:5000/api/auth/linkedin" className="linkedin-login-button">
  Login with LinkedIn
</a>
```

## How It Works

1. User clicks on a social login button
2. They are redirected to the provider's authorization page
3. After authorizing the app, they are redirected back to the callback URL
4. The backend verifies the authentication and:
   - Creates a new user account if it's their first login
   - Links the social account to an existing account if the email matches
   - Logs them in and returns a JWT token
5. The frontend receives the token and stores it for authentication

## Account Linking

When a user signs in with a social account:

1. If the email from the social provider matches an existing user, their account is automatically linked
2. If it's a new email, a new user account is created
3. Users can link additional social accounts later (feature to be implemented)

## Security Considerations

- All OAuth redirects happen server-side
- We store only the necessary user information from social providers
- Tokens from social providers are not stored, only user IDs
- JWT tokens issued by our system follow secure practices with short expiration times

## Troubleshooting

- Ensure your redirect URIs exactly match what you've configured in the OAuth provider dashboards
- Check that all required environment variables are set
- Verify API scopes are properly configured to retrieve email addresses
- For development, use real domain names (via hosts file) instead of localhost if callbacks fail
