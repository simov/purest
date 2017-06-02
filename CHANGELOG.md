
# Change Log

## v3.1.0 (2016/12/21)
- defer option

## v3.0.1 (2016/07/17)
- fix absolute url detection

## v3.0.0 (2016/07/17)

- [Breaking Changes](https://simov.gitbooks.io/purest/content/)
- The `request` module is no longer an internal dependency of Purest, it should be installed separately and passed to Purest.
- The provider's configuration is no longer part of the module, it should be installed separately and passed through the `config` option.
- The `new` keyword is no longer used when creating a new provider instance.
- The `api` constructor option is now called `alias`.
- The `api` option for the *Basic API* is now also called `alias`.
- By default the constructor now returns an instance of the *Chain API*.
- The *Basic API* should be enabled explicitly through the `api: 'basic'` options of the constructor.
- The `query()` method of the *Chain API* is no longer required to initiate the *Chain API*, use it only if you need to specify the path alias to use.
- The Promise implementation should be passed as dependency when initializing Purest.
- The `debug` option is no longer available for the constructor.
- The `defaults` options passed in the constructor are being extended in Purest instead of in request.
- The default *Chain API* method aliases were removed, for example: post-update and so on.
- The before hook methods and the `hooks` options in the constructor are no longer available.
- Versions of Node below version 4.0 LTS are no longer supported.
- Version 3.0 of Purest is licensed under the Apache 2.0 license.

## v2.0.1 (2016/03/02)

- `Fixed` support for Bluebird 3

## v2.0.0 (2015/08/06)

- `Added` before request hooks
- `Added` user defined method aliases
- `Added` support for Promises
- `Added` official support of 40+ more providers
- `Changed` renamed the *domain* path modifier to *subdomain*
- `Changed` removed the `__provider` key from the configuration

## v1.2.0 (2015/06/16)
- `Changed` the `refresh` method and config are no longer available - use the Query API instead
- `Changed` `__provider` and `__domain` meta keys are no longer required
