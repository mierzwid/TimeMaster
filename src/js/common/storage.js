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

import log from './log.js';

// Storage based on chrome extension storage mechanism: https://developer.chrome.com/extensions/storage

const save = function (id, object) {
    let storageObject = {[id]: object};

    const savePromise = new Promise((resolve, reject) => {
        chrome.storage.local.set(storageObject, function() {
            if (chrome.runtime.lastError) {
                reject('Unable to save objects to storage: ' + chrome.runtime.lastError);
            } else {
                log.info('Object saved to storage:', id, '=', JSON.stringify(object));
                resolve(object);
            }
        });
    });
    return savePromise;
};

const get = function (id){
    const getObjectPromise = new Promise((resolve, reject) => {
        chrome.storage.local.get(id, function(storageObject){
            if (storageObject && storageObject[id]){
                const object = storageObject[id];
                log.info('Object read from storage: ', id, '=', JSON.stringify(object));
                resolve(object);
            } else {
                reject('Object not found for id: '+id);
            }
        });
    });
    return getObjectPromise;

};

const getAll = function () {
    const getAllPromise = new Promise((resolve, reject) => {
        chrome.storage.local.get(null, function(allItems){
            if (chrome.runtime.lastError) {
                reject('Unable to get all items from storage: ' + chrome.runtime.lastError);
            } else {
                log.info('Keys currently in the storage:', Object.keys(allItems));
                resolve(allItems);
            }
        });
    });
    return getAllPromise;
};

const remove = function (ids) {
    const removePromise = new Promise((resolve, reject) => {
        chrome.storage.local.remove(ids, function () {
            if (chrome.runtime.lastError) {
                reject('Unable to remove objects from storage: ' + chrome.runtime.lastError);
            } else {
                log.info('Keys removed from storage:', ids);
                resolve();
            }
        });
    });
    return removePromise;
};

const storage = {
    save: save,
    get: get,
    getAll: getAll,
    remove: remove
};

export default storage;
