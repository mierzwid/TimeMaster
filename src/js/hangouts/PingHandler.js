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

import log from '../common/log.js';
class PingHandler {

    static beforeEndOfAMeetingHandler() {
        const pingHandler = new PingHandler();
        return function (elapsedInMs, durationInMs) {
            pingHandler.beforeEndOfAMeeting(elapsedInMs, durationInMs);
        };
    }

    static onEndOfAMeetingHandler() {
        const pingHandler = new PingHandler();
        return function () {
            pingHandler.onEndOfAMeeting();
        };
    }

    constructor() {
        this.endSound = new Audio('https://storage.googleapis.com/time-master/shared/crystal.ogg');
        this.pingTimeBeforeMeetingEndsInSeconds = 5 * 60;
        this.reminderPlayed = false;
    }

    beforeEndOfAMeeting(elapsedInMs, durationInMs) {
        if (this.reminderPlayed) {
            return;
        }
        const timeToEndInSeconds = (durationInMs - elapsedInMs) / 1000;
        if (this.isAroundPingTime(timeToEndInSeconds)) {
            this.reminderPlayed = true;
            this.play();
        }
    }

    isAroundPingTime(time) {
        if (time > this.pingTimeBeforeMeetingEndsInSeconds) {
            return false;
        }
        if (time < this.pingTimeBeforeMeetingEndsInSeconds - 3) {
            return false;
        }
        return true;
    }

    onEndOfAMeeting() {
        this.play();
    }

    play() {
        log.info('Ping!!!');
        this.endSound.play();
    }
}

export default PingHandler;