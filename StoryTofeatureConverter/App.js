Ext.define('CustomApp', {
    extend: 'Rally.app.App',
    componentCls: 'app',
    items:{ html:'<a href="https://help.rallydev.com/apps/2.0rc3/doc/">App SDK 2.0rc3 Docs</a>'},
    launch: function() {
        this.add({
            xtype: 'rallybutton',
            text: 'Button!',
            handler: function() { 
                console.log('Clicked!'); 
            }
        });
    },

    _onRallyGridLoad: function() {

    }

});
