### set version number

Use a version that conforms to semantic versioning 2.0.

Change it in the files:
`package.json`

Add new entry to:
`NEWS.md`
`debian/changelog`

and commit.

### tag version number
example for v0.4.3:
```sh
git tag v0.4.3
git push origin v0.4.3
```

### build
(whatever is necessary, see toplevel Readme)

### set dev number again
In the mentioned files above, to something like `0.4.4-dev`.
