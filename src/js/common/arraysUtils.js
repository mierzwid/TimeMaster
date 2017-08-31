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

const arraysUtils = {

    uniqueElements: (element, index, array) => array.indexOf(element) == index,

    arrayify: arrayLikeObject => Array.prototype.slice.call(arrayLikeObject),

    concatenateArrays: (array1, array2) => array1.concat(array2)
};

export default arraysUtils;