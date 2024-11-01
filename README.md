# 🔒 Lockbox 🔒

A password protected dropbox where users given a password can upload a file. Comissioned by [@shibedrill](https://github.com/shibedrill).

## Installation

**1. Downloads**

First, download [`docker-compose.yml`](https://github.com/arithefirst/lockbox/blob/master/docker/docker-compose.yml) and [`init.sql`](https://github.com/arithefirst/lockbox/blob/master/docker/init.sql) from `/docker/`. This can be done with the below comamand.

```shell
wget https://raw.githubusercontent.com/arithefirst/lockbox/refs/heads/master/docker/docker-compose.yml && \
wget https://raw.githubusercontent.com/arithefirst/lockbox/refs/heads/master/docker/init.sql
```

> [!IMPORTANT]  
> [`init.sql`](https://github.com/arithefirst/lockbox/blob/master/docker/init.sql) is **required** for the application to work properly. It sets up the relations and inital admin credentials in PostgreSQL

**2. Start the Docker Compose stack**

Use vim or your favorite text editor to edit `docker-compose.yml`. Look for the line with the comment `# Your URL Goes Here (Default is localhost:3000)` and replace `http://localhost:3000` with the URI of your server. Then, run `docker-compose up -d` to start the stack. This will pull arithefirst/lockbox:latest and postgres:latest from Dockerhub and run them locally.

**3. Accessing the server**

Now that the Docker Compose stack is running, you can access the server from your browser at `http://IP_ADDR`, where `IP_ADDR` is the URI of the server that you are running the stack on (This should be the same URI that you set in Step 2).

> [!IMPORTANT]
> If you are not accessing the site at localhost, you must have a valid SSL certificate setup, as the site cookies are set to secure mode and you will not be able to log into the admin dashboard without them.

## Usage

Throughout the usage section, assume `IP_ADDR` is the IP or domain of the server that you are running your stack on

### Uploading a File

To upload a file, go to `http://IP_ADDR:3000/` and enter the password given to you by the server's administrator. Then select a file using the `Browse...` button and click `Submit` to upload your file.

### Accessing the Admin Dashboard

To access the Admin Dashboard, go to `http://IP_ADDR:3000/admin`. If you are not logged in, you will be re-directed to `http://IP_ADDR:3000/admin/login`, where you can enter your admin credentials. If this is your first time logging into the dashboard, your username will be `admin` and your password will be `changeme`

### Creating a Password

To create a password, [Open the Admin Dashboard](#accessing-the-admin-dashboard), and find the password creation section. Once you find it, enter the desired password in the `Password` field, and the maximum amount of uses the password should have in the `Max Uses` field. Then click the `Add Password` button to add the new password to the database.

### Creating a New Admin

To create a new admin account, [Open the Admin Dashboard](#accessing-the-admin-dashboard), and find the account creation section. Once you find it, enter the desired username in the `Username` field, and the password in the `Password` field. Then click the `Add Admin` button to add the new user to the database.

### Accessing Uploads

To access uploads from a specific password, [Open the Admin Dashboard](#accessing-the-admin-dashboard), and look at the table to the left. There you will find the passwords table, which will contain every valid password. The table should display the password name, max uses, times used, and files uploaded for each password. The `Uploads` Column can be in one of three states.

1. **"No Uploads Yet!"**<br>
   The "No Uploads Yet!" status means exactly what it seems, that password has not been used to upload a file yet.
2. **Some random filename**<br>
   If you see a single filename, it means the password has only uploaded one file. In order to view/download it, click on it.
3. **"Click to reveal"**<br>
   If you see "Click to reveal", it means that that password has been uploaded 2 or more times. Click the button to get a dropdown of all the files. Each entry can be clicked to view/download the file.
