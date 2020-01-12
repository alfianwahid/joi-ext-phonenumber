'use strict';

const Libphonenumber = require('google-libphonenumber');

const PhoneNumberUtil = Libphonenumber.PhoneNumberUtil.getInstance();
const supportedRegionCodes = PhoneNumberUtil.getSupportedRegions();

module.exports = (joi) => ({
    type: 'string',
    base: joi.string(),
    rules: {
        phoneNumber: {
            method(params) {

                params = joi.attempt(
                    params,
                    joi.object().keys({
                        defaultRegionCode: joi.string().valid(...supportedRegionCodes),
                        format: joi.string().valid('e164', 'international', 'national', 'rfc3966'),
                        strict: joi.boolean()
                    }).with('format', 'defaultRegionCode').default({ defaultRegionCode: 'US', strict: false }).min(1)
                );

                return this.$_addRule({ name: 'phoneNumber', args: { params } });
            },
            validate(value, helpers, args) {

                const params = { ...args.params };

                try {

                    const proto = PhoneNumberUtil.parse(value, params.defaultRegionCode);

                    if (params.strict && !PhoneNumberUtil.isValidNumber(proto)) {

                        return helpers.error('phoneNumber.notStrict', { regionCode: PhoneNumberUtil.getRegionCodeForNumber(proto) });
                    }

                    if (!helpers.prefs.convert || !params.format) {

                        return value;
                    }

                    const format = Libphonenumber.PhoneNumberFormat[params.format.toUpperCase()];

                    return PhoneNumberUtil.format(proto, format);

                }
                catch (e) {
                    return helpers.error('phoneNumber.invalid');
                }

            }
        }
    },
    messages: {
        'phoneNumber.invalid': '{{#label}} did not seem to be a phone number',
        'phoneNumber.notStrict': '{{#label}} does not match pattern of region code "{{#regionCode}}" phone number'
    }
});
