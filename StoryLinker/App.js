/*Author: Willy Chen
Email: Willy.Chen@duke.edu
Links imported user stories from Jira to their parent Epic/Feature in Rally
Dependencies: The imported user story has a epic/theme value and this specified epic/theme from jira is a Feature with its jiraID stored in the jiraID custom field in Rally.*/
var selectedRecords = [];
var that;
Ext.define('CustomApp', {
    extend: 'Rally.app.App',
    componentCls: 'app',
    items:{ html:'<a href="https://help.rallydev.com/apps/2.0rc3/doc/">App SDK 2.0rc3 Docs</a>'},
    launch: function() {
        that = this;
        var grid = this.add({
            xtype: 'rallygrid',
            columnCfgs: ['FormattedID','Name','JiraID', 'c_EpicTheme', 'PortfolioItem'],
            context: this.getContext(),
            enableEditing: false,
            enableBulkEdit:true,
            storeConfig: {
                model: 'userstory'
            },
            listeners: {
                select: this._onSelect,
                deselect: this._onDeselect
            }
        });
        this.add({
            xtype: 'rallybutton',
            text: 'Link to Parent Epic',
            listeners: {
                click: this._confirmLink
            }
        });      
    },

    _onSelect: function(rowModel, record, rowIndex, options) {
        console.log('onSelect');
        selectedRecords.push(record);
        console.log(record);
    },

    _onDeselect: function(rowModel, record, rowIndex, options) {
        console.log('onDeSelect');
        var index = selectedRecords.indexOf(record);
        if(index != -1){
            selectedRecords.splice(index, 1);
        }
        console.log(selectedRecords);
    },

    _confirmLink: function(){
        console.log('In confirm Link');
        if(selectedRecords.length > 0){
            Ext.create('Rally.ui.dialog.ConfirmDialog', {
                title: "Confirm link to parent feature",
                message: 'Are you sure?',
                confirmLabel: 'Yes',
                modal: true,
                listeners: {
                    confirm: that._linkStories
                }
            });           
        }
        else{
            console.log('in else');
            Ext.create('Rally.ui.dialog.ConfirmDialog', {
                title: "Confirm link to parent feature",
                message: 'Please select at least one user story to clink',
                confirmLabel: 'Okay',
                modal: true,
            });
        }
    },

    _linkStories: function(){
        for(var i =0; i < selectedRecords.length; i++){
            var currentRecord = selectedRecords[i];
            that._findParentFeature(currentRecord);
        }
    },

    _findParentFeature: function(currentRecord){
        var epicID = currentRecord.get('c_EpicTheme');
        var currentParent = currentRecord.get('PortfolioItem');
        if(!currentParent && epicID !== currentParent.get('c_JiraID')){
            var epicStore = Ext.create('Rally.data.wsapi.Store', {
                model: 'PortfolioItem/Feature',
                filters: [
                    {
                        property: 'JiraID',
                        operator: '=',
                        value: epicID
                    }
                ]
            });

            epicStore.load({
                callback: function(records, operation, success){
                    that._linkStoryToParent(epicStore, currentRecord);
                }
            });
        }
        else{
            console.log('Has correct parent already');
        }
    },

    _linkStoryToParent: function(epicStore, currentRecord){
        var parent = epicStore.getAt(0);
        console.log(parent);
        currentRecord.set('PortfolioItem', parent.get('_ref'));
        currentRecord.save({
            callback: function(result, operation) {
                if(operation.wasSuccessful()) {
                    console.log('SuccesfulUpdate for ' + currentRecord.get('Name'));
                }
            }
        });
    }
});
