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

import log from '../../common/log.js';
import ga from '../googleAnalytics.js';
import urlParser from '../../common/urlParser.js';
import hangoutsPageFactory from './hangoutsPageFactory.js';

const HANGOUTS_PAGE_OBJECT = hangoutsPageFactory.getHangoutsPage();

const messageBox = {
    MESSAGE_BOX_CLASS: 'tm-message-box',
    MESSAGE_BOX_ID: 'tm-message-box-id',
    CLICKABLE_CLASS: 'clickable',
    RED_CLASS: 'red',
    GREEN_CLASS: 'green',
    TM_LINK: WEBSTORE_URL,
    CLIPBOARD_TEXTAREA_ID: 'tm-link',
    BOX_WIDTH: 200,
    BOX_HEIGHT: 100,
    RIGHT_MARGIN: 20,
    remaining: 0,
    created : false,
    timeoutId : null,
    stripOnRightSide: HANGOUTS_PAGE_OBJECT.isTimeStripOnRight(),

    addMessageBox: function (event) {
        messageBox.clearRemoveTimeout();
        if (messageBox.created === false){
            messageBox.created = true;
            log.info('MessageBox added');

            const mBox = messageBox.createMessageBoxElement(event.clientX, event.clientY);
            mBox.onclick = messageBox.removeMessageBox;
            mBox.onmouseout = messageBox.startRemoveTimeout;
            mBox.onmouseover = messageBox.addMessageBox;
            document.body.onclick = messageBox.removeMessageBox;

            document.body.appendChild(mBox);
        }
    },

    startRemoveTimeout: function() {
        if (messageBox.timeoutId === null) {
            messageBox.timeoutId = setTimeout(function () {
                messageBox.removeMessageBox();
                messageBox.timeoutId = null;
            }, 500);
        }
    },

    clearRemoveTimeout: function () {
        clearTimeout(messageBox.timeoutId);
        messageBox.timeoutId = null;
    },

    removeMessageBox: function() {
        if (messageBox.created === true) {
            log.info('MessageBox removed');
            messageBox.created = false;
            const mBox = document.getElementById(messageBox.MESSAGE_BOX_ID);
            document.body.removeChild(mBox);
            document.body.onclick -= messageBox.removeMessageBox;
        }
    },

    createMessageBoxElement: function (x, y) {
        const heightDiff = y + messageBox.BOX_HEIGHT - document.body.scrollHeight;
        const normalizedY = heightDiff > 0 ? y - heightDiff : y;
        const mBox = document.createElement('div');

        const time = document.createElement('p');
        time.innerHTML = messageBox.remaining + ' min';
        time.className = messageBox.remaining > 0 ? messageBox.GREEN_CLASS : messageBox.RED_CLASS;

        mBox.className = messageBox.MESSAGE_BOX_CLASS;
        mBox.id = messageBox.MESSAGE_BOX_ID;
        mBox.innerHTML = 'Like it? Share TimeMaster';
        mBox.style['width'] = messageBox.BOX_WIDTH + 'px';
        mBox.style['top'] = normalizedY + 'px';
        mBox.style['left'] = (x + messageBox.getMessageBoxLeftOffset()) + 'px';

        const copyDiv = messageBox.createCopyDiv();
        mBox.appendChild(copyDiv);
        mBox.insertBefore(time, mBox.childNodes[0]);

        return mBox;
    },

    getMessageBoxLeftOffset() {
        if (messageBox.stripOnRightSide) {
            return - messageBox.BOX_WIDTH - messageBox.RIGHT_MARGIN;
        } else {
            return messageBox.RIGHT_MARGIN / 2;
        }
    },

    createCopyDiv: function() {
        const copyDiv = document.createElement('div');

        const copySpan = document.createElement('span');
        copySpan.innerHTML = 'COPY LINK';
        copySpan.className = messageBox.CLICKABLE_CLASS;
        copySpan.onclick = function () {
            messageBox.copyToClipboard(messageBox.TM_LINK);
            ga.sendMainEvent(ga.action.COPY_LINK_CLICKED, messageBox.getHangoutId(), 1);
        };

        const copyImage = document.createElement('img');
        copyImage.src = chrome.extension.getURL('res/copy.png');

        copyDiv.appendChild(copyImage);
        copyDiv.appendChild(copySpan);

        return copyDiv;
    },

    copyToClipboard: function (text) {
        messageBox.createTextArea(text);
        document.getElementById(messageBox.CLIPBOARD_TEXTAREA_ID).select();
        document.execCommand('copy');
        messageBox.removeTextArea();
    },

    createTextArea: function(text) {
        const textArea = document.createElement('textarea');
        textArea.id = messageBox.CLIPBOARD_TEXTAREA_ID;
        textArea.innerHTML = text;
        document.body.appendChild(textArea);
    },

    removeTextArea: function() {
        const textArea = document.getElementById(messageBox.CLIPBOARD_TEXTAREA_ID);
        document.body.removeChild(textArea);
    },

    setTime: function (elapsed, durationInMs) {
        var timeDiffInMs = durationInMs - elapsed;
        messageBox.remaining = Math.floor(timeDiffInMs / 60000);
    },

    getHangoutId: function () {
        return urlParser.getHangoutId(window.location.pathname);
    },
};

export default messageBox;


