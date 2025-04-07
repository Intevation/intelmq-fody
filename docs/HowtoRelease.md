### set version number

Use a version that conforms to semantic versioning 2.0.

Change it in the files:
`package.json`

Add new entry to:
 * `NEWS.md`
 * `debian/changelog`,
 e.g. by `dch --newversion 0.6.8  --check-dirname-level 0 --distribution stable`

and commit.

### tag version number
example for v0.4.3:
```sh
git tag -s v0.4.3
git push origin v0.4.3
```

### build
(whatever is necessary, see toplevel Readme)

### set dev number again
In the mentioned files above, to something like `0.4.4-dev`.

## Build with cached dependencies (reproducible)

- Create a `.yarnrc` in the current directory with the following content:
  ```json
  {
      "yarn-offline-mirror": "./npm-packages-offline-cache",
      "yarn-offline-mirror-pruning": true
  }
  ```
- Delete existing packages: `rm -r yarn.lock node_modules/`
- Download the packages: `yarn install`
- All the required packages are in `./npm-packages-offline-cache/`
