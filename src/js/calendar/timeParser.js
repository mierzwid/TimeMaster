/*******************************************************************************
 * Copyright © 2017 Hoffmann-La Roche
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 ******************************************************************************/

import TimeRange from '../common/timeRange.js';
import log from '../common/log.js';

const extractHourMinuteRange = function (hourRangeWithDate) {
    return hourRangeWithDate.replace(/.*, /, '');
};

const createTimeRangeFromTimeArray = function (startEndTimeArray) {
    if (!startEndTimeArray || !startEndTimeArray[0] || !startEndTimeArray[1]) {
        log.warn('cannot create TimeRange object with array:', startEndTimeArray);
        return null;
    }

    return new TimeRange({
        startTime: convertToDate(startEndTimeArray[0]),
        endTime: convertToDate(startEndTimeArray[1])
    });
};

const convertToDate = function(timeStr){
  const hoursAndMinutes = convertTo24h(timeStr);
  return parseTime(hoursAndMinutes);
};

// parses google Calendar format into 'HH:mm' format
const convertTo24h = function (timeStr) {
    var time = timeStr.match(/(\d+):?(\d+)?\s?(\w\w)?/);
    var hours = Number(time[1]);
    // this supports also 10pm format (without :00)
    var minutes = Number(time[2] !== undefined ? time[2] : 0);
    var ampm = time[3];
    if (ampm !== undefined) {
        ampm = ampm.toLowerCase();
    }

    if (ampm === 'pm' && hours < 12) {
        hours = hours + 12;
    }
    else if (ampm === 'am' && hours == 12) {
        hours = hours - 12;
    }

    return leftZeroPad(hours, 2) + ':' + leftZeroPad(minutes, 2);
};

const leftZeroPad = function (num, size) {
    var str = num + '';
    while (str.length < size) str = '0' + str;
    return str;
};


// parses time in 'HH:mm' format to JS Date
const parseTime = function(time) {
    try {
        var hours = parseHours(time);
        var minutes = parseMinutes(time);
        var date = new Date();
        date.setHours(hours);
        date.setMinutes(minutes);
        date.setSeconds(0);
        date.setMilliseconds(0);
        return date;
    } catch (e) {
        log.warn('Invalid time format:', time, ', error: ', e.message);
        throw e;
    }
};

const parseHours = function(time) {
    let hours = parseInt(time.substr(0, time.lastIndexOf(':')));
    if (isNaN(hours)) {
        throw new Error('Hours are NaN: ' + time);
    }
    if (hours > 23) {
        throw new Error('Hours are greater than 23: ' + time);
    }
    return hours;
};

const parseMinutes = function(time) {
    let minutes = parseInt(time.substr(time.lastIndexOf(':') + 1));
    if (isNaN(minutes)) {
        throw new Error('Minutes are NaN: ' + time);
    }
    if (minutes > 59) {
        throw new Error('Minutes are greater than 59: ' + time);
    }
    return minutes;
};

const timeParser = {
    createTimeRangeFromTimeArray: createTimeRangeFromTimeArray,
    extractHourMinuteRange: extractHourMinuteRange,
    convertTo24h: convertTo24h,
    parseTime: parseTime
};

export default timeParser;