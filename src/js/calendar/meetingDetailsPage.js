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

import config from './config.js';
import log from '../common/log.js';
import arraysUtils from '../common/arraysUtils.js';
import timeRangeRepository from '../common/timeRangeRepository.js';
import timeParser from './timeParser.js';
import urlParser from '../common/urlParser.js';

const meetingDetailsPage = {

    registerJoinHangoutButtonListener: function () {
        let observer = new MutationObserver(this.addTimeMasterParamsToButton);
        let observerConfig = {childList: true, subtree: true};
        let detailsContainer = document.getElementById(config.meetingDetailsPage.detailsModalId);
        observer.observe(detailsContainer, observerConfig);
        log.info('Observer for details page registered.');
    },

    addTimeMasterParamsToButton: function (mutations) {
        log.info('Observer for details page run.');
        return mutations.filter(mutation => mutation.addedNodes)
                        .map(mutation => arraysUtils.arrayify(mutation.addedNodes))
                        .reduce(arraysUtils.concatenateArrays, [])
                        .filter(node => node.nodeType != Node.TEXT_NODE)
                        .map(findAllHangoutLinks)
                        .reduce(arraysUtils.concatenateArrays, [])
                        .filter(arraysUtils.uniqueElements)
                        .map(meetingDetailsPage.addTimeMasterOnClickListenerToVideoLink);
    },

    getMeetingTimeRange: function () {
        var startEndTimeArray = this.getMeetingTimeRangeFromLabelAsArray();
        if (!startEndTimeArray || startEndTimeArray.length < 2) {
            log.info('Time range element don\'t found. looking for individual hours');
            startEndTimeArray = this.getMeetingTimeRangeFromIndividualFieldsAsArray();
        }

        return timeParser.createTimeRangeFromTimeArray(startEndTimeArray);
    },

    getMeetingTimeRangeFromLabelAsArray: function () {
        var timeRangeElement = document.querySelector(config.meetingDetailsPage.labelWithTimeRange);
        var startEndTimeArray = [];

        if (timeRangeElement !== null) {
            var startEndTimeString = timeParser.extractHourMinuteRange(timeRangeElement.innerHTML);
            startEndTimeArray = startEndTimeString.match(config.hourMinutePattern);
            if (!startEndTimeArray || startEndTimeArray.length < 2) {
                log.warn('Error parsing meeting time label element:', timeRangeElement.innerHTML);
            }
        }

        return startEndTimeArray;
    },

    getMeetingTimeRangeFromIndividualFieldsAsArray: function () {
        var startEndTimeArray = [];
        var startHourMinuteElement = getElementValue(config.meetingDetailsPage.editWithStartTime);
        var endHourMinuteElement = getElementValue(config.meetingDetailsPage.editWithEndTime);

        if (startHourMinuteElement && endHourMinuteElement) {
            startEndTimeArray = [startHourMinuteElement, endHourMinuteElement];
        } else {
            log.info('Individual time fields not found');
        }
        return startEndTimeArray;
    },

    addTimeMasterOnClickListenerToVideoLink: function (videoLinkElement) {
        if (videoLinkElement != null && !isLinkMarkedAsObserved(videoLinkElement)) {
            log.info('Hangout link element to process:', videoLinkElement);
            let videoLinkOnClick = generateTimeMasterOnClickFunction(videoLinkElement);
            videoLinkElement.addEventListener('click', videoLinkOnClick);
            markLinkAsObserved(videoLinkElement);
            log.info('New onClick Event Listener registered');
        }
    }
};

const markLinkAsObserved = linkElement => linkElement.classList.add(config.meetingDetailsPage.timeMasterCssMarker);

const isLinkMarkedAsObserved = linkElement => linkElement.classList.contains(config.meetingDetailsPage.timeMasterCssMarker);

const findAllHangoutLinks = function (element) {
    if (element.href && (element.href.startsWith(config.meetingDetailsPage.hangoutLinkRaw) ||
                         element.href.startsWith(config.meetingDetailsPage.meetLinkRaw))) {
        return [element];
    } else {
        let hangoutLinks = arraysUtils.arrayify(element.querySelectorAll(config.meetingDetailsPage.hangoutLink));
        let meetLinks = arraysUtils.arrayify(element.querySelectorAll(config.meetingDetailsPage.meetLink));
        return hangoutLinks.concat(meetLinks);
    }
};


const getElementValue = function (querySelector) {
    let element = document.querySelector(querySelector);
    if (element && element.value) {
        return element.value;
    } else {
        log.warn('No element or value found for:', querySelector);
        return null;
    }
};

const generateTimeMasterOnClickFunction = function (videoLinkElement) {

    let newOnClickFunction = function () {
        let meetingTimeRange = meetingDetailsPage.getMeetingTimeRange();
        log.info(videoLinkElement.href, '<>', JSON.stringify(meetingTimeRange));
        let hangoutId = urlParser.getHangoutId(new URL(videoLinkElement.href).pathname);
        timeRangeRepository.saveHangoutTime(hangoutId, meetingTimeRange);
    };

    return newOnClickFunction;
};

export default meetingDetailsPage;