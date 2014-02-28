define(
    [
        'app/domain/Repository',
        'backbone',
        'keel/BaseView',
        'text!app/widgets/tasks/TasksTemplate.html',
        'app/widgets/tasks/TaskWidget'
    ],
    function(Repository, Backbone, BaseView, TasksTemplate, TaskWidget){
        'use strict';
        return BaseView.extend({
            tagName : 'section',
            template: {
                name: 'TasksTemplate',
                source: TasksTemplate
            },
            elements: [
                'inputBox',
                'newTask',
                'checkboxAll',
                'ulArea',
                'countTasksArea',
                'countRemaining',
                'btnDeleteCompleted',
                'taskSelected',
                'markAllCompleted'
            ],
            initialize : function() {
                this.listenTo(this.collection, 'all', this.syncAllNumbers);
                this.listenTo(this.collection, 'add', this.onOrderAddedEvent);
                Repository.fetchTasks();
            },
            onOrderAddedEvent : function(e){
                var newModel = {taskData: e, edit: false};
                var taskRow = new TaskWidget({model : newModel});
                this.ulAreaElement.append(taskRow.render().$el);
                this.syncAllNumbers();
                return this;
            },
            events: {
                'click .js-btnDeleteCompleted': 'deleteAllCompleted',
                'keypress .js-inputBox': 'checkKeyPressed',
                'focus .js-inputBox': 'hidePlaceholder',
                'blur .js-inputBox': 'showPlaceHolder',
                'click .js-checkboxAll': 'completeAllTasks'
            },
            // placeholder work around
            hidePlaceholder: function() {
                if (!this.inputBoxElement.val() || this.inputBoxElement.hasClass('placeHolder')) {
                    this.inputBoxElement
                        .removeClass('placeHolder')
                        .val('');
                }
            },
            showPlaceHolder: function() {
                if (!this.inputBoxElement.val()) {
                    this.inputBoxElement
                        .addClass('placeHolder')
                        .val('Enter To Do Item');
                }
            },
            // for submitting value on pressing enter
            checkKeyPressed: function(e) {
                // check if enter is pressed
                if (e.keyCode === 13) {
                    e.preventDefault();
                    this.createNewTask();
                    this.removeInputBoxText();
                    this.showPlaceHolder();
                    e.target.blur();
                }
            },
            // create new task using value from text box
            createNewTask: function() {
                var newItem = $(this.inputBoxElement).val();
                Repository.addItemInTasks(newItem);
            },
            removeInputBoxText:function() {
                $(this.inputBoxElement).val('');
            },
            // adding placeholder in the postRender
            postRender: function() {
                this.showPlaceHolder();
                this.syncAllNumbers();
            },
            deleteAllCompleted: function() {
                // all tasks are deleted
                Repository.deleteCompletedTasks();
                this.syncAllNumbers();
                // all the counters are synced
            },
            completeAllTasks: function(e) {
                // change the completed attribute of all the task
                Repository.changeStatusAllTask(e.target.checked);
            },
            syncAllNumbers: function() {
                var completedTasks = Repository.getCompletedTasks(),
                    remainingTasks = Repository.getRemainingTasks(),
                    totalTasks = completedTasks+remainingTasks;
                if (totalTasks > 0) {
                    $(this.markAllCompletedElement).show();
                    $(this.countTasksAreaElement).show();
                    if (completedTasks > 0) {
                        this.taskSelectedElement.html(completedTasks);
                        this.btnDeleteCompletedElement.attr('hidden',false);
                    } else {
                        this.btnDeleteCompletedElement.attr('hidden',true);
                    }
                    this.countRemainingElement.html(remainingTasks);
                    if (totalTasks === completedTasks) {
                        this.checkboxAllElement.attr('checked', true);
                    } else {
                        this.checkboxAllElement.attr('checked', false);
                    }
                } else {
                    $(this.markAllCompletedElement).hide();
                    $(this.countTasksAreaElement).hide();
                }
            }
        });
    }
);