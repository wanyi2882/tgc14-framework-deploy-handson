# How to setup

1. Install all dependencies:
```
yarn install
```

2. Log into mysql client with `mysql -u root`

3. Create a new database user with the following commands
```
CREATE USER 'foo'@'%' IDENTIFIED WITH mysql_native_password BY 'bar';
grant all privileges on *.* to 'foo'@'%';

FLUSH PRIVILEGES;
```

4. Create a new database named `organic`

5. Exit mysql client (or open a new terminal)

6. Install nodemon with `npm install -g nodemon`

6. Add permission to run ./db-migrate.sh with `chmod +x ./db-migrate.sh

7. Install all node modules with `yarn install`

8. Run all migrations with `./db-migrate.sh up`

# Sample .env file
```
CLOUDINARY_NAME=dg6ci8nip
CLOUDINARY_API_KEY=798942815659624
CLOUDINARY_SECRET=TPsNMuDGTVva7lAkc7pFnZwcja0
CLOUDINARY_UPLOAD_PRESET=tgc14-uploads
DB_DRIVER=mysql
DB_USER=foo
DB_PASSWORD=bar
DB_DATABASE=organic
DB_HOST=localhost
SESSION_SECRET=qz6tamEGgnjrRPqC8BgYP5FORLWKu9K4
STRIPE_PUBLISHABLE_KEY=pk_test_cjZ0FuGOglBmUeCFc6ToHLr8
STRIPE_SECRET_KEY=sk_test_vgMxhrVz9VcFwa9SXemYtPZl
STRIPE_ENDPOINT_SECRET=whsec_RkfJ3EnLUv0ja7STRlhJj0KneWnjDre3
STRIPE_SUCCESS_URL=https://3000-chocolate-badger-q3jm8eid.ws-us18.gitpod.io/checkout/success
STRIPE_CANCEL_URL=https://3000-chocolate-badger-q3jm8eid.ws-us18.gitpod.io/checkout/cancel
TOKEN_SECRET=aI8qWqOn3xxqbuOvqtPZre7f9R2lmOJr
REFRESH_TOKEN_SECRET=fEFJsDi2kmRc6k6SEIvqzs3gdWNC6Bo9
```
