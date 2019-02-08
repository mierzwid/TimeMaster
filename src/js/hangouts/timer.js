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

import Stopwatch from './stopwatch';
import timeStrip from './page/timeStrip.page.js';
import PingHandler from './PingHandler.js';
import messageBox from './page/messageBox.page.js';

class Timer {
    constructor() {
        timeStrip.addTimeStrip();
        this.stopwatch = new Stopwatch();
        this.stopwatch.addHandler(timeStrip.setTime);
        this.stopwatch.addHandler(PingHandler.beforeEndOfAMeetingHandler());
        this.stopwatch.setStopHandler(PingHandler.onEndOfAMeetingHandler());
    }

    start(timerConfig) {
        this.stop();
        this.stopwatch.setTimer(timerConfig);
        this.stopwatch.start();
        messageBox.setTime(timerConfig);
    }

    stop() {
        this.stopwatch.stop();
    }
}
export default Timer;

