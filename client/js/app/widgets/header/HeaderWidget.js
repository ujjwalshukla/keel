define(
    [
        'backbone',
        'keel/BaseView',
        'text!app/widgets/header/HeaderTemplate.html'
    ],

    function(Backbone, BaseView, HeaderTemplate) {
        'use strict';

        return BaseView.extend({
            tagName: 'Header',

            template: {
                name: 'HeaderTemplate',
                source: HeaderTemplate
            }
        });
    }
);