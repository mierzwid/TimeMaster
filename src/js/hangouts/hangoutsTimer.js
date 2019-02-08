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

import hangoutsPageFactory from './page/hangoutsPageFactory.js';
import timeRangeRepository from '../common/timeRangeRepository.js';
import urlParser from '../common/urlParser.js';
import Timer from './timer.js';
import log from '../common/log.js';

const HANGOUTS_PAGE_OBJECT = hangoutsPageFactory.getHangoutsPage();

const start = function () {
    log.info('Time Master Start!');

    try {
        const timeRangePromise = timeRangeRepository.getHangoutTime(getHangoutId());
        timeRangePromise.then(startCountDown)
            .catch(handleError);
    } catch(error) {
        handleError(error);
    }
};

const startCountDown = function (timeRange) {
    log.info('Meeting Start:', timeRange.startTime);
    log.info('Meeting End:', timeRange.endTime);
    log.info('Duration:', timeRange.durationInMinutes);

    const intervalId = setInterval(function () {
        log.info('Checking hangout initialization...');
        if (HANGOUTS_PAGE_OBJECT.isInitialized()) {
            log.info('Hangout initialized!');
            new Timer().start(timeRange);
            clearInterval(intervalId);
        }
    }, 100);

    log.info('Time Master Started!');
    return intervalId;
};

const getHangoutId = function () {
    return urlParser.getHangoutId(window.location.pathname);
};

const handleError = function (error) {
    log.error('[TimeMaster] Error:', error);
};

export default {
    start: start,
};