# Email Verification Flows

This document outlines the flows for email verification during user registration, verification, login attempts, and resending verification links.

## 1. Registration Flow

POST /auth/register
↓
Create User (Set isEmailVerified = false)
↓
Generate Cryptographically Secure Random Token (32 bytes)
↓
Hash Token (SHA-256)
↓
Save Hashed Token in Database (Expires in 24 hours)
↓
Send Verification Email with Raw Token in Link
↓
Return Success Message ("Registration successful. Please check your email...")

## 2. Verification Flow

POST /auth/verify-email?token=rawToken
↓
Extract Raw Token from Query Parameter
↓
Hash Token (SHA-256)
↓
Find Verification Token in Database by Hash
↓
Verify Token (Not Expired)
↓
Mark User as Verified in Database (Set isEmailVerified = true, emailVerifiedAt = current time)
↓
Delete Verification Token from Database (Single-use)
↓
Return Success Message ("Email verified successfully")

## 3. Login Flow

POST /auth/login
↓
Find User in Database by Email
↓
Verify Password
↓
Check User Email Verification Status (isEmailVerified)
↓
If Unverified: Return 403 Forbidden ("Please verify your email before logging in")
↓
If Verified: Generate Access Token & Refresh Token
↓
Hash Refresh Token & Save in Database
↓
Return Tokens ({ accessToken, refreshToken })

## 4. Resend Verification Flow

POST /auth/resend-verification
↓
Extract Email from Request
↓
Find User in Database by Email
↓
Check if User is Unverified (isEmailVerified = false)
↓
If User Exists and is Unverified:

- Generate Cryptographically Secure Random Token (32 bytes)
- Hash Token (SHA-256)
- Save Hashed Token in Database (Expires in 24 hours)
- Send Verification Email with Raw Token in Link
  ↓
  Return Generic Success Message ("If that email exists and is unverified, a verification link has been sent")
