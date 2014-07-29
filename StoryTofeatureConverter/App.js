var selectedRecords = [];
Ext.define('CustomApp', {
    extend: 'Rally.app.App',
    componentCls: 'app',
    items:{ html:'<a href="https://help.rallydev.com/apps/2.0rc3/doc/">App SDK 2.0rc3 Docs</a>'},
    launch: function() {
       // var selectedRecords = [];
        var grid = this.add({
            xtype: 'rallygrid',
            columnCfgs: ['FormattedID','Name','JiraID','FixVersion'],
            context: this.getContext(),
            enableEditing: false,
            enableBulkEdit:true,
            storeConfig: {
                model: 'userstory'
            },
            listeners: {
                select: this._onSelect,
                deselect: this._onDeselect,
                load: function(){
                    var records = grid.getStore();
                    console.log(records.count());
                }
            }
        });
        this.add({
            xtype: 'rallybutton',
            text: 'Convert to Feature',
            listeners: {
                click: this._convertToPortfolioItem
            }
/*            handler: function() { 
                console.log('Converting selected to feature');
                var a = this._convertToPortfolioItem();
            }*/
        });
/*        this.add({
            xtype: 'rallybutton',
            text: 'Convert all',
            handler: function() { 
                console.log('converting all to feature'); 
            }
        });*/                
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
        var that = this;
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


    _convertToPortfolioItem: function(){
        this.record = record;
        function convertToFeature(record){
            Rally.data.ModelFactory.getModal({
                type: 'PortfolioItem/Feature',
                success: this.onModelRetrieved,
                scope: this
            });
            console.log(record);
            return record.get('Name');
        }
        for(var i =0; i < selectedRecords.length; i++){
            var name = convertToFeature(selectedRecords[i]);
            console.log(name);
        }
    },

    onModelRetrieved: function(model){
        this.model = model;
        this.createFeature();
    },

    createFeature: function(){
        var storyName = this.record.get('Name');
        var storyDescription = this.record.get('Description');
        var storyProject = this.record.get('Project');
        var storyReady = this.record.get('Ready');
        var storyComponents = this.record.get('Components');
        var storyFixVersion = this.record.get('FixVersion');
        var storyJiraID = this.record.get('JiraID');


        var newFeature = Ext.create(this.model, {
            Name: storyName,
            Description: storyDescription,
            Project: storyProject,
            Ready: storyReady,
            FixVersion = storyFixVersion,
            JiraID = storyJiraID
        });
       /* newFeature.save({
            callback: function(result, operation) {
                if(operation.wasSuccessful()) {
                    console.log 
                }
            }            
        })*/
    }   
});