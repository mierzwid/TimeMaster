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

function Stopwatch() {

    var startTime = Date.now(),
        durationInMs = 30000,
        interval = null,
        progressHandlers = [],
        stopHandler = null;

    function addHandlerP(handler) {
        if (handler) {
            progressHandlers.push(handler);
        }
    }

    function setStopHandlerP(handlerF) {
        stopHandler = handlerF;
    }

    function setTimerP(timer) {
        startTime = timer.startTime;
        durationInMs = timer.durationInMinutes * 60 * 1000;
    }

    function startP() {
        stopP();
        interval = setInterval(function () {
            let elapsed = Date.now() - startTime;
            progressHandlers.forEach(function(handler){
                handler(elapsed, durationInMs);
            });
            if (elapsed >= durationInMs) {
                stopP();
                stopNotify();
            }
        }, 500);
    }

    function stopNotify() {
        if (stopHandler) {
            stopHandler();
        }
    }

    function stopP() {
        if (interval) {
            clearInterval(interval);
            interval = null;
        }
    }

    return {
        setTimer: setTimerP,
        start: startP,
        stop: stopP,
        addHandler: addHandlerP,
        setStopHandler: setStopHandlerP
    };
}

export default Stopwatch;