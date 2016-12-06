Here is an example recipe to setup fody on Ubuntu 14.04LTS.

We are going to do the example with
the prototype checkticket.py backend based on hug.

### build fody

Do a production build of fody, which ends up in `dist`,
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

(Check checkticket.py that it will serve `/home/fody/www/index.html`.)


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
apt-get install python3-pip
pip3 install --upgrade pip setuptools

pip --version
# should be current (v>9.0.1) and for python 3.4
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


 * `ports.conf` make sure there is a `Listen` option for your port, e.g.
   ```Listen: 8000```.
 * move the `Directory` configuration of `sites-enabled/intelmq.conf` into
   the `Virtual` section of `000-default.conf`.

Add a new configuration starting from the existing, e.g. 001-fody.conf:
```apache
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

        WSGIDaemonProcess fody threads=15 maximum-requests=10000
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
