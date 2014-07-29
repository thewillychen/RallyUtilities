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
        text: 'Link to Parent Epic',
        listeners: {
            click: this._linkToParentEpic
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

_linkToParentEpic: function(){
    this.record = record;
    function findAndLink(currentRecord){
        var epicID = record.get('Epic');
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
            callback: function(records, operation){
                if(operation.wasSuccessful() && records.getCount() > 0){
                    var parent = records.getAt(0);
                    console.log(parent);
                        //Get some data/id about the parent 
                        //set record's state of parent to be that parent object
                        //save record
                    }
                }
            } );
/*            Rally.data.ModelFactory.getModel({
            type: 'User Story',
            success: this._onModelRetrieved,
            scope: this
        });*/
}

for(var i =0; i < selectedRecords.length; i++){
    var currentRecord = selectedRecords[i];
    var name = findAndLink(currentRecord);
    console.log(name);
}
    }/*,

    _onModelRetrieved: function(model){
        this.model = model;
        this._updateRecord(model);
    },

    _updateRecord: function(model){

    }*/
});
