
# purest
**purest** is build on top of [request][1], adding just the needed configuration to ensure working with each REST API provider in a consistent way

## Design Goals
- No syntax sugar
- Zero abstraction on top of the REST APIs - *reading provider's official documentation is sufficient*
- All provider's API calls should return data in the same way
- Each request is a separate instance - *purest is designed to be used with multiple accounts granted access to your application, that's why most of the parameters are passed to the request itself*

###### Syntax sugar is evil
- Syntax sugar means adding additional layer on top of what's already just an URL
- Makes reading providers's official API documentation insufficient
- Limits the module to only what's implemented
- Changes/additions needs to be done each time the provider does them
- Having multiple providers in an app each of which with its own API wrapper makes code inconsistent/hard to maintain
- Adding syntax sugar once means, you'll have to support it forever

## Obtaining Access Tokens
1. Login to the REST API provider with your account
2. Navigate to http://passport-oauth.herokuapp.com/
3. Click on the provider you wan't to get access tokens for
4. Follow the steps on the screen
5. Copy and save the generated access tokens somewhere *(they are **not** stored on the heroku's server)*

## Supported Providers
generate the list here

Can't find what you are searching for .. [add it](fork) or [make a request](issue tracker)

## API
Remember when I told you *"No syntax sugar"*. Well I lied. Here is what you should know.

```
// ctor
{
  consumerKey
  consumerSecret
  version
  api
}
```

```
{
    api: 'youtube', // when multiple apis under same domain/path
    upload: 'cat.jpg' // the name of the file that's being uploaded
}
```

  [1]: https://github.com/mikeal/request
  