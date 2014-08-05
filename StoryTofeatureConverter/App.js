var selectedRecords = [];
var that;
Ext.define('CustomApp', {
    extend: 'Rally.app.App',
    componentCls: 'app',
    items:{ html:'<a href="https://help.rallydev.com/apps/2.0rc3/doc/">App SDK 2.0rc3 Docs</a>'},
    launch: function() {
        that = this;
        var current;
        var grid = this.add({
            xtype: 'rallygrid',
            columnCfgs: ['FormattedID','Name','JiraID','FixVersion', 'Components'],
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
            text: 'Convert to Feature',
            listeners: {
                click: this._convertToFeature
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

    _confirmConversion: function(){
        console.log(that);
        console.log('clicked');
        console.log('In confirm conversion');
        if(selectedRecords.length === 0){
            console.log('In confirmation');
            Ext.create('Rally.ui.dialog.ConfirmDialog', {
                title: "Confirm Portfolio item Conversion",
                message: 'Are you sure?',
                confirmLabel: 'Yes',
                modal: true,
                listeners: {
                    confirm: function(){
                        console.log('in confirm');
                        that._convertToPortfolioItem();
                    }
                }
            });           
        }
        else{
            Ext.create('Rally.ui.dialog.ConfirmDialog', {
                title: "Confirm Portfolio item Conversion",
                message: 'Please select at least one user story to convert',
                confirmLabel: 'Okay',
                modal: true,
                listeners: {
                    confirm: this.close
                }
            });
        }
    },
    
    _convertToFeature: function(){
        console.log('in convertToFeature');
        Rally.data.ModelFactory.getModel({
            type: 'PortfolioItem/Feature',
            success: that.onModelRetrieved,
            scope: this
        });
    },

    onModelRetrieved: function(model){
        console.log('in on model retrieved');
        that.model = model;
        that.createFeature();
    },

    createFeature: function(){
        for(var i =0; i < selectedRecords.length; i++){
            var current = selectedRecords[i];
            console.log('In create feature');
            var storyName = current.get('Name');
            var storyDescription = current.get('Description');
            var storyProject = current.get('Project');
            var storyReady = current.get('Ready');
            var storyComponents = current.get('Components');
            var storyFixVersion = current.get('c_FixVersion');
            var storyJiraID = current.get('c_JiraID');
            console.log('compoennts: ' + storyComponents);

            var newFeature = Ext.create(this.model, {
                Name: storyName,
                Description: storyDescription,
                Project: storyProject,
                Ready: storyReady,
                c_Components: storyComponents,
                c_FixVersion: storyFixVersion,
                c_JiraID: storyJiraID
            });

            console.log(newFeature);
            newFeature.save({
                callback: function(result, operation) {
                    if(operation.wasSuccessful()) {
                        console.log(result.get('Name'));
                    }
                }            
            });
        }
    }   
});
