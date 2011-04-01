var _anomFunkMap = {};
var _anomFunkMapNextId = 0;
function anomToNameFunk(fun) {
	var funkId = "f" + _anomFunkMapNextId++;
	var funk = function() {
		fun.apply(this, arguments);
		_anomFunkMap[funkId] = null;
		delete _anomFunkMap[funkId]
	};
	_anomFunkMap[funkId] = funk;
	return "_anomFunkMap." + funkId
}
function GetFunctionName(fn) {
	if (fn) {
		var m = fn.toString().match(/^\s*function\s+([^\s\(]+)/);
		return m ? m[1] : anomToNameFunk(fn)
	} else {
		return null
	}
}
if (typeof (DeviceInfo) != "object") {
	DeviceInfo = {}
}
PhoneGap = {
	queue : {
		ready : true,
		commands : [],
		timer : null
	},
	_constructors : []
};
PhoneGap.available = DeviceInfo.uuid != undefined;
PhoneGap.addConstructor = function(func) {
	var state = document.readyState;
	if ((state == "loaded" || state == "complete") && DeviceInfo.uuid != null) {
		func()
	} else {
		PhoneGap._constructors.push(func)
	}
};
(function() {
	var timer = setInterval(function() {
		var state = document.readyState;
		if ((state == "loaded" || state == "complete")
				&& DeviceInfo.uuid != null) {
			clearInterval(timer);
			while (PhoneGap._constructors.length > 0) {
				var constructor = PhoneGap._constructors.shift();
				try {
					constructor()
				} catch (e) {
					if (typeof (debug.log) == "function") {
						debug.log("Failed to run constructor: "
								+ debug.processMessage(e))
					} else {
						alert("Failed to run constructor: " + e.message)
					}
				}
			}
			var e = document.createEvent("Events");
			e.initEvent("deviceready");
			document.dispatchEvent(e)
		}
	}, 1)
})();
PhoneGap.exec = function() {
	PhoneGap.queue.commands.push(arguments);
	if (PhoneGap.queue.timer == null) {
		PhoneGap.queue.timer = setInterval(PhoneGap.run_command, 10)
	}
};
PhoneGap.run_command = function() {
	if (!PhoneGap.available || !PhoneGap.queue.ready) {
		return
	}
	PhoneGap.queue.ready = false;
	var args = PhoneGap.queue.commands.shift();
	if (PhoneGap.queue.commands.length == 0) {
		clearInterval(PhoneGap.queue.timer);
		PhoneGap.queue.timer = null
	}
	var uri = [];
	var dict = null;
	for ( var i = 1; i < args.length; i++) {
		var arg = args[i];
		if (arg == undefined || arg == null) {
			continue
		}
		if (typeof (arg) == "object") {
			dict = arg
		} else {
			uri.push(encodeURIComponent(arg))
		}
	}
	var url = "gap://" + args[0] + "/" + uri.join("/");
	if (dict != null) {
		url += "?" + encodeURIComponent(JSON.stringify(dict))
	}
	document.location = url
};
PhoneGap.clone = function(obj) {
	if (!obj) {
		return obj
	}
	if (obj instanceof Array) {
		var retVal = new Array();
		for ( var i = 0; i < obj.length; ++i) {
			retVal.push(PhoneGap.clone(obj[i]))
		}
		return retVal
	}
	if (obj instanceof Function) {
		return obj
	}
	if (!(obj instanceof Object)) {
		return obj
	}
	if (obj instanceof Date) {
		return obj
	}
	retVal = new Object();
	for (i in obj) {
		if (!(i in retVal) || retVal[i] != obj[i]) {
			retVal[i] = PhoneGap.clone(obj[i])
		}
	}
	return retVal
};
function Acceleration(x, y, z) {
	this.x = x;
	this.y = y;
	this.z = z;
	this.timestamp = new Date().getTime()
}
function AccelerationOptions() {
	this.timeout = 10000
}
function Accelerometer() {
	this.lastAcceleration = new Acceleration(0, 0, 0)
}
Accelerometer.prototype.getCurrentAcceleration = function(successCallback,
		errorCallback, options) {
	if (typeof successCallback == "function") {
		successCallback(this.lastAcceleration)
	}
};
Accelerometer.prototype._onAccelUpdate = function(x, y, z) {
	this.lastAcceleration = new Acceleration(x, y, z)
};
Accelerometer.prototype.watchAcceleration = function(successCallback,
		errorCallback, options) {
	var frequency = (options != undefined && options.frequency != undefined) ? options.frequency
			: 10000;
	var updatedOptions = {
		desiredFrequency : frequency
	};
	PhoneGap.exec("Accelerometer.start", options);
	return setInterval(function() {
		navigator.accelerometer.getCurrentAcceleration(successCallback,
				errorCallback, options)
	}, frequency)
};
Accelerometer.prototype.clearWatch = function(watchId) {
	PhoneGap.exec("Accelerometer.stop");
	clearInterval(watchId)
};
PhoneGap.addConstructor(function() {
	if (typeof navigator.accelerometer == "undefined") {
		navigator.accelerometer = new Accelerometer()
	}
});
function Camera() {
}
Camera.prototype.getPicture = function(successCallback, errorCallback, options) {
	PhoneGap.exec("Camera.getPicture", GetFunctionName(successCallback),
			GetFunctionName(errorCallback), options)
};
Camera.prototype.PictureSourceType = {
	PHOTOLIBRARY : 0,
	CAMERA : 1,
	SAVEDPHOTOALBUM : 2
};
Camera.DestinationType = {
	DATA_URL : 0,
	FILE_URI : 1
};
Camera.prototype.DestinationType = Camera.DestinationType;
PhoneGap.addConstructor(function() {
	if (typeof navigator.camera == "undefined") {
		navigator.camera = new Camera()
	}
});
var Contact = function(id, displayName, name, nickname, phoneNumbers, emails,
		addresses, ims, organizations, published, updated, birthday,
		anniversary, gender, note, preferredUsername, photos, tags,
		relationships, urls, accounts, utcOffset, connected) {
	this.id = id || null;
	this.displayName = displayName || null;
	this.name = name || null;
	this.nickname = nickname || null;
	this.phoneNumbers = phoneNumbers || null;
	this.emails = emails || null;
	this.addresses = addresses || null;
	this.ims = ims || null;
	this.organizations = organizations || null;
	this.published = published || null;
	this.updated = updated || null;
	this.birthday = birthday || null;
	this.anniversary = anniversary || null;
	this.gender = gender || null;
	this.note = note || null;
	this.preferredUsername = preferredUsername || null;
	this.photos = photos || null;
	this.tags = tags || null;
	this.relationships = relationships || null;
	this.urls = urls || null;
	this.accounts = accounts || null;
	this.utcOffset = utcOffset || null;
	this.connected = connected || null
};
Contact.prototype.convertDatesOut = function() {
	var dates = new Array("published", "updated", "birthday", "anniversary");
	for ( var i = 0; i < dates.length; i++) {
		var value = this[dates[i]];
		if (value) {
			if (!value instanceof Date) {
				try {
					value = new Date(value)
				} catch (exception) {
					value = null
				}
			}
			if (value instanceof Date) {
				value = value.valueOf()
			}
			this[dates[i]] = value
		}
	}
};
Contact.prototype.convertDatesIn = function() {
	var dates = new Array("published", "updated", "birthday");
	for ( var i = 0; i < dates.length; i++) {
		var value = this[dates[i]];
		if (value) {
			try {
				this[dates[i]] = new Date(parseFloat(value))
			} catch (exception) {
				console.log("exception creating date")
			}
		}
	}
};
Contact.prototype.remove = function(successCB, errorCB) {
	var bErrCallback = (errorCB == undefined || errorCB == null) ? false : true;
	navigator.service.contacts.errorCallback = null;
	if (bErrCallback == true) {
		navigator.service.contacts.errorCallback = errorCB
	}
	if (this.id == null) {
		if (bErrCallback == true) {
			var errorObj = new ContactError();
			errorObj.code = ContactError.NOT_FOUND_ERROR;
			errorCB(errorObj)
		}
	} else {
		navigator.service.contacts.resultsCallback = successCB;
		PhoneGap.exec("Contacts.remove", GetFunctionName(successCB), {
			contact : this
		})
	}
};
Contact.prototype.display = function(successCB, errorCB, options) {
	var errCallback = (errorCB == undefined || errorCB == null) ? null
			: GetFunctionName(errorCB);
	navigator.service.contacts.errorCallback = null;
	if (errCallback != null) {
		navigator.service.contacts.errorCallback = errorCB
	}
	if (this.id == null) {
		if (errCallback != null) {
			var errorObj = new ContactError();
			errorObj.code = ContactError.NOT_FOUND_ERROR;
			errorCB(errorObj)
		}
	} else {
		PhoneGap.exec("Contacts.displayContact", this.id,
				GetFunctionName(successCB), errCallback, options)
	}
};
Contact.prototype.clone = function() {
	var clonedContact = PhoneGap.clone(this);
	clonedContact.id = null;
	if (clonedContact.phoneNumbers) {
		for (i = 0; i < clonedContact.phoneNumbers.length; i++) {
			clonedContact.phoneNumbers[i].id = null
		}
	}
	if (clonedContact.emails) {
		for (i = 0; i < clonedContact.emails.length; i++) {
			clonedContact.emails[i].id = null
		}
	}
	if (clonedContact.addresses) {
		for (i = 0; i < clonedContact.addresses.length; i++) {
			clonedContact.addresses[i].id = null
		}
	}
	if (clonedContact.ims) {
		for (i = 0; i < clonedContact.ims.length; i++) {
			clonedContact.ims[i].id = null
		}
	}
	if (clonedContact.organizations) {
		for (i = 0; i < clonedContact.organizations.length; i++) {
			clonedContact.organizations[i].id = null
		}
	}
	if (clonedContact.tags) {
		for (i = 0; i < clonedContact.tags.length; i++) {
			clonedContact.tags[i].id = null
		}
	}
	if (clonedContact.relationships) {
		for (i = 0; i < clonedContact.relationships.length; i++) {
			clonedContact.relationships[i].id = null
		}
	}
	if (clonedContact.urls) {
		for (i = 0; i < clonedContact.urls.length; i++) {
			clonedContact.urls[i].id = null
		}
	}
	return clonedContact
};
Contact.prototype.save = function(successCB, errorCB) {
	var bErrCallback = (errorCB == undefined || errorCB == null) ? false : true;
	navigator.service.contacts.errorCallback = null;
	if (bErrCallback == true) {
		navigator.service.contacts.errorCallback = errorCB
	}
	navigator.service.contacts.resultsCallback = successCB;
	var cloned = PhoneGap.clone(this);
	cloned.convertDatesOut();
	PhoneGap.exec("Contacts.save", GetFunctionName(successCB), {
		contact : cloned
	})
};
var ContactName = function(formatted, familyName, givenName, middle, prefix,
		suffix) {
	this.formatted = formatted != "undefined" ? formatted : null;
	this.familyName = familyName != "undefined" ? familyName : null;
	this.givenName = givenName != "undefined" ? givenName : null;
	this.middleName = middle != "undefined" ? middle : null;
	this.honorificPrefix = prefix != "undefined" ? prefix : null;
	this.honorificSuffix = suffix != "undefined" ? suffix : null
};
var ContactField = function(type, value, primary, id) {
	this.type = type != "undefined" ? type : null;
	this.value = value != "undefined" ? value : null;
	this.primary = primary != "undefined" ? primary : null;
	this.id = id != "undefined" ? id : null
};
var ContactAddress = function(formatted, streetAddress, locality, region,
		postalCode, country, id) {
	this.formatted = formatted != "undefined" ? formatted : null;
	this.streetAddress = streetAddress != "undefined" ? streetAddress : null;
	this.locality = locality != "undefined" ? locality : null;
	this.region = region != "undefined" ? region : null;
	this.postalCode = postalCode != "undefined" ? postalCode : null;
	this.country = country != "undefined" ? country : null;
	this.id = id != "undefined" ? id : null
};
var ContactOrganization = function(name, dept, title, startDate, endDate,
		location, desc) {
	this.name = name != "undefined" ? name : null;
	this.department = dept != "undefined" ? dept : null;
	this.title = title != "undefined" ? title : null;
	this.startDate = startDate != "undefined" ? startDate : null;
	this.endDate = endDate != "undefined" ? endDate : null;
	this.location = location != "undefined" ? location : null;
	this.description = desc != "undefined" ? desc : null
};
var ContactAccount = function(domain, username, userid) {
	this.domain = domain != "undefined" ? domain : null;
	this.username = username != "undefined" ? username : null;
	this.userid = userid != "undefined" ? userid : null
};
var Contacts = function() {
	this.inProgress = false;
	this.records = new Array();
	this.resultsCallback = null;
	this.errorCallback = null
};
Contacts.prototype.find = function(fields, successCB, errorCB, options) {
	this.resultsCallback = successCB;
	this.errorCallback = null;
	var bErrCallback = (errorCB == undefined || errorCB == null) ? false : true;
	if (bErrCallback) {
		this.errorCallback = errorCB
	}
	var theOptions = options || null;
	if (theOptions != null) {
		var value = theOptions.updatedSince;
		if (value != "") {
			if (!value instanceof Date) {
				try {
					value = new Date(value)
				} catch (exception) {
					value = null
				}
			}
			if (value instanceof Date) {
				theOptions.updatedSince = value.valueOf()
			}
		}
	}
	PhoneGap.exec("Contacts.search", GetFunctionName(successCB), {
		fields : fields,
		findOptions : theOptions
	})
};
Contacts.prototype._findCallback = function(contactStrArray) {
	var c = null;
	if (contactStrArray) {
		c = new Array();
		try {
			for ( var i = 0; i < contactStrArray.length; i++) {
				var contactStr = contactStrArray[i];
				var newContact = navigator.service.contacts.create(contactStr);
				newContact.convertDatesIn();
				c.push(newContact)
			}
		} catch (e) {
			console.log("Error parsing contacts")
		}
	}
	try {
		this.resultsCallback(c)
	} catch (e) {
		console.log("Error in user's result callback: " + e)
	}
};
Contacts.prototype._contactCallback = function(contactStr) {
	var newContact = null;
	if (contactStr) {
		try {
			newContact = navigator.service.contacts.create(contactStr);
			newContact.convertDatesIn()
		} catch (e) {
			console.log("Error parsing contact")
		}
	}
	try {
		this.resultsCallback(newContact)
	} catch (e) {
		console.log("Error in user's result callback: " + e)
	}
};
Contacts.prototype._errCallback = function(errorCode) {
	if (this.errorCallback) {
		try {
			var errorObj = new ContactError();
			errorObj.code = errorCode;
			this.errorCallback(errorObj)
		} catch (e) {
			console.log("Error in user's error callback: " + e)
		}
	}
};
Contacts.prototype.newContactUI = function(successCallback) {
	PhoneGap.exec("Contacts.newContact", GetFunctionName(successCallback))
};
Contacts.prototype.chooseContact = function(successCallback, options) {
	PhoneGap.exec("Contacts.chooseContact", GetFunctionName(successCallback),
			options)
};
Contacts.prototype.create = function(properties) {
	var contact = new Contact();
	for (i in properties) {
		if (contact[i] != "undefined") {
			contact[i] = properties[i]
		}
	}
	return contact
};
var ContactFindOptions = function(filter, multiple, limit, updatedSince) {
	this.filter = filter || "";
	this.multiple = multiple || true;
	this.limit = limit || null;
	this.updatedSince = updatedSince || ""
};
var ContactError = function() {
	this.code = null
};
ContactError.UNKNOWN_ERROR = 0;
ContactError.INVALID_ARGUMENT_ERROR = 1;
ContactError.NOT_FOUND_ERROR = 2;
ContactError.TIMEOUT_ERROR = 3;
ContactError.PENDING_OPERATION_ERROR = 4;
ContactError.IO_ERROR = 5;
ContactError.NOT_SUPPORTED_ERROR = 6;
ContactError.PERMISSION_DENIED_ERROR = 20;
PhoneGap.addConstructor(function() {
	if (typeof navigator.service == "undefined") {
		navigator.service = new Object()
	}
	if (typeof navigator.service.contacts == "undefined") {
		navigator.service.contacts = new Contacts()
	}
});
function DebugConsole(isDeprecated) {
	this.logLevel = DebugConsole.INFO_LEVEL;
	this.isDeprecated = isDeprecated ? true : false
}
DebugConsole.ALL_LEVEL = 1;
DebugConsole.INFO_LEVEL = 1;
DebugConsole.WARN_LEVEL = 2;
DebugConsole.ERROR_LEVEL = 4;
DebugConsole.NONE_LEVEL = 8;
DebugConsole.prototype.setLevel = function(level) {
	this.logLevel = level
};
DebugConsole.prototype.processMessage = function(message) {
	if (typeof (message) != "object") {
		return (this.isDeprecated ? "WARNING: debug object is deprecated, please use console object \n"
				+ message
				: message)
	} else {
		function indent(str) {
			return str.replace(/^/mg, "    ")
		}
		function makeStructured(obj) {
			var str = "";
			for ( var i in obj) {
				try {
					if (typeof (obj[i]) == "object") {
						str += i + ":\n" + indent(makeStructured(obj[i]))
								+ "\n"
					} else {
						str += i + " = "
								+ indent(String(obj[i])).replace(/^    /, "")
								+ "\n"
					}
				} catch (e) {
					str += i + " = EXCEPTION: " + e.message + "\n"
				}
			}
			return str
		}
		return ((this.isDeprecated ? "WARNING: debug object is deprecated, please use console object\n"
				: "")
				+ "Object:\n" + makeStructured(message))
	}
};
DebugConsole.prototype.log = function(message) {
	if (PhoneGap.available && this.logLevel <= DebugConsole.INFO_LEVEL) {
		PhoneGap.exec("DebugConsole.log", this.processMessage(message), {
			logLevel : "INFO"
		})
	} else {
		console.log(message)
	}
};
DebugConsole.prototype.warn = function(message) {
	if (PhoneGap.available && this.logLevel <= DebugConsole.WARN_LEVEL) {
		PhoneGap.exec("DebugConsole.log", this.processMessage(message), {
			logLevel : "WARN"
		})
	} else {
		console.error(message)
	}
};
DebugConsole.prototype.error = function(message) {
	if (PhoneGap.available && this.logLevel <= DebugConsole.ERROR_LEVEL) {
		PhoneGap.exec("DebugConsole.log", this.processMessage(message), {
			logLevel : "ERROR"
		})
	} else {
		console.error(message)
	}
};
PhoneGap.addConstructor(function() {
	window.console = new DebugConsole();
	window.debug = new DebugConsole(true)
});
function Device() {
	this.platform = null;
	this.version = null;
	this.name = null;
	this.phonegap = null;
	this.uuid = null;
	try {
		this.platform = DeviceInfo.platform;
		this.version = DeviceInfo.version;
		this.name = DeviceInfo.name;
		this.phonegap = DeviceInfo.gap;
		this.uuid = DeviceInfo.uuid
	} catch (e) {
	}
	this.available = PhoneGap.available = this.uuid != null
}
PhoneGap.addConstructor(function() {
	navigator.device = window.device = new Device()
});
PhoneGap.addConstructor(function() {
	if (typeof navigator.fileMgr == "undefined") {
		navigator.fileMgr = new FileMgr()
	}
});
FileError = {
	NOT_IMPLEMENTED : -1,
	NOT_FOUND_ERR : 1,
	SECURITY_ERR : 2,
	ABORT_ERR : 3,
	NOT_READABLE_ERR : 4,
	ENCODING_ERR : 5,
	NO_MODIFICATION_ALLOWED_ERR : 6,
	INVALID_STATE_ERR : 7,
	SYNTAX_ERR : 8
};
File._createEvent = function(type, target) {
	var evt = {
		type : type
	};
	evt.target = target;
	return evt
};
function FileMgr() {
	this.getFileBasePaths();
	this.getFreeDiskSpace()
}
FileMgr.seperator = "/";
FileMgr.prototype = {
	fileWriters : {},
	fileReaders : {},
	docsFolderPath : "./../Documents/",
	libFolderPath : "./../Library/",
	tempFolderPath : "./../tmp/",
	freeDiskSpace : -1,
	_setPaths : function(docs, temp, lib) {
		this.docsFolderPath = docs;
		this.tempFolderPath = temp;
		this.libFolderPath = lib
	},
	_setFreeDiskSpace : function(val) {
		this.freeDiskSpace = val
	},
	addFileWriter : function(filePath, fileWriter) {
		this.fileWriters[filePath] = fileWriter;
		return fileWriter
	},
	removeFileWriter : function(filePath) {
		this.fileWriters[filePath] = null
	},
	addFileReader : function(filePath, fileReader) {
		this.fileReaders[filePath] = fileReader;
		return fileReader
	},
	removeFileReader : function(filePath) {
		this.fileReaders[filePath] = null
	},
	reader_onloadstart : function(filePath, result) {
		this.fileReaders[filePath].result = unescape(result);
		var evt = File._createEvent("loadstart", this.fileReaders[filePath]);
		this.fileReaders[filePath].onloadstart(evt)
	},
	reader_onprogress : function(filePath, result) {
		this.fileReaders[filePath].result = unescape(result);
		var evt = File._createEvent("progress", this.fileReaders[filePath]);
		this.fileReaders[filePath].onprogress(evt)
	},
	reader_onload : function(filePath, result) {
		this.fileReaders[filePath].result = unescape(result);
		var evt = File._createEvent("load", this.fileReaders[filePath]);
		this.fileReaders[filePath].onload(evt)
	},
	reader_onerror : function(filePath, err) {
		this.fileReaders[filePath].result = err;
		this.fileReaders[filePath].result = unescape(result);
		var evt = File._createEvent("error", this.fileReaders[filePath]);
		this.fileReaders[filePath].onerror(evt)
	},
	reader_onloadend : function(filePath, result) {
		this.fileReaders[filePath].result = unescape(result);
		var evt = File._createEvent("loadend", this.fileReaders[filePath]);
		this.fileReaders[filePath].onloadend(evt)
	},
	writer_onerror : function(filePath, err) {
		this.fileWriters[filePath].error = err;
		this.fileWriters[filePath].onerror(err)
	},
	writer_oncomplete : function(filePath, result) {
		var writer = this.fileWriters[filePath];
		writer.length = result;
		writer.position = result;
		var evt = File._createEvent("writeend", writer);
		writer.onwriteend(evt);
		evt.type = "complete";
		writer.oncomplete(evt)
	},
	getRootPaths : function() {
		return [ this.docsFolderPath, this.libFolderPath, this.tempFolderPath ]
	},
	getFileBasePaths : function() {
		PhoneGap.exec("File.getFileBasePaths")
	},
	testFileExists : function(fileName, win, fail) {
		this.successCallback = function(b) {
			win(b)
		};
		this.errorCallback = function(b) {
			fail(b)
		};
		PhoneGap.exec("File.testFileExists", fileName)
	},
	testDirectoryExists : function(dirName, win, fail) {
		this.successCallback = function(b) {
			win(b)
		};
		this.errorCallback = function(b) {
			fail(b)
		};
		PhoneGap.exec("File.testDirectoryExists", dirName)
	},
	createDirectory : function(dirName, successCallback, errorCallback) {
		this.successCallback = successCallback;
		this.errorCallback = errorCallback;
		PhoneGap.exec("File.createDirectory", dirName)
	},
	deleteDirectory : function(dirName, successCallback, errorCallback) {
		this.successCallback = successCallback;
		this.errorCallback = errorCallback;
		PhoneGap.exec("File.deleteDirectory", dirName)
	},
	deleteFile : function(fileName, successCallback, errorCallback) {
		this.successCallback = successCallback;
		this.errorCallback = errorCallback;
		PhoneGap.exec("File.deleteFile", fileName)
	},
	getFreeDiskSpace : function(successCallback, errorCallback) {
		if (this.freeDiskSpace > 0) {
			successCallback(this.freeDiskSpace);
			return this.freeDiskSpace
		} else {
			this.successCallback = successCallback;
			this.errorCallback = errorCallback;
			PhoneGap.exec("File.getFreeDiskSpace")
		}
	}
};
function FileReader(filename) {
	this.fileName = filename
}
FileReader.EMPTY = 0;
FileReader.LOADING = 1;
FileReader.DONE = 2;
FileReader.prototype = {
	fileName : null,
	result : null,
	onloadstart : null,
	onprogress : null,
	onload : null,
	onerror : null,
	onloadend : null,
	abort : function() {
	},
	readAsBinaryString : function(filename) {
	},
	readAsDataURL : function(url) {
	},
	readAsArrayBuffer : function(filename) {
	},
	readAsText : function(fname) {
		if (this.fileName && this.fileName.length > 0) {
			navigator.fileMgr.removeFileReader(this.fileName, this)
		}
		this.fileName = fname;
		navigator.fileMgr.addFileReader(this.fileName, this);
		PhoneGap.exec("File.readFile", this.fileName)
	}
};
function FileWriter(filename) {
	if (navigator.fileMgr.fileWriters[filename] != null) {
		return navigator.fileMgr.fileWriters[filename]
	} else {
		this.fileName = filename
	}
}
FileWriter.INIT = 0;
FileWriter.WRITING = 1;
FileWriter.DONE = 2;
FileWriter.prototype = {
	fileName : "",
	result : null,
	readyState : 0,
	onerror : null,
	oncomplete : null,
	onwritestart : null,
	onprogress : null,
	onload : null,
	onabort : null,
	onerror : null,
	onwriteend : null,
	length : 0,
	position : 0,
	error : null,
	write : function(text) {
		return this.writeAsText(this.fileName, text)
	},
	truncate : function(offset) {
		if (this.readyState == FileWriter.WRITING) {
			throw FileError.INVALID_STATE_ERR
		}
		this.readyState = FileWriter.WRITING;
		if (this.fileName && this.fileName.length > 0) {
			navigator.fileMgr.removeFileWriter(this.fileName)
		}
		navigator.fileMgr.addFileWriter(this.fileName, this);
		this.readyState = 0;
		this.result = null;
		PhoneGap.exec("File.truncateFile", this.fileName, offset)
	},
	seek : function(offset) {
		if (this.readyState === FileWriter.WRITING) {
			throw FileError.INVALID_STATE_ERR
		}
		if (!offset) {
			return
		}
		if (offset < 0) {
			this.position = Math.max(offset + this.length, 0)
		} else {
			if (offset > this.length) {
				this.position = this.length
			} else {
				this.position = offset
			}
		}
	},
	abort : function() {
		if (this.readyState != FileWriter.WRITING) {
			throw FileError.INVALID_STATE_ERR
		}
		var error = new FileError();
		error.code = FileError.ABORT_ERR;
		this.error = error;
		if (typeof this.onerror == "function") {
			var evt = File._createEvent("error", this);
			this.onerror(evt)
		}
		if (typeof this.onabort == "function") {
			var evt = File._createEvent("abort", this);
			this.onabort(evt)
		}
		this.readyState = FileWriter.DONE;
		if (typeof this.onloadend == "function") {
			var evt = File._createEvent("writeend", this);
			this.onloadend(evt)
		}
	},
	writeAsText : function(fname, text) {
		if (this.readyState == FileWriter.WRITING) {
			throw FileError.INVALID_STATE_ERR
		}
		this.readyState = FileWriter.WRITING;
		if (this.fileName && this.fileName.length > 0) {
			navigator.fileMgr.removeFileWriter(this.fileName)
		}
		this.fileName = fname;
		navigator.fileMgr.addFileWriter(this.fileName, this);
		this.readyState = 0;
		this.result = null;
		PhoneGap.exec("File.write", this.fileName, text, this.position)
	}
};
function PositionError() {
	this.code = 0;
	this.message = ""
}
PositionError.PERMISSION_DENIED = 1;
PositionError.POSITION_UNAVAILABLE = 2;
PositionError.TIMEOUT = 3;
function Geolocation() {
	this.lastPosition = null;
	this.lastError = null
}
Geolocation.prototype.getCurrentPosition = function(successCallback,
		errorCallback, options) {
	var referenceTime = 0;
	if (this.lastError != null) {
		if (typeof (errorCallback) == "function") {
			errorCallback.call(null, this.lastError)
		}
		this.stop();
		return
	}
	this.start(options);
	var timeout = 30000;
	var interval = 2000;
	if (options && options.interval) {
		interval = options.interval
	}
	if (typeof (successCallback) != "function") {
		successCallback = function() {
		}
	}
	if (typeof (errorCallback) != "function") {
		errorCallback = function() {
		}
	}
	var dis = this;
	var delay = 0;
	var timer;
	var onInterval = function() {
		delay += interval;
		if (dis.lastPosition != null
				&& dis.lastPosition.timestamp > referenceTime) {
			clearInterval(timer);
			successCallback(dis.lastPosition)
		} else {
			if (delay > timeout) {
				clearInterval(timer);
				errorCallback("Error Timeout")
			} else {
				if (dis.lastError != null) {
					clearInterval(timer);
					errorCallback(dis.lastError)
				}
			}
		}
	};
	timer = setInterval(onInterval, interval)
};
Geolocation.prototype.watchPosition = function(successCallback, errorCallback,
		options) {
	this.getCurrentPosition(successCallback, errorCallback, options);
	var frequency = (options && options.frequency) ? options.frequency : 10000;
	var that = this;
	return setInterval(function() {
		that.getCurrentPosition(successCallback, errorCallback, options)
	}, frequency)
};
Geolocation.prototype.clearWatch = function(watchId) {
	clearInterval(watchId)
};
Geolocation.prototype.setLocation = function(position) {
	this.lastError = null;
	this.lastPosition = position
};
Geolocation.prototype.setError = function(error) {
	this.lastError = error
};
Geolocation.prototype.start = function(args) {
	PhoneGap.exec("Location.startLocation", args)
};
Geolocation.prototype.stop = function() {
	PhoneGap.exec("Location.stopLocation")
};
function __proxyObj(origObj, proxyObj, funkList) {
	var replaceFunk = function(org, proxy, fName) {
		org[fName] = function() {
			return proxy[fName].apply(proxy, arguments)
		}
	};
	for ( var v in funkList) {
		replaceFunk(origObj, proxyObj, funkList[v])
	}
}
PhoneGap.addConstructor(function() {
	if (typeof navigator._geo == "undefined") {
		navigator._geo = new Geolocation();
		__proxyObj(navigator.geolocation, navigator._geo, [ "setLocation",
				"getCurrentPosition", "watchPosition", "clearWatch",
				"setError", "start", "stop" ])
	}
});
function Compass() {
	this.lastHeading = null;
	this.lastError = null;
	this.callbacks = {
		onHeadingChanged : [],
		onError : []
	}
}
Compass.prototype.getCurrentHeading = function(successCallback, errorCallback,
		options) {
	if (this.lastHeading == null) {
		this.start(options)
	} else {
		if (typeof successCallback == "function") {
			successCallback(this.lastHeading)
		}
	}
};
Compass.prototype.watchHeading = function(successCallback, errorCallback,
		options) {
	this.getCurrentHeading(successCallback, errorCallback, options);
	var frequency = 100;
	if (typeof (options) == "object" && options.frequency) {
		frequency = options.frequency
	}
	var self = this;
	return setInterval(function() {
		self.getCurrentHeading(successCallback, errorCallback, options)
	}, frequency)
};
Compass.prototype.clearWatch = function(watchId) {
	clearInterval(watchId)
};
Compass.prototype.setHeading = function(heading) {
	this.lastHeading = heading;
	for ( var i = 0; i < this.callbacks.onHeadingChanged.length; i++) {
		var f = this.callbacks.onHeadingChanged.shift();
		f(heading)
	}
};
Compass.prototype.setError = function(message) {
	this.lastError = message;
	for ( var i = 0; i < this.callbacks.onError.length; i++) {
		var f = this.callbacks.onError.shift();
		f(message)
	}
};
Compass.prototype.start = function(args) {
	PhoneGap.exec("Location.startHeading", args)
};
Compass.prototype.stop = function() {
	PhoneGap.exec("Location.stopHeading")
};
PhoneGap.addConstructor(function() {
	if (typeof navigator.compass == "undefined") {
		navigator.compass = new Compass()
	}
});
function Media(src, successCallback, errorCallback, downloadCompleteCallback) {
	if (!src) {
		src = "documents://"
				+ String((new Date()).getTime()).replace(/\D/gi, "")
	}
	this.src = src;
	this.successCallback = successCallback;
	this.errorCallback = errorCallback;
	this.downloadCompleteCallback = downloadCompleteCallback;
	if (this.src != null) {
		PhoneGap.exec("Sound.prepare", this.src, this.successCallback,
				this.errorCallback, this.downloadCompleteCallback)
	}
}
Media.prototype.play = function(options) {
	if (this.src != null) {
		PhoneGap.exec("Sound.play", this.src, options)
	}
};
Media.prototype.pause = function() {
	if (this.src != null) {
		PhoneGap.exec("Sound.pause", this.src)
	}
};
Media.prototype.stop = function() {
	if (this.src != null) {
		PhoneGap.exec("Sound.stop", this.src)
	}
};
Media.prototype.startAudioRecord = function(options) {
	if (this.src != null) {
		PhoneGap.exec("Sound.startAudioRecord", this.src, options)
	}
};
Media.prototype.stopAudioRecord = function() {
	if (this.src != null) {
		PhoneGap.exec("Sound.stopAudioRecord", this.src)
	}
};
function MediaError() {
	this.code = null, this.message = ""
}
MediaError.MEDIA_ERR_ABORTED = 1;
MediaError.MEDIA_ERR_NETWORK = 2;
MediaError.MEDIA_ERR_DECODE = 3;
MediaError.MEDIA_ERR_NONE_SUPPORTED = 4;
function Notification() {
	this.resultsCallback = null
}
Notification.prototype.blink = function(count, colour) {
};
Notification.prototype.vibrate = function(mills) {
	PhoneGap.exec("Notification.vibrate")
};
Notification.prototype.beep = function(count, volume) {
	new Media("beep.wav").play()
};
Notification.prototype.alert = function(message, resultCallback, title,
		buttonLabel) {
	var options = {};
	options.title = (title || "Alert");
	options.buttonLabel = (buttonLabel || "OK");
	this.resultsCallback = resultCallback;
	PhoneGap.exec("Notification.alert", message, options);
	return
};
Notification.prototype.confirm = function(message, resultCallback, title,
		buttonLabels) {
	var confirmTitle = title ? title : "Confirm";
	var labels = buttonLabels ? buttonLabels : "OK,Cancel";
	return this.alert(message, resultCallback, confirmTitle, labels)
};
Notification.prototype._alertCallback = function(index) {
	try {
		this.resultsCallback(index)
	} catch (e) {
		console.log("Error in user's result callback: " + e)
	}
};
Notification.prototype.activityStart = function() {
	PhoneGap.exec("Notification.activityStart")
};
Notification.prototype.activityStop = function() {
	PhoneGap.exec("Notification.activityStop")
};
Notification.prototype.loadingStart = function(options) {
	PhoneGap.exec("Notification.loadingStart", options)
};
Notification.prototype.loadingStop = function() {
	PhoneGap.exec("Notification.loadingStop")
};
PhoneGap.addConstructor(function() {
	if (typeof navigator.notification == "undefined") {
		navigator.notification = new Notification()
	}
});
function Orientation() {
	this.currentOrientation = null
}
Orientation.prototype.setOrientation = function(orientation) {
	Orientation.currentOrientation = orientation;
	var e = document.createEvent("Events");
	e.initEvent("orientationChanged", "false", "false");
	e.orientation = orientation;
	document.dispatchEvent(e)
};
Orientation.prototype.getCurrentOrientation = function(successCallback,
		errorCallback) {
};
Orientation.prototype.watchOrientation = function(successCallback,
		errorCallback) {
	this.getCurrentPosition(successCallback, errorCallback);
	return setInterval(function() {
		navigator.orientation.getCurrentOrientation(successCallback,
				errorCallback)
	}, 10000)
};
Orientation.prototype.clearWatch = function(watchId) {
	clearInterval(watchId)
};
PhoneGap.addConstructor(function() {
	if (typeof navigator.orientation == "undefined") {
		navigator.orientation = new Orientation()
	}
});
function Position(coords, timestamp) {
	this.coords = coords;
	this.timestamp = new Date().getTime()
}
function Coordinates(lat, lng, alt, acc, head, vel, altAcc) {
	this.latitude = lat;
	this.longitude = lng;
	this.accuracy = acc;
	this.altitude = alt;
	this.heading = head;
	this.speed = vel;
	this.altitudeAccuracy = (altAcc != "undefined") ? altAcc : null
}
function PositionOptions() {
	this.enableHighAccuracy = true;
	this.timeout = 10000
}
function PositionError() {
	this.code = null;
	this.message = ""
}
PositionError.UNKNOWN_ERROR = 0;
PositionError.PERMISSION_DENIED = 1;
PositionError.POSITION_UNAVAILABLE = 2;
PositionError.TIMEOUT = 3;
function Sms() {
}
Sms.prototype.send = function(number, message, successCallback, errorCallback,
		options) {
};
PhoneGap.addConstructor(function() {
	if (typeof navigator.sms == "undefined") {
		navigator.sms = new Sms()
	}
});
function Telephony() {
}
Telephony.prototype.call = function(number) {
};
PhoneGap.addConstructor(function() {
	if (typeof navigator.telephony == "undefined") {
		navigator.telephony = new Telephony()
	}
});
function NetworkStatus() {
	this.code = null;
	this.message = ""
}
NetworkStatus.NOT_REACHABLE = 0;
NetworkStatus.REACHABLE_VIA_CARRIER_DATA_NETWORK = 1;
NetworkStatus.REACHABLE_VIA_WIFI_NETWORK = 2;
function Network() {
	this.lastReachability = null
}
Network.prototype.isReachable = function(hostName, successCallback, options) {
	PhoneGap.exec("Network.isReachable", hostName,
			GetFunctionName(successCallback), options)
};
Network.prototype.updateReachability = function(reachability) {
	this.lastReachability = reachability
};
PhoneGap.addConstructor(function() {
	if (typeof navigator.network == "undefined") {
		navigator.network = new Network()
	}
});