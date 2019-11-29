# joi-ext-phonenumber

#### Joi extension for phone number rules.

This uses [google-libphonenumber](https://github.com/ruimarinho/google-libphonenumber) for validation. An alternative Joi extension for phone number validation that support for Joi v16+.

This is extended from `Joi.string()` base. So, the schema can constructed using `Joi.string().phoneNumber()`.

## Compatibility

This requires Joi v16 or newer.
If you are unfamiliar with Joi, you should read [Joi Documentation and API](https://hapi.dev/family/joi/)

## Installation

```bash
$ npm install joi-ext-phonenumber --save
```

## Usage

```js
const Joi = require('@hapi/joi');
const customJoi = Joi.extend(require('joi-ext-phonenumber'));

const schema = customJoi.string().phoneNumber();

// or by options
const customSchema = customJoi.string().phoneNumber({
  defaultRegionCode: 'US',
  format: 'e164',
  strict: false
});
```

For more usage, check it out [test file](./test/index.js).