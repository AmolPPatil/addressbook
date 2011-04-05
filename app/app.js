Ext.regApplication({
	name : 'app',
	launch : function() {
		this.launched = true;
		this.mainLaunch();
	},
	mainLaunch : function() {
		if (!device || !this.launched) {
			return;
		}
		this.views.viewport = new this.views.Viewport();
		// birthDayTicker();
	}
});

function birthDayTicker() {
	var today = new Date();
	var str = "";
	app.stores.contacts.each(function(record) {
		record.fields.each(function(field) {
			var bday = record.get('birthday');
			if (bday != null && bday.getMonth() == today.getMonth()
					&& bday.getDate() == today.getDate()) {
				var name = record.get('givenName');
				if (str.indexOf(name) == -1) {
					str += "<a onClick='javascript:gotoDetail("
							+ record.get('id') + ");' >" + name + " "
							+ record.get('familyName') + " ("
							+ (today.getFullYear() - bday.getFullYear())
							+ ")  </a>  ";
				}
			}
		});
	});
	var item = Ext.getCmp('ticker');
	var listpanel = Ext.getCmp('listpanel');
	if (str == "") {
		// if (item.isVisible()) {
		// item.setHeight(1);
		// item.hide();
		// item.setVisible(false);
		// listpanel.addDocked(item);
		hideTicker();
		item.doLayout();
		listpanel.doLayout();
		// }
	} else {
		// if (item.isVisible() == false) {
		// item.show();
		// item.setVisible(true);
		// item.setHeight(18);
		// listpanel.addDocked(item);
		showTicker();
		item.doLayout();
		listpanel.doLayout();
		// }
		// startticker("<img border='0' height='15px' width='15px'
		// src='birthday.jpeg' title='Birthday'><b>BirthDay</b>: "
		// + str);
		startticker("<b>BirthDay</b>: " + str);
	}

	// Ext.getCmp('ticker').hide();
}
gotoDetail = function(id) {
	Ext.dispatch({
		controller : app.controllers.contacts,
		action : 'show',
		id : id
	});
};
function hideTicker() {
	document.getElementById("ticker").style.height = "1px";
	document.getElementById("ticker").style.visibility = "hidden";
	document.getElementById("ticker").style.display = "none";
}

function showTicker() {
	document.getElementById("ticker").style.height = "16px";
	document.getElementById("ticker").style.visibility = "visible";
	document.getElementById("ticker").style.display = "block";
}