/**
 * Exact decimal arithmetic on decimal strings.
 *
 * IEEE-754 doubles cannot hold every decimal a user may type: integers above
 * Number.MAX_SAFE_INTEGER are rounded to the nearest representable double, and repeatedly adding
 * a fraction such as 0.1 drifts. Carrying the value as a decimal string avoids both. BigInt alone
 * does not help, since it has no fractional part, so both operands are scaled to a common number
 * of fraction digits, the arithmetic is done in BigInt, and the result is scaled back — exact at
 * any magnitude and any precision.
 *
 * Intl.NumberFormat accepts decimal strings natively, so a value kept this way is also formatted
 * without passing through a double.
 */

const DECIMAL_REGEX = /^[+-]?(\d+(\.\d*)?|\.\d+)([eE][+-]?\d+)?$/;

/**
 * Longest decimal accepted. Exponential notation expands to plain digits, so an unbounded
 * exponent would let a pasted `1e999999999` ask for a gigabyte-long string. No value a user
 * types into a number field comes close to this many digits.
 */
const MAX_DIGITS = 1000;

/**
 * The source text of a number, bigint or string, or '' for anything that cannot be numeric
 * (including NaN and Infinity).
 */
function toText(value) {
    if (typeof value === 'string') return value.trim();
    if (typeof value === 'bigint' || (typeof value === 'number' && Number.isFinite(value))) return value.toString();

    return '';
}

/**
 * Splits a number, bigint or numeric string into its canonical sign, integer digits and fraction
 * digits, expanding exponential notation. Returns null when the value is not numeric.
 */
function split(value) {
    const text = toText(value);

    if (!DECIMAL_REGEX.test(text)) {
        return null;
    }

    const [mantissa, exponent] = text.split(/[eE]/);
    const negative = mantissa.startsWith('-');
    const [integerText = '', fractionText = ''] = mantissa.replace(/^[+-]/, '').split('.');
    const digits = integerText + fractionText;

    // Where the decimal point falls inside `digits` once the exponent is applied.
    let point = integerText.length + (exponent ? parseInt(exponent, 10) : 0);
    let padded = digits;

    if (Math.max(point, digits.length) - Math.min(point, 0) > MAX_DIGITS) {
        return null;
    }

    if (point <= 0) {
        padded = '0'.repeat(1 - point) + digits;
        point = 1;
    } else if (point > digits.length) {
        padded = digits.padEnd(point, '0');
    }

    return {
        // Zero is never signed, so that '-0' and '0' compare equal.
        sign: negative && /[1-9]/.test(padded) ? '-' : '',
        integerPart: padded.slice(0, point).replace(/^0+(?=\d)/, ''),
        fractionPart: padded.slice(point).replace(/0+$/, '')
    };
}

/**
 * The value as a BigInt multiplied by 10 ** scale. BigInt reads the sign and any leading zeros
 * itself, so no further normalisation is needed here.
 */
function scaled({ sign, integerPart, fractionPart }, scale) {
    return BigInt(sign + integerPart + fractionPart.padEnd(scale, '0'));
}

/**
 * Number of fraction digits the two values must share to be compared or added exactly.
 */
function commonScale(left, right) {
    return Math.max(left.fractionPart.length, right.fractionPart.length);
}

/**
 * Converts a number, bigint or numeric string to a canonical decimal string: no leading zeros, no
 * trailing fraction zeros, no exponent, and '0' for every form of zero. Returns null when the
 * value is not numeric.
 */
export function toDecimalString(value) {
    const decimal = split(value);

    if (decimal === null) {
        return null;
    }

    return decimal.fractionPart ? `${decimal.sign}${decimal.integerPart}.${decimal.fractionPart}` : decimal.sign + decimal.integerPart;
}

/**
 * The decimal with its sign flipped, canonicalized, or null when the value is not numeric.
 */
export function negateDecimal(value) {
    const decimal = toDecimalString(value);

    if (decimal === null || decimal === '0') {
        return decimal;
    }

    return decimal.startsWith('-') ? decimal.slice(1) : `-${decimal}`;
}

/**
 * Exact sum of two decimals, or null when either operand is not numeric.
 */
export function addDecimal(a, b) {
    const left = split(a);
    const right = split(b);

    if (left === null || right === null) {
        return null;
    }

    const scale = commonScale(left, right);
    const sum = scaled(left, scale) + scaled(right, scale);
    const negative = sum < 0n;
    const digits = (negative ? -sum : sum).toString().padStart(scale + 1, '0');
    const point = digits.length - scale;

    return toDecimalString((negative ? '-' : '') + digits.slice(0, point) + (scale ? `.${digits.slice(point)}` : ''));
}

/**
 * Exact three-way comparison returning -1, 0 or 1, or null when either operand is not numeric.
 */
export function compareDecimal(a, b) {
    const left = split(a);
    const right = split(b);

    if (left === null || right === null) {
        return null;
    }

    const scale = commonScale(left, right);
    const scaledLeft = scaled(left, scale);
    const scaledRight = scaled(right, scale);

    if (scaledLeft < scaledRight) {
        return -1;
    }

    return scaledLeft > scaledRight ? 1 : 0;
}
