# @alloc/typebox

Fork of `@sinclair/typebox` with the following changes:

- Compiled to ESM only
- Removed `exports` field from package.json
- Pull requests
  - [#781](https://github.com/sinclairzx81/typebox/pull/781) fix: avoid Errors call for nested Encode/Decode
  - [#779](https://github.com/sinclairzx81/typebox/pull/779) fix: surface deepest error from failed union validation
  - [#777](https://github.com/sinclairzx81/typebox/pull/777) fix: rethrow TypeBoxError instead of creating a new one
