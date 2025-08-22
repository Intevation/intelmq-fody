## 0.9.6 to 0.11.0 (JSON Schema validation)

* ContactDB:
  * Search: allow pressing enter to start searching by ASN.
  * Better search result summary.
  * Validate all user input with JSON schema.
  * Scroll to new/updated orgcard and highlight it (#33).
  * Bulk import for IP addresses and FQDNs.
  * Validate FQDNs with Public Suffix Lists.
* Tests: add workflows for codespell, application build.

## 0.9.5 to 0.9.6 (ContactDB: Annotation improvements)

 * ContactDB:
   * in edit mode, make label column smaller
     so there's more space for the long values
     based on user-feedback
   * contacts: add missing form-control class to inputs
     of FQDN, National CERT and Network input fields
 * ContactDB OrgAnnotation:
   * annotations: use normal font size
     based on user-feedback, the font size should not be small but the
     default one
   * OrgAnnotations: Improve Expiry date for inhibitions
     * in view mode, make the container red if expired
     * in view mode display the expiry date, inside the block
     * in edit mode display the expiry date form below the inhibition form
     * in edit mode display hide the tag form (value == 'inhibition')
     * use days instead of months for relative dates
     * vertically align expiry trash icon
     * relativedate: set never if expires is empty
     * layout of tag/expiry form
       make them the same layout as all other forms with a col-4/8 layout
       and one line per input object
   * revert yar.lock to 0.9.4 version, because that didn't work with the production build

## 0.9.4 to 0.9.5 (ContactDB: Annotation expiry)

 * ContactDB OrgAnnotation:
   Add expiry input field, with quick selector
   Show expiry date for annotations
   add clear button
   do not load the annotation hints when not logged in
   placeholder tag: use current format "Whitelist:"
 * re-resolve packages with yarn
 * login: open dashboard to deliver a clean interface
   If the user accesses a sub-page, the frontend already tried to retrieve data from the backend without authentication, leading to errors.
   Clean the frontend, so the user sees a clean interface and the frontend loads the necessary data when switching to the requested page
 * Documentation
   add screenshots to readme
   doc: how to run tests

## 0.9.3 to 0.9.4

 * Added login and authorized requests.
 * Stats: During a search, do not show the result info-box.
 * Technical: Raise build dependencies to yarn>=1.22.5 and node>14.16.1.


## 0.9.2 to 0.9.3

 * Stats: Improve input for datetime query parameters, by using a datepicker
   and showing in which timezone the database will interpret the value.

### Upgrade
 * technical:
   Depends on fody-backend v>=0.9.0


## 0.9.1 to 0.9.2

 * Contacts: Fix regression from 0.9.0 in search limit, now 100 again.


## 0.9.0 to 0.9.1

 * Stats: If no tickets or events are found, show the info-box with a zero.


## 0.8.0 to 0.9.0

 * Show a diagnostic message, if a backend request fails in the places
  * Dashboard: in all three info boxes.
  * Tickets: Examine Ticket search field, events table and recipient info box.
  * Contacts: all searches, loading each org and when committing.
  * Stats: when getting subqueries, searching tickets/events and event table.
 * Contacts: trim leading and tailing spaces from org cidr input fields.
 * Stats: Don't allow to give the time interval parameters multiple times.

### Upgrade
 * technical:
   Recommends fody-backend v>=0.8.1


## 0.7.0 to 0.8.0

 * Stats: Remove hint for use of wildcards in queries as an updated
   fody-backend will add wildcards now automatically.
 * Tickets: Show the recipient group, if there is one
   in the `aggregate_identifier`.

### Upgrade
 * technical:
   Recommends fody-backend v>=0.8.0


## 0.6.8 to 0.7.0

 * Stats: Fix the event details' extended row to open always.
 * Technical maintenance: Update some javascript library dependencies.

### Upgrade
 * technical:
   Upgrade your build environment's nodejs to >= 12.14.1 LTS.


## 0.6.7 to 0.6.8

 * Stats: Improve display of event details in the extended row:
  * In extended row: If `mailgen_directives` and `mailgen_sent` fields exist,
    display them in a list-group at the bottom.
  * Enable better line breaks for the JSON output fields like `extra`.

### Upgrade
 * technical:
   Recommends fody-backend v>=0.7.0


## 0.6.6 to 0.6.7

 * Contacts: Tag search box will also display number of found `auto` entries.

### Upgrade
 * technical:
   Recommends fody-backend v>=0.6.4


## 0.6.5 to 0.6.6

 * Stats: Change display of subqueries to show the description.
 * Contacts: Add handling of email tags.


## 0.6.4 to 0.6.5

 * Contacts: Adds disabling and enabling of email addresses, including
   an accompanying search for disabled addresses.
 * Contacts: (minor) Fixes bookmarking for tags.

### Upgrade
 * technical:
   Depends on fody-backend v>=0.6.2.


## 0.6.3 to 0.6.4

 * Tickets: (minor) Improves details view of send out email:
   aligns values left.


## 0.6.2 to 0.6.3

 * Tickets: Improves details view of send out email: Removes display of
   `template_name`; centers table.


## 0.6.1 to 0.6.2

 * Tickets: Improves displaying details about a send out ticket. It shows
   more information in a small table now, including the `template_format`.
 * Tickets: Changes behaviour to always show up to 10,000 events. If there are
   more events, the ones with the lowest `events_id` will be shown.
 * Contacts: (minor) Improves input of integers to avoid the cursor jumping
   to the end if a digit is entered in the middle of a number for browsers
   that check the type correctly (e.g. Chromium).
 * Stats: (minor) Adds hints how to use the `_icontains` query conditions.

### Upgrade
 * technical:
   Depends on fody-backend v>=0.6.1.


## 0.6.0 to 0.6.1

 * Contacts: (minor) Improves input of integers to avoid showing a superfluous
   dot.


## 0.5.2 to 0.6.0

 * Tickets, Stats: Raises display limit from <10,000 to <=50,000 events.
   So tickets with a higher number of events can be displayed
   at the cost of more time for loading the data. A message is shown if
   events will not be shown because of the limit.
 * Contacts: Improves entering an ASN or the sector-id, by disallowing
   incremental changes to avoid accidental change by a mouse wheel event
   and more rigidly checking for a natural number.
 * Contacts: Sorts the list of otherAttributes by their keys when editing,
   which makes the order consistent with both display only and editing.


## 0.5.1 to 0.5.2

 * Stats: Makes csv export files directly parsable for libreoffice by adding
     an ISO 8601 column.
 * Tickets, Stats: Improves the events detail view by displaying
     the `extra` attribute.
 * Stats: (minor) Adds minutes to the hourly x-axis-label to be more common.
 * Contacts: (minor) Changes display of ASNs from "ASN1234" to "AS1234".

### Upgrade
 * technical:
   Recommends fody-backend v>=0.5.3 for Stats event details to fully work.


## 0.5.0 to 0.5.1

 * Contacts: Fixes tag search to repeat the search after a commit.
 * Contacts: (minor) Display comment in brackets (except for the organisation)
   to be more consistent.


## 0.4.3 to 0.5.0
 * Contacts: Adds search field for tags.
 * Contacts: Improves editing of annotation.tags, by offering the choice
     of commonly used tags loaded from the backend.
 * Adds a logo for fody.

### Upgrade
 * technical:
   Needs fody-backend v>=0.5.1


## 0.4.2 to 0.4.3
 * Contacts: Changes cidr search into one that searches cidr, IPs, domains
   and national certs.
 * Contacts: Limits the number of displayed search results
   (fixes https://github.com/Intevation/intelmq-fody/issues/51)


## 0.4.1 to 0.4.2
 * Contacts: Adds cidr search.
 * Contacts: Improves annotation handling and display:
   Inhibitions can now be edited and display nicer.
   Annotations can be added to ASNs.

### Upgrade
 * technical:
   Needs fody-backend v>=0.4.2.


## 0.2.1 to 0.4.1

TODO


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
