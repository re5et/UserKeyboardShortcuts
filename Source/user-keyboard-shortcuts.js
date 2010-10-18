/*
---
script: user-keyboard-shortcuts.js

description: Refactor of Keyboard to allow for saving local user-customizable keyboard shortcuts

license: MIT-style

authors: [atom smith]

requires:
- core/1.3: [Core, Browser, Array, Function, Number, String, Hash, Event, Class.Extras, Element.Event, Element.Style, Selectors, JSON, Cookie]
- more/1.3.0.1rc1 [Class.Refactor, Keyboard, Keyboard.Extras]
provides: [UserKeyboardShortcuts]
...
*/

var UserKeyboardShortcuts = Class.refactor(Keyboard, {

	options: {
		prefixClass: 'uks',
		showerAndChanger: {
			id: 'shower-and-changer',
			styles: {
				display: 'none'
			}
		},
		cookie: {
			duration: 365
		}
	},

	initialize: function(options){
		this.previous(options);
		this.hasLocalStorage = (typeof(localStorage) == 'undefined') ? false : true;
		this.loadSaved();
		this.defaults = [];
	},

	loadSaved: function(){
		this.saved = {};
		var stored = false;
		if(this.hasLocalStorage){
			stored = localStorage.getItem('userKeyboardShortcuts');
		} else {
			stored = Cookie.read('userKeyboardShortcuts');
		}

		stored = JSON.decode(stored);

		if(stored != undefined){
			stored.each(function(shortcut){
				this.saved[shortcut.name] = shortcut.keys;
			}, this);
		}
	},

	addShortcut: function(name, shortcut){
		this.defaults.push({
			name: name,
			keys: shortcut.keys
		});

		this.previous(name, shortcut);
		var shortcut = this.getShortcut(name);
		this.handleSaved(shortcut);
		this.saveShortcuts();

		if(this.showerAndChanger != undefined){
			this.addToShowAndChange(shortcut);
		}

		return this;
	},

	handleSaved: function(shortcut){
		var savedKeys = this.saved[shortcut.name];
		if(savedKeys != undefined){
			this.changeShortcut(shortcut.name, savedKeys)
		}
	},

	saveShortcuts: function(){
		var save = JSON.encode(this.shortcuts);
		if(this.hasLocalStorage)
		{
			localStorage.setItem('userKeyboardShortcuts', save);
		} else {
			Cookie.write('userKeyboardShortcuts', this.options.cookie);
		}
	},

	changeShortcut: function(shortcutName, keys){
		var shortcut = this.getShortcut(shortcutName);
		this.removeEvent(shortcut.keys, shortcut.handler);
		this.addEvent(keys, shortcut.handler);
		shortcut.keys = keys;
		this.saveShortcuts();
		this.fireEvent('rebound', shortcut);
	},

	showAndChange: function(){
		if(this.showerAndChanger == undefined)
		{

			this.showerAndChanger = new Element('ul', this.options.showerAndChanger);
			this.shortcuts.each(function(shortcut){
				this.addToShowAndChange(shortcut);
			}, this)
			$(document.body).grab(this.showerAndChanger);
		}
		if(this.showerAndChanger.getStyle('display') == 'none'){
			this.showerAndChanger.setStyle('display', '');
		} else {
			this.showerAndChanger.setStyle('display', 'none');
		}
	},

	addToShowAndChange: function(shortcut){
		var item = new Element('li', {
			tabindex: 0
		});
		var desc = new Element('span', {
			class: this.options.prefixClass + '-description',
			text: shortcut.description
		});
		var keys = new Element('span', {
			class: this.options.prefixClass + '-keys',
			text: shortcut.keys
		}).store('shortcutName', shortcut.name);
		item.grab(keys);
		item.grab(desc);
		item.addEvents({
			mouseenter: function(){
				keys.set('text', 'change');
			},
			mouseleave: function(){
				keys.set('text', shortcut.keys);
			},
			click: function(){
				keys.set('text', 'type new...');
				item.addEvent('keydown',function(event){
				  event.stop()
				})
				item.addEvent('keyup', function(event){
					event = new Event(event);
					event.stop();
					item.focus();
					var newKeys = this.parseKeypress(event);
					keys.set('text', newKeys);
					this.changeShortcut(shortcut.name, newKeys);
					item.removeEvents('keyup');
					item.removeEvents('keydown');
					item.blur();
				}.bind(this));
			}.bind(this)
		});
		this.showerAndChanger.grab(item);
	},

	parseKeypress: function(event){
		this.specialMap = this.specialMap || {
			'~':'`', '!':'1', '@':'2', '#':'3',
			'$':'4', '%':'5', '^':'6', '&':'7',
			'*':'8', '(':'9', ')':'0', '_':'-',
			'+':'=', '{':'[', '}':']', '\\':'|',
			':':';', '"':'\'', '<':',', '>':'.',
			'?':'/'
		};

		var modifiers = ''
		if(event.control){
			modifiers += 'ctrl+';
		}
		if(event.meta){
			modifiers += 'meta+';
		}
		if(event.shift){
			var specialKey = this.specialMap[String.fromCharCode(event.code)];
			if(specialKey != undefined)
			{
				event.key = specialKey;
			}
			modifiers += 'shift+';
		}
		if(event.alt){
			modifiers += 'alt+';
		}

		return modifiers + event.key;
	},

	restoreDefaults: function(){
		this.defaults.each(function(d){
			this.changeShortcut(d.name, d.keys);
		}, this);
		if(this.showerAndChanger != undefined){
			this.showerAndChanger.getElements('.'+this.options.prefixClass+'-keys')
				.each(function(item){
					var shortcut = this.getShortcut(item.retrieve('shortcutName'));
					item.set('text', shortcut.keys);
				}, this);
		}
	}

});


