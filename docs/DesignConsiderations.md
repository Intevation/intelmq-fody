_Aim: Documenting a few technical design considerations._

#### Contacts Editing: a single commit request

Operators want to make changes to the contactdb
so that events get distributed better.

The current approach aims for changing the database while the
intelmq-cb-mailgen system is running. We do not want to stop
it for performance reasons and we want the updates to be effective
as soon as possible.

If some values are to be manually adjusted they may have to be changed
in several organisation-objects. For example deleting an ASN in one
organisation and adding it to another. Those changes have to happen
to the database within one transaction to that the status is consistent
before and after the change.

To avoid having to hold a state on the server, we therefore
transmitt all changes to the contactdb at once.
