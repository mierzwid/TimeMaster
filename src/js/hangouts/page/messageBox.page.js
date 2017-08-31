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
    TM_LINK: 'https://chrome.google.com/webstore/detail/time-master/hjbpoaibdpheojjmlfogdklfkekbijjd',
    CLIPBOARD_TEXTAREA_ID: 'tm-link',
    BOX_WIDTH: 200,
    RIGHT_MARGIN: 20,
    created : false,

    addMessageBox: function (event) {
        if (messageBox.created === false){
            messageBox.created = true;
            log.info('MessageBox added');

            const mBox = messageBox.createMessageBoxElement(event.clientX, event.clientY);
            mBox.onclick = function () {
                log.info('MessageBox removed');
                messageBox.created = false;
                document.body.removeChild(mBox);
            };

            document.body.appendChild(mBox);
        }
    },

    createMessageBoxElement: function (x, y) {
        const mBox = document.createElement('div');
        mBox.className = messageBox.MESSAGE_BOX_CLASS;
        mBox.innerHTML = 'Like it? Share TimeMaster';
        mBox.style['width'] = messageBox.BOX_WIDTH + 'px';
        mBox.style['top'] = y + 'px';
        mBox.style['left'] = (x - messageBox.BOX_WIDTH - messageBox.RIGHT_MARGIN) + 'px';

        const copyDiv = messageBox.createCopyDiv();
        mBox.appendChild(copyDiv);

        return mBox;
    },

    createCopyDiv: function() {
        const copyDiv = document.createElement('div');

        const copySpan = document.createElement('span');
        copySpan.innerHTML = 'COPY';
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
        log.info('MessageBox, elapsed:', elapsed, 'duration:', durationInMs);
        if (elapsed > 0) {
            messageBox.addMessageBox();
        }
    },
};

export default messageBox;


