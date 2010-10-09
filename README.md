User Keyboard Shortcuts
===========

UserKeyboardShortcuts is a refactor of the Keyboard class provided by mootools-more. It makes it easy for you to provide local user-customizable keyboard shortcuts for your users that you don't have to care about.

You just use Keyboard.addShortcuts (provided by Keyboard.Extras) as you usually would, then the user can change the keys to their liking.  The assignments they make will be stored using localStorage (failing that a cookie) and will be restored on each subsequent page load.

![Screenshot](http://re5et.github.com/projects/userKeyboardShortcuts/assets/images/screenshot.png)

How to use
----------

Create a new UserKeyboardShortcuts instance:

	var myKeyboard = new UserKeyboardShortcuts();

Add some shortcuts:

	myKeyboard.addShortcuts({
		'logSomething': {
			'keys': 'ctrl+alt+l',
			'description': 'logs "something".',
			'handler': function(){
				console.log('something');
			}
		},
		'alertSomething': {
			'keys': 'a',
			'description': 'alerts "something"',
			'handler': function(){
				alert('something');
			}
		}
	});

If you want an easy way for users to show and change the shortcuts, you can run:

	myKeyboard.showAndChange();

You can restore the default shortcuts with this:

	myKeyboard.restoreDefaults()

You can also just add the two above methods as shortcuts for users to use:

	myKeyboard.addShortcut('showAndChangeShortcuts', {
		'keys': 'm',
		'description': 'Toggle this menu.',
		'handler': myKeyboard.showAndChange
	});

and

	myKeyboard.addShortcut('restoreDefaults', {
		'keys': 'd',
		'description': 'Restore default shortcuts.',
		'handler': myKeyboard.restoreDefaults
	});

Since this is a refactor of Keyboard, knowing how to use Keyboard and Keyboard.Extras will help quite a bit.
