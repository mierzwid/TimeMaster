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

import TimeRange from './timeRange.js';
import storage from './storage.js';

const saveHangoutTime = function (hangoutId, timeRange) {
    let timeRangeRaw = timeRangeSerializer.serialize(timeRange);
    return storage.save(hangoutId, timeRangeRaw);
};

const createTimeRangePromise = function(hangoutId) {
    const gettingTimeRange = storage
        .get(hangoutId)
        .then(timeRangeRaw => {
            const timeRange = timeRangeSerializer.deserialize(timeRangeRaw);
            return Promise.resolve(timeRange);
        });
    return gettingTimeRange;
};

const cleanUpOldEntries = function () {
    const cleaningUpOldEntries = storage
        .getAll().
        then(allItems => {
            const oldKeys = findOldEntryKeys(allItems);
            return storage.remove(oldKeys);
        });
    return cleaningUpOldEntries;
};

const findOldEntryKeys = function(allItems){
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    return Object.keys(allItems).filter(key => isOldEntry(allItems[key], oneWeekAgo));
};

const isOldEntry = function(entry, referenceDate){
    return !entry.creationTime || new Date(entry.creationTime) < referenceDate;
};

const timeRangeSerializer = {

    serialize : function (timeRange) {
        let startTime, endTime;

        if (timeRange instanceof TimeRange){
            startTime = timeRange.startTime.toJSON();
            endTime = timeRange.endTime.toJSON();
        } else {
            throw 'Cannot serialize object which is not of a TimeRange class';
        }

        return {
            startTime: startTime,
            endTime: endTime,
            creationTime: new Date().toJSON(),
        };
    },

    deserialize : function (json) {
        return new TimeRange(json);
    }

};

const timeRangeRepository = {
    saveHangoutTime: saveHangoutTime,
    getHangoutTime: createTimeRangePromise,
    cleanUpOldEntries: cleanUpOldEntries,
    private: {
        isOldEntry: isOldEntry,
        findOldEntryKeys: findOldEntryKeys
    }
};

export default timeRangeRepository;
