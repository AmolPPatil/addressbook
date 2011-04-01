app.views.ContactsList = Ext.extend(Ext.Panel, {
	dockedItems : [ {
		xtype : 'toolbar',
		title : 'Contacts'
	} ],
	cls : 'demo-list',
	layout : Ext.is.Phone ? 'fit' : {
		type : 'vbox',
		align : 'center',
		pack : 'center'
	},
	items : [ {
		xtype : 'list',
		store : app.stores.contacts,
		itemTpl : '{givenName} {familyName}',
		onItemDisclosure : function(record) {
			Ext.dispatch({
				controller : app.controllers.contacts,
				action : 'show',
				id : record.getId()
			});
		},
		grouped : true,
		indexBar : true
	} ],
	initComponent : function() {
		app.stores.contacts.load();
		app.views.ContactsList.superclass.initComponent.apply(this, arguments);
	}
});