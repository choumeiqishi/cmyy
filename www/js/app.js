angular.module('cmyy', ['ionic', 'cmyy.controllers', 'cmyy.services'])

.run(function($ionicPlatform, account) {
  	$ionicPlatform.ready(function() {

  		// init db
  		account.initDB();

	    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
	    // for form inputs)
	    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
	      	cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
	      	cordova.plugins.Keyboard.disableScroll(true);

	    }

	    if (window.StatusBar) {
	      	// org.apache.cordova.statusbar required
	      	StatusBar.styleLightContent();
	    }
  	});
})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

	$ionicConfigProvider.tabs.position('bottom');
	$ionicConfigProvider.navBar.alignTitle('center');

	// Ionic uses AngularUI Router which uses the concept of states
	// Learn more here: https://github.com/angular-ui/ui-router
	// Set up the various states which the app can be in.
	// Each state's controller can be found in controllers.js
	$stateProvider

  	// setup an abstract state for the tabs directive
    .state('tab', {
	    url: '/tab',
	    abstract: true,
	    templateUrl: 'templates/tabs.html'
  	})

  	// Each tab has its own nav history stack:

  	.state('tab.list', {
  		cache: false,
	    url: '/list',
	    views: {
	      	'tab-list': {
	        	templateUrl: 'templates/tab-list.html',
	        	controller: 'ListController'
	      	}
	    }
  	})

  	.state('tab.new', {
  		cache: false,
      	url: '/new',
      	views: {
        	'tab-new': {
          		templateUrl: 'templates/tab-new.html',
          		controller: 'CreationController'
        	}
      	}
    })

  	.state('tab.statistics', {
  		//cache: false,
    	url: '/statistics',
	    	views: {
	      		'tab-statistics': {
	        	templateUrl: 'templates/tab-statistics.html',
	        	controller: 'StatisticsController'
	      	}
	    }
	});

  	// if none of the above states are matched, use this as the fallback
  	$urlRouterProvider.otherwise('/tab/new');

});
