define(
    [
        'app/domain/Repository',
        'backbone',
        'keel/BaseView',
        'text!app/widgets/tasks/TaskTemplate.html'
    ],
    function(Repository, Backbone, BaseView, TaskTemplate){
        'use strict';
        return BaseView.extend({
            tagName : 'li',
            template: {
                name: 'TaskTemplate',
                source: TaskTemplate
            },
            elements: [
                'checkboxTask',
                'taskSpan',
                'taskEdit',
                'btnDelete'
            ],
            events: {
                'click .js-checkboxTask': 'toggleClass',
                'dblclick .js-taskSpan': 'makeTaskEditable',
                'blur .js-taskEdit': 'saveEditedTask',
                'click .js-btnDelete': 'deleteTask',
                'keypress .js-taskEdit': 'checkKeysSubmit'
            },
            // listen to the change and destroy event of the model
            initialize : function(){
                this.listenTo(this.model.taskData, 'change', this.modelChanged);
                this.listenTo(this.model.taskData, 'destroy', this.removeTaskView);
            },
            // press enter event in the edit option
            checkKeysSubmit: function(e) {
                if (e.keyCode === 13) {
                    this.saveEditedTask();
                }
            },
            // remove the view
            removeTaskView: function() {
                this.remove();
            },
            // call repository to remove Task
            deleteTask: function() {
                Repository.deleteTask(this.model.taskData);
            },
            // rerender it
            modelChanged: function(){
                this.render();
            },
            toggleClass: function() {
                Repository.toggleCompleted(this.model.taskData);
            },
            makeTaskEditable: function() {
                this.model.edit = true;
                this.render();
                this.taskEditElement.focus();
            },
            saveEditedTask: function() {
                var newTask = this.taskEditElement.val();
                this.model.edit = false;
                Repository.changeItemInTask(this.model.taskData, newTask);
                this.render();
            }
        });
    }
);