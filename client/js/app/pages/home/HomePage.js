/**
 * Copyright 2013 Archfirst
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * app/pages/home/HomePage
 *
 * @author Ujjwal Shukla
 */
define(
    [
        'app/domain/Repository',
        'app/widgets/header/HeaderWidget',
        'app/widgets/tasks/TasksWidget',
        'keel/BaseView',
        'text!app/pages/home/HomePageTemplate.html'
    ],
    function(Repository,HeaderWidget,TasksWidget, BaseView, HomePageTemplate) {
        'use strict';
        return BaseView.extend({
            tagName: 'main',
            id: 'home-page',

            template: {
                name: 'HomePageTemplate',
                source: HomePageTemplate
            },
            elements : [
                'header',
                'tasksArea'
            ],
            // Add children in the page after rendering
            postRender: function() {
                this.addChildren([
                    {
                        id: 'HeaderWidget',
                        viewClass: HeaderWidget,
                        parentElement: this.headerElement
                    },
                    {
                        // tasks is the collection
                        id: 'TasksWidget',
                        viewClass: TasksWidget,
                        parentElement: this.tasksAreaElement,
                        options: {
                            collection: Repository.getTasks()
                        }
                    }
                ]);
            }
        });
    }
);