/*Author: Willy Chen
Email: Willy.Chen@duke.edu
Links features created from imported jira epics to their parent initaitves
Dependencies: The initiatives are for each quarter of the year and have appropriate planned start date amd planned end date values. 
The feature has to have a components field value corresponding to its theme (whether full name or rally id). FixVersion should be a format of Month Year: August 2014 or Aug 2014.
Behavior: All selected epics will be attempted to be linked to the correct parent, whether or not they already have a parent*/
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
            columnCfgs: ['FormattedID','Name','JiraID','FixVersion', 'c_EpicTheme', 'c_Components', 'Parent'],
            context: this.getContext(),
            enableEditing: false,
            enableBulkEdit:true,
            storeConfig: {
                model: 'PortfolioItem/Feature'
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
            text: 'Link to Parent Initiative',
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
                title: "Confirm link to parent initiative",
                message: 'Are you sure?',
                confirmLabel: 'Yes',
                modal: true,
                listeners: {
                    confirm: that._linkFeatures
                }
            });           
        }
        else{
            console.log('in else');
            Ext.create('Rally.ui.dialog.ConfirmDialog', {
                title: "Confirm link to parent initiative",
                message: 'Please select at least one feature to clink',
                confirmLabel: 'Okay',
                modal: true,
            });
        }
    },

    _linkFeatures: function(){
        for(var i =0; i < selectedRecords.length; i++){
            var currentRecord = selectedRecords[i];
            that._getInitiatives(currentRecord);
        }
    },    

    _getInitiatives: function(currentRecord){
        var initiativeStore = Ext.create('Rally.data.wsapi.Store', {
            model: 'PortfolioItem/Initiative',
        });

        initiativeStore.load({
            callback: function(records, operation, success){
                that._findParentInitiative(initiativeStore, currentRecord);
            }
        });
    },

    _findParentInitiative: function(initiativeStore, currentRecord){
        var dt = new Date();
        var monthYear = currentRecord.get('c_FixVersion');
        dt = Ext.Date.parse(monthYear, 'M Y');
        if(!dt){
            dt = Ext.Date.parse(monthYear,'F Y');
        }
        console.log(dt);

        for(var i = 0; i < initiativeStore.getCount(); i++){
            var currentInitiative = initiativeStore.getAt(i);
            var startDate = currentInitiative.get('PlannedStartDate');
            var endDate = currentInitiative.get('PlannedEndDate');
            if(Ext.Date.between(dt, startDate, endDate) && that._checkInitiative(currentInitiative,currentRecord)){
                console.log('Matched feature to initiative: ' + currentInitiative.get('Name'));
                that._linkFeatureToParent(currentInitiative, currentRecord);
            }
        }
    },

    _checkInitiative: function(currentInitiative, currentRecord){
        var name = currentInitiative.get('Name');
        var components = currentRecord.get('c_Components');
        return (name.indexOf(components) > -1 || components.indexOf(currentInitiative.get('FormattedID')) > -1);
    },

    _linkFeatureToParent: function(currentInitiative, currentRecord){
        currentRecord.set('Parent', currentInitiative.get('_ref'));
        currentRecord.save({
            callback: function(result, operation) {
                if(operation.wasSuccessful()) {
                    console.log('Succesful Update for ' + currentRecord.get('Name'));
                }
            }
        });
    }
});
