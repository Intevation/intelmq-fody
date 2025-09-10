### set version number

Use a version that conforms to semantic versioning 2.0.

Change the version number in the files:
`package.json`

Add new entries to:
 * `NEWS.md`
 * `debian/changelog`,
 e.g. by `dch --newversion 0.6.8`

and commit.

### tag version number
example for 0.4.3:
```sh
git tag -s 0.4.3
git push origin 0.4.3
```

And go to GitHub to create a release from the tag.

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
