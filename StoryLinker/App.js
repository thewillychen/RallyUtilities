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
        columnCfgs: ['FormattedID','Name','JiraID','FixVersion', 'c_EpicTheme'],
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
        text: 'Link to Parent Epic',
        listeners: {
            click: this._linkToParentEpic
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
        var epicID = currentRecord.get('c_EpicTheme');
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
                that._updateStoryParent(epicStore, currentRecord);
                }
        });
    },

    _updateStoryParent: function(epicStore, currentRecord){
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
    },


    _check: function(epicStore){
        console.log(epicStore);
        console.log(epicStore.getAt(0));
    },

    _linkToParentEpic: function(){
        for(var i =0; i < selectedRecords.length; i++){
            var currentRecord = selectedRecords[i];
            that._findAndLink(currentRecord);
        }
    }
});
