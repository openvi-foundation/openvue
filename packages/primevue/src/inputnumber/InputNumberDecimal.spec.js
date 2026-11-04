import { addDecimal, compareDecimal, negateDecimal, toDecimalString } from './InputNumberDecimal';

describe('decimal', () => {
    describe('toDecimalString', () => {
        it('should keep every digit beyond Number.MAX_SAFE_INTEGER', () => {
            expect(toDecimalString('9007199254740993')).toBe('9007199254740993');
            expect(toDecimalString('12345678901234567')).toBe('12345678901234567');
            expect(toDecimalString('123456789012345678')).toBe('123456789012345678');
            expect(toDecimalString('999999999999999999')).toBe('999999999999999999');
        });

        it('should expand exponential notation', () => {
            expect(toDecimalString(1e21)).toBe('1000000000000000000000');
            expect(toDecimalString(1e-7)).toBe('0.0000001');
            expect(toDecimalString('1.5e-7')).toBe('0.00000015');
            expect(toDecimalString('-2.5E3')).toBe('-2500');
        });

        it('should canonicalize equivalent notations', () => {
            expect(toDecimalString('1.50')).toBe('1.5');
            expect(toDecimalString('007')).toBe('7');
            expect(toDecimalString('+5')).toBe('5');
            expect(toDecimalString('.5')).toBe('0.5');
            expect(toDecimalString('5.')).toBe('5');
            expect(toDecimalString(-0)).toBe('0');
            expect(toDecimalString('-0.00')).toBe('0');
        });

        it('should accept bigint', () => {
            expect(toDecimalString(123456789012345678901234567890n)).toBe('123456789012345678901234567890');
            expect(toDecimalString(-42n)).toBe('-42');
        });

        it('should reject an exponent that would expand beyond the digit cap', () => {
            // Reachable from onPaste: expanding this would ask for a gigabyte-long string.
            expect(toDecimalString('1e999999999')).toBeNull();
            expect(toDecimalString('1e-999999999')).toBeNull();
            expect(toDecimalString('1e1001')).toBeNull();
            // Just inside the cap still works.
            expect(toDecimalString('1e999')).toHaveLength(1000);
        });

        it('should return null for non-numeric input', () => {
            expect(toDecimalString('abc')).toBeNull();
            expect(toDecimalString('')).toBeNull();
            expect(toDecimalString('   ')).toBeNull();
            expect(toDecimalString('1.2.3')).toBeNull();
            expect(toDecimalString('-')).toBeNull();
            expect(toDecimalString(NaN)).toBeNull();
            expect(toDecimalString(Infinity)).toBeNull();
            expect(toDecimalString(null)).toBeNull();
            expect(toDecimalString(undefined)).toBeNull();
            expect(toDecimalString({})).toBeNull();
        });
    });

    describe('negateDecimal', () => {
        it('should flip the sign exactly', () => {
            expect(negateDecimal('0.1')).toBe('-0.1');
            expect(negateDecimal('-0.1')).toBe('0.1');
            expect(negateDecimal('999999999999999999')).toBe('-999999999999999999');
            expect(negateDecimal(5)).toBe('-5');
        });

        it('should never sign zero', () => {
            expect(negateDecimal('0')).toBe('0');
            expect(negateDecimal('-0.00')).toBe('0');
        });

        it('should return null for non-numeric input', () => {
            expect(negateDecimal('abc')).toBeNull();
            expect(negateDecimal(null)).toBeNull();
        });
    });

    describe('addDecimal', () => {
        it('should step by 0.1 without drifting', () => {
            let value = '0';

            for (let i = 0; i < 10; i++) {
                value = addDecimal(value, '0.1');
            }

            expect(value).toBe('1');
        });

        it('should add fractions exactly', () => {
            expect(addDecimal('0.1', '0.2')).toBe('0.3');
            expect(addDecimal(0.1, 0.2)).toBe('0.3');
            expect(addDecimal('1.005', '0.01')).toBe('1.015');
            expect(addDecimal('0.3', '-0.1')).toBe('0.2');
        });

        it('should add beyond the safe-integer range exactly', () => {
            expect(addDecimal('123456789012345678', '1')).toBe('123456789012345679');
            expect(addDecimal('9007199254740992', '1')).toBe('9007199254740993');
            expect(addDecimal('123456789012345678.55', '0.01')).toBe('123456789012345678.56');
        });

        it('should cross zero correctly', () => {
            expect(addDecimal('0.1', '-0.3')).toBe('-0.2');
            expect(addDecimal('-1', '1')).toBe('0');
        });

        it('should return null when an operand is not a decimal', () => {
            expect(addDecimal('abc', '1')).toBeNull();
            expect(addDecimal(null, '1')).toBeNull();
        });
    });

    describe('compareDecimal', () => {
        it('should compare beyond double precision', () => {
            expect(compareDecimal('9007199254740993', '9007199254740992')).toBe(1);
            expect(compareDecimal('123456789012345678', '123456789012345679')).toBe(-1);
        });

        it('should ignore insignificant zeros', () => {
            expect(compareDecimal('1.50', '1.5')).toBe(0);
            expect(compareDecimal('007', '7')).toBe(0);
            expect(compareDecimal('-0', '0')).toBe(0);
        });

        it('should compare negatives and mixed signs', () => {
            expect(compareDecimal('-2', '-1')).toBe(-1);
            expect(compareDecimal('-0.0001', 0)).toBe(-1);
            expect(compareDecimal('0.0001', 0)).toBe(1);
        });

        it('should return null when an operand is not a decimal', () => {
            expect(compareDecimal(null, '1')).toBeNull();
            expect(compareDecimal('1', 'abc')).toBeNull();
            expect(compareDecimal('-', 0)).toBeNull();
        });
    });
});
