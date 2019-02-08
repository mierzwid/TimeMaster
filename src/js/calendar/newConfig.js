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

/* eslint-disable quotes*/

const newConfig = {

    newCalendarBodyAttribute: "data-viewfamily",
    datePrefixPattern: /.*, /,
    hourMinutePattern: /([01]?[0-9]|2[0-3]):?[0-5]?[0-9]?[ap]?[m]?/g,

    meetingDetailsPage: {
        // edit with start hour:minute (with optional am/pm)
        editWithStartTime: "input.text.dr-time[id$='-st']",
        // edit with end hour:minute (with optional am/pm)
        editWithEndTime: "input.text.dr-time[id$='-et']",
        // label with start/end hour:minute range (with optional am/pm)
        labelWithTimeRange: "div.ep-dpc div.ui-sch-schmedit",
        // video link when user is not meeting owner (can't edit video settings)
        videoLinkWithoutEdit: "div.ep-dp-rtc > div > div > a",
        // video link when user is meeting owner (can edit video settings)
        videoLinkWithEdit: "a.rtc-link[href^='http']",
        detailsModalId: "YPCqFe",
        timeMasterCssMarker: "timeMasterEvent",
        //a href with hangout link
        hangoutLink: "a[href^='https://plus.google.com/hangouts']",
        meetLink: "a[href^='https://meet.google.com']",
        hangoutLinkRaw: "https://plus.google.com/hangouts",
        meetLinkRaw: "https://meet.google.com"
    },

    meetingsOverviewPage: {
        selector: {
            //a href with hangout link
            hangoutLink: "a[href^='https://plus.google.com/hangouts']",
            meetLink: "a[href^='https://meet.google.com']",
            //div with meeting time
            meetingTimeSelectors: [".DN1TJ span:nth-child(2)"],
        },

        //class name of div representing bubble
        bubbleClassName: "aZpV8b"
    }
};

export default newConfig;

