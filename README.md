# joi-ext-phonenumber

#### Joi extension for phone number rules.

This uses [google-libphonenumber](https://github.com/ruimarinho/google-libphonenumber) for validation. An alternative Joi extension for phone number validation that support for Joi v17+ (node >= 12).

This is extended from `Joi.string()` base. So, the schema can constructed using `Joi.string().phoneNumber()`.

## Compatibility

- This requires Joi v17 or newer .
- This requires Node.js 12 or newer.

If you are unfamiliar with Joi, you should read [Joi Documentation and API](https://joi.dev/api/)

## Installation

```bash
$ npm install joi-ext-phonenumber --save
```

## Usage

```js
const Joi = require('joi');
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