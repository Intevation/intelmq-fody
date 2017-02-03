Here is an example recipe to setup fody on Ubuntu 14.04LTS.

We are going to do the example with
the prototype checkticket.py backend based on hug.

### Preparation, install nodejs and yarn

```sh
# Confirming "trusty" is supported...
curl -sLf -o /dev/null 'https://deb.nodesource.com/node_6.x/dists/trusty/ReleaseX' && echo yes

## Adding the NodeSource and Yarn signing pubkeys to your system...
curl -sS https://deb.nodesource.com/gpgkey/nodesource.gpg.key | apt-key add -
curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -

## Creating apt sources list file for the NodeSource Node.js v6.x repo...
echo 'deb https://deb.nodesource.com/node_6.x trusty main' > /etc/apt/sources.list.d/nodesource.list
echo 'deb-src https://deb.nodesource.com/node_6.x trusty main' >> /etc/apt/sources.list.d/nodesource.list

## Creating apt sources list file for yarn...
echo "deb https://dl.yarnpkg.com/debian/ stable main" > /etc/apt/sources.list.d/yarn.list
```

#### installing nodejs, yarn
If you are using the [logbuch-tools from Intevation's adminton](https://hg.intevation.de/adminton/raw-file/tip/logbuch-tools/logbuch-installer) which helps you to write down administrative steps:
```sh
apt-install nodejs yarn
```
otherwise
```sh
apt-get update
apt-get install nodejs yarn
```

#### Check installed versions
```sh
nodejs -v
# testoutput v6.9.5
yarn --version
0.19.1
# testoutput 0.19.1
```

### build fody

Do a production build of fody (as indicate on the main fody documentation), which ends up in `dist`,
make sure that we are asking our own webserver before running the build:

```diff
--- a/src/components/dash/Tickets.vue
+++ b/src/components/dash/Tickets.vue
@@ -92 +92 @@ module.exports = {
-      queryURL: 'http://localhost:8000/',  // base url for AJAJ service
+      queryURL: '/',  // base url for AJAJ service
```

### separate user

We want an installation that is quite separated from the rest of the system:

```shell
#as root
adduser --disabled-password fody
```

Note: The user must have the right to read the mailgen configuration.

```shell
#as fody
git clone --depth 1 https://github.com/Intevation/intelmq-mailgen.git
mkdir wsgi
cd wsgi
ln -s ../intelmq-mailgen/extras/checkticket-spa/checkticket.py .
```

(Modify checkticket.py that it will serve `/home/fody/www/index.html`.)


Copy the build `dist` directory over and rename it to `www`:
```shell
mv dist www
```

#### installing hug
First follow the official way for
[installing Python Modules](https://docs.python.org/3/installing/index.html),
e.g.

```shell
#as root
apt-get install python3-pip python3.4-venv
```


```shell
#as fody
pyvenv-3.4 venv-hug

# enable system-site-packages later, so that pip gets always installed
# change line to  include-system-site-packages = true  with
vim venv-hug/pyvenv.cfg

source venv-hug/bin/activate

# (optionally) get current pip
pip3 install --upgrade pip setuptools

# pip should should now be current (v>9.0.1) and for python 3.4, check with
pip --version

pip install --upgrade hug
```


### Using Apache2
We reuse the apache2 installation which already has
some access control from the intelmq-manager setup.

```shell
#as root
apt-get install libapache2-mod-wsgi-py3
```

The configuration of apache happens in
```shell
pushd /etc/apache2
```


 * modify `ports.conf` make sure there is a `Listen` option for your port, e.g.
   ```Listen: 8000```.
 * move the `Directory` configuration of `sites-enabled/intelmq.conf` into
   the `Virtual` section of `000-default.conf`.

Add a new configuration starting from the existing, 
e.g. create ```site-available/001-fody.conf```:

```apache
WSGIPythonPath /home/fody/venv-hug/lib/python3.4/site-packages

<VirtualHost *:8000>
        ServerAdmin webmaster@localhost
        DocumentRoot /var/www/html

        Alias /static/ /home/fody/www/static/

        <Directory /home/fody/www>
            Options FollowSymLinks
            AuthType Basic
            AuthName IntelMQ
            AuthBasicProvider file
            AuthUserFile "/etc/intelmq-manager.htusers"
            Require valid-user
        </Directory>

        WSGIDaemonProcess fody python-path=/home/fody/venv-hug/lib/python3.4/site-packages threads=15 maximum-requests=10000
        WSGIScriptAlias / /home/fody/wsgi/checkticket.py
        WSGICallableObject __hug_wsgi__

        <Directory /home/fody/wsgi>
            Options FollowSymLinks
            AuthType Basic
            AuthName IntelMQ
            AuthBasicProvider file
            AuthUserFile "/etc/intelmq-manager.htusers"
            Require valid-user
        </Directory>

        ErrorLog ${APACHE_LOG_DIR}/fody-error.log
        CustomLog ${APACHE_LOG_DIR}/fody-access.log combined
</VirtualHost>
```

and then enable the side and trigger it with apache:
```sh
a2ensite 001-fody
service apache2 reload
```
