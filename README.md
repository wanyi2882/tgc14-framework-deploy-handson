# How to setup

1. Update database connections in `database.json`

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
CLOUDINARY_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
CLOUDINARY_UPLOAD_PRESET=
DB_DRIVER=mysql
DB_USER=foo
DB_PASSWORD=bar
DB_DATABASE=organic
DB_HOST=localhost
SESSION_SECRET_KEY=
STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
```
