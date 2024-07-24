import moment, { Moment } from 'moment';
import { TLocalize } from 'types';

/**
 * Function that converts a numerical epoch value into a Moment instance
 */
export const epochToMoment = (epoch: number) => moment.unix(epoch).utc();

/**
 * Function that takes a primitive type and converts it into a Moment instance
 */
export const toMoment = (value?: moment.MomentInput): moment.Moment => {
    if (!value || !moment(value).isValid()) return moment().utc(); // returns 'now' moment object
    if (moment.isMoment(value) && value.isValid() && value.isUTC()) return value; // returns if already a moment object
    if (typeof value === 'number') return epochToMoment(value); // returns epochToMoment() if not a date

    return moment.utc(value);
};

/**
 * return the number of days since the date specified
 * @param  {String} date   the date to calculate number of days since
 * @return {Number} an integer of the number of days
 */
export const daysSince = (date: string): number =>
    toMoment().startOf('day').diff(toMoment(date).startOf('day'), 'days');

/**
 * The below function is used to format the display the time given in minutes to hours and minutes
 * e.g. 90 minutes will be displayed as 1 hour 30 minutes
 * @param {number} minutes - The time in minutes (convert to epoch time before passing)
 * @returns {string} formatted time string e.g. 1 hour 30 minutes
 */
export const formatTime = (minutes: number, localize: TLocalize) => {
    if (!minutes) return '';
    const timeInMinutes = minutes / 60;
    const hours = Math.floor(timeInMinutes / 60);
    const remainingMinutes = timeInMinutes % 60;
    const hoursText = hours === 1 ? localize('hour') : localize('hours');
    const minutesText = remainingMinutes === 1 ? localize('minute') : localize('minutes');

    if (hours === 0) {
        return `${remainingMinutes} ${minutesText}`;
    }

    if (remainingMinutes === 0) {
        return `${hours} ${hoursText}`;
    }

    return `${hours} ${hoursText} ${remainingMinutes} ${minutesText}`;
};

/**
 * Gets the formatted date string in the format "DD MMM YYYY HH:mm:ss". e.g.: "01 Jan 1970 21:01:11"
 * or "MMM DD YYYY HH:mm:ss" for local time. e.g.: "Jan 01 1970 21:01:11" or without seconds if
 * hasSeconds is false. e.g.: "01 Jan 1970 21:01" or "Jan 01 1970 21:01".
 *
 * @param {Date} dateObj - The date object to format.
 * @param {boolean} isLocal - Whether to use local time or UTC time.
 * @param {boolean} hasSeconds - Whether to include seconds in the time.
 * @returns {String} The formatted date string.
 */
export const getFormattedDateString = (
    dateObj: Date,
    isLocal = false,
    hasSeconds = false,
    onlyDate = false
): string => {
    const dateString = isLocal ? dateObj.toString().split(' ') : dateObj.toUTCString().split(' ');
    // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
    const [_, day, month, year, time] = dateString;
    const times = time.split(':');

    // Return time in the format "HH:mm:ss". e.g.: "01 Jan 1970 21:01:11"
    if (!hasSeconds) {
        times.pop();
    }

    if (onlyDate) {
        return `${month} ${day} ${year}`;
    }

    const timeWithoutSec = times.join(':');

    // Return in the format "DD MMM YYYY HH:mm". e.g.: "01 Jan 1970 21:01"
    return `${day} ${month} ${year}, ${timeWithoutSec}`;
};

/**
 * Converts the epoch time to milliseconds.
 * @param {Number} epoch - The epoch time to convert.
 * @returns {Number} The epoch time in milliseconds.
 */
export const convertToMillis = (epoch: number): number => {
    const milliseconds = epoch * 1000;
    return milliseconds;
};

/**
 * Converts a number to double digits.
 * @param {Number} number - The number to convert.
 * @returns {String} The number in double digits.
 */
const toDoubleDigits = (number: number): string => number.toString().padStart(2, '0');

/**
 * Converts the distance in milliseconds to a timer string in the format "HH:MM:SS". e.g.: "00:00:00"
 * @param {Number} distance - The distance in milliseconds.
 * @returns {String} The timer string.
 */
export const millisecondsToTimer = (distance: number): string => {
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    return `${toDoubleDigits(hours)}:${toDoubleDigits(minutes)}:${toDoubleDigits(seconds)}`;
};

/**
 * Get the distance to the server time.
 * @param {Number} compareTime - The time to compare to the server time.
 * @param {Moment} serverTime - The server time.
 * @returns {Number} The distance to the server time.
 */
export const getDistanceToServerTime = (compareTime: number, serverTime?: Moment): number => {
    const time = moment(compareTime);
    const distance = time.diff(serverTime, 'milliseconds');
    return distance;
};

/**
 * Formats milliseconds into a string according to the specified format.
 * @param {Number} miliseconds miliseconds
 * @param {String} strFormat formatting using moment e.g - YYYY-MM-DD HH:mm
 */
export const formatMilliseconds = (miliseconds: moment.MomentInput, strFormat: string, isLocalTime = false) => {
    if (isLocalTime) {
        return moment(miliseconds).format(strFormat);
    }
    return moment.utc(miliseconds).format(strFormat);
};

/**
 * Gets the date string after the given number of hours.
 * @param {Number} initialEpoch - The initial epoch time.
 * @param {Number} hours - The number of hours to add.
 * @returns {String} The date string after the given number of hours.
 */
export const getDateAfterHours = (initialEpoch: number, hours: number): string => {
    const milliseconds = hours * 60 * 60 * 1000;
    const initialDayMilliseconds = convertToMillis(initialEpoch);
    const totalMilliseconds = initialDayMilliseconds + milliseconds;

    return getFormattedDateString(new Date(totalMilliseconds));
};

/**
 * Converts an epoch timestamp to a formatted UTC string.
 *
 * @param {number} time - The epoch timestamp in seconds.
 * @param {string} format - The desired output format of the date and time.
 *                          This format string follows the conventions used by the moment.js library.
 * @returns {string} The formatted date and time string in UTC.
 *
 * @example
 * // Convert epoch timestamp to UTC date string in 'YYYY-MM-DD HH:mm:ss' format
 * const formattedDate = epochToUTC(1609459200, 'YYYY-MM-DD HH:mm:ss');
 * console.log(formattedDate); // Output: '2021-01-01 00:00:00'
 */
export const epochToUTC = (time: number, format: string) => moment.unix(time).utc().format(format);

/**
 * Converts an epoch timestamp to a formatted local time string.
 *
 * @param {number} time - The epoch timestamp in seconds.
 * @param {string} format - The desired output format of the date and time.
 *                          This format string follows the conventions used by the moment.js library.
 * @returns {string} The formatted date and time string in local time.
 *
 * @example
 * // Convert epoch timestamp to local date string in 'YYYY-MM-DD HH:mm:ss' format
 * const formattedDate = epochToLocal(1609459200, 'YYYY-MM-DD HH:mm:ss');
 * console.log(formattedDate); // Output will vary depending on the local timezone, e.g., '2020-12-31 19:00:00' for EST
 */
export const epochToLocal = (time: number, format: string) => moment.unix(time).utc().local().format(format);

export const DATE_TIME_FORMAT_WITH_GMT = 'YYYY-MM-DD HH:mm:ss [GMT]';
export const DATE_TIME_FORMAT_WITH_OFFSET = 'YYYY-MM-DD HH:mm:ss Z';
