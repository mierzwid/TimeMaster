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

const messageBox = {
    MESSAGE_BOX_CLASS: 'tm-message-box',
    MESSAGE_BOX_ID: 'tm-message-box-id',
    RED_CLASS: 'red',
    GREEN_CLASS: 'green',
    TM_LINK: 'https://chrome.google.com/webstore/detail/time-master/hjbpoaibdpheojjmlfogdklfkekbijjd',
    CLIPBOARD_TEXTAREA_ID: 'tm-link',
    BOX_WIDTH: 200,
    BOX_HEIGHT: 100,
    RIGHT_MARGIN: 20,
    remaining: 0,
    created : false,

    addMessageBox: function (event) {
        if (messageBox.created === false){
            messageBox.created = true;
            log.info('MessageBox added');

            const mBox = messageBox.createMessageBoxElement(event.clientX, event.clientY);
            mBox.onclick = messageBox.removeMessageBox;
            document.body.onclick = messageBox.removeMessageBox;

            document.body.appendChild(mBox);
        }
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
        mBox.style['left'] = (x - messageBox.BOX_WIDTH - messageBox.RIGHT_MARGIN) + 'px';

        const copyDiv = messageBox.createCopyDiv();
        mBox.appendChild(copyDiv);
        mBox.insertBefore(time, mBox.childNodes[0]);

        return mBox;
    },

    createCopyDiv: function() {
        const copyDiv = document.createElement('div');

        const copySpan = document.createElement('span');
        copySpan.innerHTML = 'COPY LINK';
        copySpan.onclick = function () {
            messageBox.copyToClipboard(messageBox.TM_LINK);
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
};

export default messageBox;


