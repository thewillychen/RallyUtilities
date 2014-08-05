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
            columnCfgs: ['FormattedID','Name','JiraID','FixVersion', 'c_EpicTheme', 'c_Components'],
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
                click: this._linkToParentInitiative
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
    _findAndLink: function(currentRecord){
        var initiativeStore = Ext.create('Rally.data.wsapi.Store', {
            model: 'PortfolioItem/Initiative',
/*            filters: [
                {
                    //could potentially change this to filter based on the time without having to do the overall loop? will try later for higher performance after wokrign
                }
                ]*/
            });

        initiativeStore.load({
            callback: function(records, operation, success){
                console.log(initiativeStore);
                that._updateFeature(initiativeStore, currentRecord);
            }
        });
    },

    _updateFeature: function(initiativeStore, currentRecord){
        var dt = new Date();
        var monthYear = currentRecord.get('c_FixVersion');
        dt = Ext.Date.parse(monthYear, 'M Y');
        if(!dt){
            dt = Ext.Date.parse(monthYear,'F Y');
        }
        console.log(dt);

        for(var i = 0; i < initiativeStore.getCount(); i++){
            var currentInitiative = initiativeStore.getAt(i);
            console.log(currentInitiative);
            var startDate = currentInitiative.get('PlannedStartDate');
            var endDate = currentInitiative.get('PlannedEndDate');
            if(Ext.Date.between(dt, startDate, endDate) && that._checkInitiative(currentInitiative,currentRecord)){
                console.log('Matched feature to initiative: ' + currentInitiative.get('Name'));
                that._updateEpic(currentInitiative, currentRecord);
            }

        }
    },

    _checkInitiative: function(currentInitiative, currentRecord){
        var name = currentInitiative.get('Name');
        var components = currentRecord.get('c_Components');
        return (name.indexOf(components) > -1 || name.indexOf(currentInitiative.get('FormattedID')));
    },

    _updateEpic: function(currentInitiative, currentRecord){
        currentRecord.set('Parent', currentInitiative.get('_ref'));
        currentRecord.save({
            callback: function(result, operation) {
                if(operation.wasSuccessful()) {
                    console.log('SuccesfulUpdate for ' + currentRecord.get('Name'));
                }
            }
        });
    },

    _linkToParentInitiative: function(){
        for(var i =0; i < selectedRecords.length; i++){
            var currentRecord = selectedRecords[i];
            that._findAndLink(currentRecord);
        }
    }
});
