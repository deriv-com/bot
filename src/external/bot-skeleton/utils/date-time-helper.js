// import { localize } from '@/utils/tmp/dummy';

export const timeSince = timestamp => {
    const now = new Date();
    const secondPast = (now.getTime() - timestamp) / 1000;

    //console.log(secondPast)
    if (secondPast < 60) {

        return `${parseInt(secondPast)}s ago`;
        //return localize('{{secondPast}}s ago', { secondPast: parseInt(secondPast) });
    }
    if (secondPast < 3600) {
        return `${parseInt(secondPast / 60)}m ago`;
        //return localize('{{minutePast}}m ago', { minutePast: parseInt(secondPast / 60) });
    }
    if (secondPast <= 86400) {
        return `${parseInt(secondPast / 3600)}h ago`;
        //return localize('{{hourPast}}h ago', { hourPast: parseInt(secondPast / 3600) });
    }

    const timestampDate = new Date(timestamp);
    const day = timestampDate.getDate();
    const month = timestampDate
        .toDateString()
        .match(/ [a-zA-Z]*/)[0]
        .replace(' ', '');
    const year = `${timestampDate.getFullYear() === now.getFullYear() ? '' : ' '}${timestampDate.getFullYear()}`;
    return `${day} ${month}${year}`;
};
