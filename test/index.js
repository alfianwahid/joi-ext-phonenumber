'use strict';

const Code = require('@hapi/code');
const Joi = require('@hapi/joi');
const Lab = require('@hapi/lab');
const JoiExtPhoneNumber = require('..');

const { describe, it } = exports.lab = Lab.script();
const expect = Code.expect;


describe('joi-ext-phonenumber', () => {

    const customJoi = Joi.extend(JoiExtPhoneNumber);

    it('constructor arguments', () => {

        expect(() => customJoi.string().phoneNumber()).to.not.throw();
        expect(() => customJoi.string().phoneNumber({})).to.throw('"value" must have at least 1 key');
        expect(() => customJoi.string().phoneNumber({ format: 'e164' })).to.throw('"format" missing required peer "defaultRegionCode"');
        expect(() => customJoi.string().phoneNumber({ defaultRegionCode: 'invalid-code' })).to.throw('"defaultRegionCode" must be one of [AC, AD, AE, AF, AG, AI, AL, AM, AO, AR, AS, AT, AU, AW, AX, AZ, BA, BB, BD, BE, BF, BG, BH, BI, BJ, BL, BM, BN, BO, BQ, BR, BS, BT, BW, BY, BZ, CA, CC, CD, CF, CG, CH, CI, CK, CL, CM, CN, CO, CR, CU, CV, CW, CX, CY, CZ, DE, DJ, DK, DM, DO, DZ, EC, EE, EG, EH, ER, ES, ET, FI, FJ, FK, FM, FO, FR, GA, GB, GD, GE, GF, GG, GH, GI, GL, GM, GN, GP, GQ, GR, GT, GU, GW, GY, HK, HN, HR, HT, HU, ID, IE, IL, IM, IN, IO, IQ, IR, IS, IT, JE, JM, JO, JP, KE, KG, KH, KI, KM, KN, KP, KR, KW, KY, KZ, LA, LB, LC, LI, LK, LR, LS, LT, LU, LV, LY, MA, MC, MD, ME, MF, MG, MH, MK, ML, MM, MN, MO, MP, MQ, MR, MS, MT, MU, MV, MW, MX, MY, MZ, NA, NC, NE, NF, NG, NI, NL, NO, NP, NR, NU, NZ, OM, PA, PE, PF, PG, PH, PK, PL, PM, PR, PS, PT, PW, PY, QA, RE, RO, RS, RU, RW, SA, SB, SC, SD, SE, SG, SH, SI, SJ, SK, SL, SM, SN, SO, SR, SS, ST, SV, SX, SY, SZ, TA, TC, TD, TG, TH, TJ, TK, TL, TM, TN, TO, TR, TT, TV, TW, TZ, UA, UG, US, UY, UZ, VA, VC, VE, VG, VI, VN, VU, WF, WS, XK, YE, YT, ZA, ZM, ZW]');
        expect(() => customJoi.string().phoneNumber({ defaultRegionCode: 'US', format: 'e164' })).to.not.throw();
    });

    it('allows undefined, deny empty string and null', () => {

        const schema = customJoi.string().phoneNumber();

        expect(schema.validate().error).to.not.exist();
        expect(schema.validate(undefined)).to.equal({ value: undefined });
        expect(schema.validate(undefined).error).to.not.exist();
        expect(schema.validate(null).error).to.be.an.error('"value" must be a string');
        expect(schema.validate('').error).to.be.an.error('"value" is not allowed to be empty');
    });

    it('fails on integer', () => {

        const schema = customJoi.string().phoneNumber();

        expect(schema.validate(8).error).to.be.an.error('"value" must be a string');
    });

    it('fails on bad phone number string', () => {

        const schema = customJoi.string().phoneNumber();

        expect(schema.validate('8').error).to.be.an.error('"value" did not seem to be a phone number');
    });

    it('success on good phone number string', () => {

        const schema = customJoi.string().phoneNumber();

        expect(schema.validate('888888888').error).to.not.exist();
        expect(schema.validate('888888888')).to.equal({ value: '888888888' });
    });

    it('validates with specific region', () => {

        const schema = customJoi.string().phoneNumber({ defaultRegionCode: 'ID' });

        expect(schema.validate('888888888', { convert: false })).to.equal({ value: '888888888' });
    });

    it('validates specific region with strict mode', () => {

        const schema = customJoi.string().phoneNumber({ defaultRegionCode: 'ID', strict: true });

        expect(schema.validate('888888888')).to.equal({ value: '888888888' });
    });

    it('fails specific region with strict mode', () => {

        const schema = customJoi.string().phoneNumber({ defaultRegionCode: 'ID', strict: true });

        expect(schema.validate('8888888').error).to.be.an.error('"value" does not match pattern of region code "ID" phone number');
    });

    it('several formatted output with specific region', () => {

        expect(customJoi.string().phoneNumber({ defaultRegionCode: 'ID', format: 'e164' }).validate('888888888')).to.equal({ value: '+62888888888' });
        expect(customJoi.string().phoneNumber({ defaultRegionCode: 'ID', format: 'international' }).validate('888888888')).to.equal({ value: '+62 888-888-888' });
        expect(customJoi.string().phoneNumber({ defaultRegionCode: 'ID', format: 'national' }).validate('888888888')).to.equal({ value: '0888-888-888' });
        expect(customJoi.string().phoneNumber({ defaultRegionCode: 'ID', format: 'rfc3966' }).validate('888888888')).to.equal({ value: 'tel:+62-888-888-888' });
    });

    it('several formatted input', () => {

        // e164, international, rfc3966 formatted input does not depend on defaultRegionCode
        expect(customJoi.string().phoneNumber({ defaultRegionCode: 'US', format: 'e164' }).validate('+65888888888')).to.equal({ value: '+65888888888' });
        expect(customJoi.string().phoneNumber({ defaultRegionCode: 'SG', format: 'e164' }).validate('+1 888888888')).to.equal({ value: '+1888888888' });
        expect(customJoi.string().phoneNumber({ defaultRegionCode: 'DE', format: 'e164' }).validate('tel:+33-888-888-888')).to.equal({ value: '+33888888888' });

        // national formatted input depends on defaultRegionCode
        expect(customJoi.string().phoneNumber({ defaultRegionCode: 'ID', format: 'e164' }).validate('0888888888')).to.equal({ value: '+62888888888' });
        expect(customJoi.string().phoneNumber({ defaultRegionCode: 'US', format: 'e164' }).validate('0888888888')).to.equal({ value: '+10888888888' });
        expect(customJoi.string().phoneNumber({ defaultRegionCode: 'EG', format: 'e164' }).validate('0888888888')).to.equal({ value: '+20888888888' });
    });
});
