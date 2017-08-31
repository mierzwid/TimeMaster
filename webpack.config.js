/*******************************************************************************
 * Copyright © 2015 Hoffmann-La Roche
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


var path = require('path');
var ChromeDevPlugin = require('chrome-dev-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');

var sourcePath = path.join(__dirname, 'src');
var distPath = path.join(__dirname, 'dist');

var calendarPath = path.join(sourcePath, "js/calendar/");
var hangoutPath = path.join(sourcePath, "js/hangouts/");
var libPath = path.join(sourcePath, "js/lib/");

const config = {
    context: path.resolve(sourcePath),
    entry: {
        calendar: path.join(calendarPath, 'timeMaster.js'),
        hangouts: [
            path.join(hangoutPath, 'timeMaster.js'),
            path.join(libPath, 'analytics.js')],
    },
    output: {
        filename: '[name].js',
        path: path.resolve(distPath)
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [ 'style-loader', 'css-loader' ]
            },
            {
                test: /\.js$/,
                enforce: 'pre',
                exclude: /node_modules|lib/,
                use: [
                    {
                        loader: 'eslint-loader',
                        options: {
                            failOnWarning: false,
                            failOnError: true
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new ChromeDevPlugin({
            //Sets the logging functions
            log:console.log,
            warm:console.warn,
            error:console.error,
        }),
        new CopyWebpackPlugin([{ from: 'res/*'}])
    ]
};

module.exports = config;