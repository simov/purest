
# Change Log

## v4.0.2 (2022/03/12)
- **Fix:** Bump deps

## v4.0.1 (2021/03/15)
- **Change:** Update type definitions

## v4.0.0 (2021/02/08)
- **New:** Complete rewrite of the module

## v3.1.0 (2016/12/21)
- **New:** defer option

## v3.0.1 (2016/07/17)
- **Fix:** absolute url detection

## v3.0.0 (2016/07/17)
- **New:** [Breaking Changes](https://simov.gitbooks.io/purest/content/)
- **Change:** The `request` module is no longer an internal dependency of Purest, it should be installed separately and passed to Purest.
- **Change:** The provider's configuration is no longer part of the module, it should be installed separately and passed through the `config` option.
- **Change:** The `new` keyword is no longer used when creating a new provider instance.
- **Change:** The `api` constructor option is now called `alias`.
- **Change:** The `api` option for the *Basic API* is now also called `alias`.
- **Change:** By default the constructor now returns an instance of the *Chain API*.
- **Change:** The *Basic API* can be enabled explicitly through the `api: 'basic'` options of the constructor.
- **Change:** The `query()` method of the *Chain API* is no longer required to initiate the *Chain API*, use it only if you need to specify the path alias to use.
- **Change:** The Promise implementation have to be passed as dependency when initializing Purest.
- **Change:** The `debug` option is no longer available for the constructor.
- **Change:** The `defaults` options passed in the constructor are being extended in Purest instead of in request.
- **Change:** The default *Chain API* method aliases were removed, for example: post-update and so on.
- **Change:** The before hook methods and the `hooks` options in the constructor are no longer available.
- **Change:** Versions of Node below version 4.0 LTS are no longer supported.
- **Change:** - **Change:** Version 3.0 of Purest is licensed under the Apache 2.0 license.

## v2.0.1 (2016/03/02)
- **Fix:** support for Bluebird 3

## v2.0.0 (2015/08/06)
- **Fix:** before request hooks
- **Fix:** user defined method aliases
- **Fix:** support for Promises
- **Fix:** official support of 40+ more providers
- **Change:** renamed the *domain* path modifier to *subdomain*
- **Change:** removed the `__provider` key from the configuration

## v1.2.0 (2015/06/16)
- **Change:** the `refresh` method and config are no longer available - use the Query API instead
- **Change:** `__provider` and `__domain` meta keys are no longer required

## v1.0.0 (2014/06/23)
- Initial Release
