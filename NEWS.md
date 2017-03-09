## 0.2.0 to 0.2.1-dev

### Upgrade
 * minor, technical:
   Make sure that the subpages are also directly routed by the HTTP server,
   for examples with hug like
   ```
   @hug.get(urls=['/', '/tickets', '/contacts', '/stats', '/settings', '/login'],
            output=hug.output_format.file)
   def root():
           return("/home/fody/www/index.html")
   ```

## 0.1.2 to 0.2.0

 * Accesses the contactdb\_api on the server now, so it must be installed
   for the /Contacts subpage to work (see installation instructions).
 * The configuration of the production HTTP server must be single-threaded
   to avoid write conflicts in the contactdb.


_Noting the important changes to fody.
MUST list necessary actions when upgrading._
