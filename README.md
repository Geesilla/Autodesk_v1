# Autodesk_v1
Autodesk Asset Manager


steps
1. run npm install 
3. create an .env file
3.1. add the below .env variables into the .env:
DATABASE_URL="postgresql://postgres:FlbhgPQcgteGUgMppLEIwtkhBuHuiSVE@trolley.proxy.rlwy.net:30348/railway"
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_Zmlyc3QtYW5jaG92eS00OC5jbGVyay5hY2NvdW50cy5kZXYk
CLERK_SECRET_KEY=sk_test_eybswIWmWRkbNdPRCoGuhzcwIEw8F8Xb2JDnPCj3ud
NEXT_PUBLIC_CLERK_SIGN_IN_FORCE_REDIRECT_URL=/authed/models
NEXT_PUBLIC_CLERK_SIGN_UP_FORCE_REDIRECT_URL=/authed/models
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="dtxkupktj"
NEXT_PUBLIC_CLOUDINARY_API_KEY="327212244767152"
CLOUDINARY_API_SECRET="-0gHnSEBiLinSYQN9vDkwc3SebE"
4. ensure the file has been saved
5. Run npx prisma generate
6. npx prisma db push
7. npm run dev
    
    

prisma commands
1. npx prisma db push (when changes are made and you need to sync with master db )
2. npx prisma migrate dev (when you want new versions of your db )
3. npx prisma generate
