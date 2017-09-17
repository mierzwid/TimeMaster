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

const google_analytics_app_key = GOOGLE_ANALYTICS_ID;

const googleAnalytics = {

    action: {
        HANGOUT_STOPPED : 'hangout stopped',
        HANGOUT_STARTED : 'hangout started'
    },

    setupGoogleAnalytics: function () {
        window.ga = window.ga || function () {
                (ga.q = ga.q || []).push(arguments);
            };
        ga.l = +new Date;
        ga('create', google_analytics_app_key, 'auto');
        ga('send', 'pageview');
    },

    sendEvent: function (event) {
        window.ga('send', 'event', event);
    },

    sendException: function (error) {
        ga('send', 'exception', {
            'exDescription': error.stack,
            'exFatal': false
        });
    },

    sendMainEvent: function (action, label, value) {
        this.sendRawEvent('main', action, label, value);
    },

    sendUserEvent: function (action, label, value) {
        this.sendRawEvent('user', action, label, value);
    },

    sendRawEvent: function (category, action, label, value) {
        if (value) {
            window.ga('send', 'event',{
                'eventCategory': category,
                'eventAction': action,
                'eventLabel': label,
                'eventValue': value
            });
        } else {
            window.ga('send', 'event', {
                'eventCategory': category,
                'eventAction': action,
                'eventLabel': label
            });
        }
    }
};

export default googleAnalytics;