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
        // var records = grid.getStore();
        // console.log(records.count());

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
        this.add({
            xtype: 'rallybutton',
            text: 'Convert all',
            handler: function() { 
                console.log('converting all to feature'); 
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
/*    _getArray: function(){
        return selectedRecords;
    },
    _updateArray: function(array){
        selectedRecords = array;
    }
*/
    _convertToPortfolioItem: function (record) {
        // var message = "Are you sure you want to convert {0} to a Portfolio Item?<br/><br/>" +
        // "Children and attachments for { q0} will be moved to the new Portfolio Item." +
        // " Other work items (e.g., Defects) will remain associated with {0}.";


        // this.confirmationDialog = Ext.create('Rally.ui.dialog.ConfirmDialog', {
        //     title: "Confirm Portfolio Item Conversion",
        //     message: "Are you sure to want to do that?",
        //     //message: Ext.String.format(message, this.getRecord().get('FormattedID')),
        //     confirmLabel: 'Convert',
        //     modal: true,
        //     listeners: 
        //         },                //cancel: Ext.emptyFn,
        //         scope: this
        //     }
        // });
    },    
});

function _commitConvertToPortfolioItem(){
    console.log('Made it into commit convert Function');
}
