{
"email": "iamsreeharims@gmail.com",
"password": "sreeharims"
}

# migration

npx typeorm-ts-node-commonjs migration:generate .\db\migrations\AddEmailVerificationTokens -d .\db\data-source.ts
npx typeorm-ts-node-commonjs migration:run -d .\db\data-source.ts
