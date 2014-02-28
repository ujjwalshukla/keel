/**
 * Copyright 2012 Archfirst
 *
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * app/domain/Repository
 *
 * This is a singleton object that maintains the domain layer of the application.
 * Domain objects in this layer generally live beyond the life of views in the
 * presentation layer. When views are created, they are generally connected to
 * domain objects that are already present in this repository.
 *
 * @author Naresh Bhatia
 */


define(
    [
        'backbone',
        'underscore'
    ],
    function(Backbone, _) {
        'use strict';
        $.support.cors = true;
        // Module level variables act as singletons
        // Task is the model for a row of task with validation of the item not to be empty
        var Task = Backbone.Model.extend({
            defaults: {
                item: '',
                completed: false
            },
            validate: function(attrs) {
                if (attrs.item==='') {
                    return 'Enter Name';
                }
            }
        });
        // _tasks is the collection of Task
        var _tasks = new Backbone.Collection( {model: Task} );
        // model for the markAllCompleted widget
        _tasks.url = 'http://localhost:8081/toDoItems';
        var _repository = {
            getCompletedTasks: function() {
                var filtered = _tasks.where( {completed : true} );
                return filtered.length;
            },
            getRemainingTasks: function() {
                var filtered = _tasks.where( {completed : false} );
                return filtered.length;
            },
            // it deletes a particular task
            // @params {object} task that has to be deleted
            deleteTask: function(task) {
                task.destroy();
            },
            // change the status of all tasks as required
            // @params {boolean} this is used to set the completed of all the tasks
            changeStatusAllTask: function(status) {
                _tasks.each(function(m){
                    m.set('completed', status);
                    m.save();
                });
            },
            // destroys all the task which have been completed
            deleteCompletedTasks: function() {
                var completedCollection = _tasks.where({completed: true});
                _.invoke(completedCollection, 'destroy');
            },
            // changes the item value of the task
            // params {object} the task whose item value has to be changed
            // params {string} the new item value
            changeItemInTask: function (task, item) {
                if (item!==''){
                    task.set('item', item, {validate: true});
                    task.save();
                }
            },
            // add new item in tasks
            // @params {string} the value of item for the new task
            addItemInTasks: function(item) {
                var task = new Task();
                task.set('item', item, {validate: true});
                if(!task.validationError) {
                    _tasks.create(task);
                }
            },
            // toggles the completed value of the task
            // @params {object} task whose completed attribute need to be changed
            toggleCompleted: function(task) {
                task.set('completed',!(task.get('completed')));
                task.save();
            },
            // that returns the collection for TasksWidget
            // @return {object} collection of Task
            getTasks: function() { return _tasks; },
            // fetches the tasks from the server
            fetchTasks: function() {
                _tasks.fetch();
            },
            // saves the task to the server
            saveTask: function (task) {
                task.save();
            }
        };

        return _repository;
    }
);