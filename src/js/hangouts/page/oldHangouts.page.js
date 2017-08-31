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

const oldHangoutsPage = {
    EMAIL_SPAN: 'span[title]',
    PROGRESS_BAR_CLASS: 'tm-progress-bar-right',
    URL_PREFIX: 'https://hangouts.google.com',

    isOnCompatibleHangoutsPage: () => window.location.href.startsWith(oldHangoutsPage.URL_PREFIX),
    isInitialized: () => document.querySelector(oldHangoutsPage.EMAIL_SPAN) != undefined,
    getEmail: () => document.querySelector(oldHangoutsPage.EMAIL_SPAN).innerHTML,
    getProgressBarClass: () => oldHangoutsPage.PROGRESS_BAR_CLASS
};

export default oldHangoutsPage;