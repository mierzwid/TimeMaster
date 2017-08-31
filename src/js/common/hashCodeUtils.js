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

const hashCodeUtils = {
    hashCode: function (string) {
        var hash = 0;
        if (string.length == 0) {
            return hash;
        }
        for (var i = 0; i < string.length; i++) {
            var char = string.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
        }
        return hash;
    },

    hashWithPrefix: function (string) {
        return string.substring(0, 2) + string.length + '_' + this.hashCode(string);
    }
};

export default hashCodeUtils;
