app.views.ContactsList = Ext.extend(Ext.Panel, {
	dockedItems : [ {
		xtype : 'toolbar',
		title : 'Contacts',
	}, 
	{   
		height:1,
		dock : 'top',
		html:'',
		id: 'ticker'
	}
],
	cls : 'demo-list',
	layout : Ext.is.Phone ? 'fit' : {
		type : 'vbox',
		align : 'center',
		pack : 'center'
	},
	id:'listpanel',
	items : [ {
		xtype : 'list',
		store : app.stores.contacts,
		itemTpl : '{givenName} {familyName}',
// <img border="0" height="20px" width="20px" alt="Turned 30 today"
// src="birthday.jpeg" title="Birthday">',
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
		app.stores.contacts.load(function(records, operation, success) {
			birthDayTicker();
		});
		app.views.ContactsList.superclass.initComponent.apply(this, arguments);		
	}
});