window.addEvent('domready', function(){

	function setBackgroundColor(color){
		$(document.body).setStyle('background-color', color);
	}

	var myKeyboard = new UserKeyboardShortcuts();

	myKeyboard.addEvent('rebound', function(shortcut){
		if(shortcut.name == 'showAndChangeShortcuts'){
			$$('.show-and-change').set('text', shortcut.keys);
		}
	});

	myKeyboard.addShortcuts({
		'showAndChangeShortcuts': {
			'keys': 'm',
			'description': 'Toggle this menu.',
			'handler': myKeyboard.showAndChange
		},
		'restoreShortcutDefaults': {
			'keys': 'shift+d',
			'description': 'Restore default shortcuts.',
			'handler': myKeyboard.restoreDefaults
		},
		'randomBackgroundColor': {
			'keys': 'ctrl+alt+shift+/',
			'description': 'Change the background color of the body to a random color.',
			'handler': function(){
				var color = new Color([Number.random(0, 255), Number.random(0, 255), Number.random(0, 255)]);
				setBackgroundColor(color);
			}
		}
	});

	['HoneyDew', 'Lime', 'Orange', 'Plum'].each(function(fruitAndColor){
		myKeyboard.addShortcut(fruitAndColor, {
			'keys': fruitAndColor[0].toLowerCase(),
			'description': 'set background: delicious ' + fruitAndColor,
			'handler': setBackgroundColor.pass(fruitAndColor)
		});
	});

	window.myKeyboard = myKeyboard;

});
