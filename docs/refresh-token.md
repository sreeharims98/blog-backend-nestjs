# Refresh Token Revocation & Rotation Flows

This document outlines the flows for refresh token revocation (during logout or user deactivation) and rotation (during token refresh).

## 1. Refresh Token Revocation Flow (Logout)

POST /auth/logout
↓
Extract Refresh Token from Request
↓
Hash Refresh Token (SHA-256)
↓
Update Refresh Token Record in Database (Set revokedAt = current time)
↓
Return Success Message ("Logged out successfully")

## 2. Refresh Token Rotation Flow (Refresh)

POST /auth/refresh
↓
Extract Refresh Token from Request
↓
Hash Refresh Token (SHA-256)
↓
Find Refresh Token in Database by Hash
↓
Verify Token (Not Revoked, Not Expired, User Active)
↓
Revoke Old Token in Database (Set revokedAt = current time)
↓
Generate New Access Token & Raw Refresh Token
↓
Hash New Refresh Token (SHA-256)
↓
Save New Hashed Refresh Token in Database (Expires in 30 days)
↓
Return Tokens ({ accessToken, refreshToken })

## 3. User Deactivation Revocation Flow

PATCH /users/:id/deactivate
↓
Deactivate User Account in Database (Set isActive = false)
↓
Revoke All Active Refresh Tokens for User (Set revokedAt = current time)
↓
Return Success Message ("User deactivated successfully")
