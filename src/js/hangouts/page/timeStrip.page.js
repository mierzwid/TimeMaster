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

import messageBox from './messageBox.page.js';
import hangoutsPageFactory from './hangoutsPageFactory.js';
import log from '../../common/log.js';

const PROGRESS_GREEN = 'progress-high';
const PROGRESS_YELLOW = 'progress-medium';
const PROGRESS_RED = 'progress-low';
const PROGRESS_LEVELS = [PROGRESS_GREEN, PROGRESS_YELLOW, PROGRESS_RED];
const FIVE_MINUTES_IN_MS = 5 * 60 * 1000;
const HANGOUTS_PAGE_OBJECT = hangoutsPageFactory.getHangoutsPage();

let timeStrip = {
    PROGRESS_ID: HANGOUTS_PAGE_OBJECT.getProgressBarClass(),
    BUTTONS: 'div[role=\'button\']',

    PROGRESS_BACKGROUND_CLASS: 'progress-background',

    addTimeStrip: function () {
        let progress = document.createElement('PROGRESS');
        progress.id = timeStrip.PROGRESS_ID;
        progress.onmouseover = messageBox.addMessageBox;
        progress.onmouseout = messageBox.startRemoveTimeout;
        document.body.appendChild(progress);
        log.info('Progress item created in body');
    },

    setTime: function (elapsed, durationInMs) {
        let meetingTime = {
            timeLeftInMs: durationInMs - elapsed,
            durationInMs: durationInMs,
            timeLeftInPercent: (durationInMs - elapsed) / durationInMs
        };
        let progressHTMLElement = document.getElementById(timeStrip.PROGRESS_ID);
        progressHTMLElement.value = meetingTime.timeLeftInMs;
        progressHTMLElement.max = meetingTime.durationInMs;
        progressHTMLElement.classList.add(timeStrip.PROGRESS_BACKGROUND_CLASS);
        timeStrip.applyColorStyle(meetingTime);
    },

    setProgress: function (progressLevel) {
        const progress = document.getElementById(timeStrip.PROGRESS_ID);
        if (!progress.classList.contains(progressLevel)) {
            progress.classList.add(progressLevel);
            PROGRESS_LEVELS
                .filter(it => it != progressLevel)
                .forEach(it => progress.classList.remove(it));
        }
    },

    applyColorStyle: function (meetingTime) {
        if (meetingTime.timeLeftInMs <= FIVE_MINUTES_IN_MS) {
            this.setProgress(PROGRESS_RED);
        } else if (meetingTime.timeLeftInPercent >= 0.50) {
            this.setProgress(PROGRESS_GREEN);
        } else {
            this.setProgress(PROGRESS_YELLOW);
        }
    },
};

export default timeStrip;

