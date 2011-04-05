Ext.data.ProxyMgr.registerType("contactstorage", Ext.extend(Ext.data.Proxy, {

	create : function(operation, callback, scope) {
	},

	read : function(operation, callback, scope) {
		var thisProxy = this;
//		navigator.notification.alert('You are the winner!', 'Game Over', 'Done');
		navigator.service.contacts.find([ 'id', 'name', 'emails',
				'phoneNumbers', 'addresses', 'birthday' ], function(
				deviceContacts) {
			// loop over deviceContacts and create Contact model instances
			var contacts = [];
			for ( var i = 0; i < deviceContacts.length; i++) {
				// var deviceContact = deviceContacts[i];
				// var output = '';
				// for (property in deviceContact) {
				// output += property + ': ' + deviceContact[property] + '; ';
				// }
				// alert(output);
				// var deviceContact = deviceContacts[i].name;
				// var output = '';
				// for (property in deviceContact) {
				// output += property + ': ' + deviceContact[property] + '; ';
				// }
				// alert(output);
				var deviceContact = deviceContacts[i];
				var familyname = '';
				if (deviceContact.name.hasOwnProperty('familyName')) {
					familyname = deviceContact.name.familyName;
				}
				var contact = new thisProxy.model({
					id : deviceContact.id,
					givenName : deviceContact.name.givenName,
					familyName : familyname,
					// familyName: deviceContact.name.formatted,
					emails : deviceContact.emails,
					birthday : deviceContact.birthday,
					phoneNumbers : deviceContact.phoneNumbers
				});
				contact.deviceContact = deviceContact;
				contacts.push(contact);
			}

			// return model instances in a resultset
			operation.resultSet = new Ext.data.ResultSet({
				records : contacts,
				total : contacts.length,
				loaded : true
			});

			// announce success
			operation.setSuccessful();
			operation.setCompleted();

			// finish with callback
			if (typeof callback == "function") {
				callback.call(scope || thisProxy, operation);
			}

		}, function() {
		}, {
			limit : 100
		}

		);
	},

	update : function(operation, callback, scope) {
		operation.setStarted();

		// put model data back into deviceContact
		var deviceContact = operation.records[0].deviceContact;
		var contact = operation.records[0].data;
		deviceContact.name.givenName = contact.givenName;
		deviceContact.name.familyName = contact.familyName;
		deviceContact.birthday = contact.birthday;

		// save back via PhoneGap
		var thisProxy = this;
		deviceContact.save(function() {

			// announce success
			operation.setCompleted();
			operation.setSuccessful();

			// finish with callback
			if (typeof callback == 'function') {
				callback.call(scope || thisProxy, operation);
			}
		});
	},

	destroy : function(operation, callback, scope) {
	}

}));

app.models.Contact = Ext.regModel("app.models.Contact", {
	fields : [ {
		name : "id",
		type : "int"
	}, {
		name : "givenName",
		type : "string"
	}, {
		name : "familyName",
		type : "string"
	}, {
		name : "emails",
		type : "auto"
	}, {
		name : "birthday",
		dateFormat : "m-d-Y",
		type : "date"
	}, {
		name : "phoneNumbers",
		type : "auto"
	}, ],
	proxy : {
		type : "contactstorage"
	}
});

app.stores.contacts = new Ext.data.Store({
	model : "app.models.Contact",
	// sorters : 'familyName',
	sorters : 'givenName',
	getGroupString : function(record) {
		// return record.get('familyName')[0];
		return record.get('givenName')[0];
	}
});
