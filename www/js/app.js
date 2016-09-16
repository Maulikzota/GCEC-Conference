// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers','starter.services','angularMoment','ngOpenFB'])

.run(function($ionicPlatform,amMoment,ngFB) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    ngFB.init({appId: '1628321130831621'});
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
    amMoment.changeLocale('en-ca');
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

  .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

  .state('app.login',{
    url: '/login',
    views: {
      'menuContent': {
        templateUrl: 'templates/login.html',
        controller: 'AppCtrl'
      }
    }
  })

  .state('app.profile', {
    url: "/profile",
    views: {
      'menuContent': {
        templateUrl: "templates/profile.html",
        controller: "ProfileCtrl"
      }
    }
  })

  .state('app.agenda', {
    url: '/agenda',
    views: {
      'menuContent': {
        templateUrl: 'templates/agenda.html',
        controller: 'AgendaCtrl'
      }
    }
  })
  .state('app.singleday', {
    url: '/agenda/:dayId',
    views: {
      'menuContent': {
        templateUrl: 'templates/agendaDay.html',
        controller: 'AgendaBlockCtrl'
      }
    }
  })
  .state('app.singleblock', {
    url: '/agenda/singleday/:blockId',
    views: {
      'menuContent': {
        templateUrl: 'templates/agendaBlock.html',
        controller: 'AgendaListCtrl'
      }
    }
  })
  .state('app.singleAgenda', {
    url: '/agenda/singleday/singleblock/:agendaId',
    views: {
      'menuContent': {
        templateUrl: 'templates/agendaDetail.html',
        controller: 'AgendaDetailCtrl'
      }
    }
  })

  .state('app.speakers', {
    url: '/speakers',
    views: {
      'menuContent': {
        templateUrl: 'templates/speakers.html',
        controller: 'SpeakersCtl'
      }
    }
  })
  .state('app.singleSpeakers', {
    url: "/speakers/:speakersId",
    views: {
      'menuContent': {
        templateUrl: 'templates/speaker.html',
        controller: 'SpeakerCtl'
      }
    }
  })

  .state('app.attendees', {
    url: '/attendees',
    views: {
      'menuContent': {
        templateUrl: 'templates/attendees.html'
      }
    }
  })

  .state('app.sponsors', {
    url: '/sponsors',
    views: {
      'menuContent': {
        templateUrl: 'templates/sponsors.html',
        controller: 'SponsorsCtl'
      }
    }
  })
  .state('app.singleSponsor', {
    url: '/sponsors/:sponsorsId',
    views: {
      'menuContent': {
        templateUrl: 'templates/sponsor.html',
        controller: 'SponsorCtl'
      }
    }
  })

  .state('app.exhibitors', {
    url: '/exhibitors',
    views: {
      'menuContent': {
        templateUrl: 'templates/exhibitors.html',
        controller: 'ExhibitorsCtl'
      }
    }
  })
  .state('app.singleExhibitors', {
    url: '/exhibitors/:exhibitorsId',
    views: {
      'menuContent': {
        templateUrl: 'templates/exhibitor.html',
        controller: 'ExhibitorCtl'
      }
    }
  })

  .state('app.myschedule', {
    url: '/myschedule',
    views: {
      'menuContent': {
        templateUrl: 'templates/myschedule.html',
        controller: 'myscheduleCtrl'
      }
    }
  })
  .state('app.mySingleSchedule', {
    url: '/myschedule/:bookId',
    views: {
      'menuContent': {
        templateUrl: 'templates/myscheduleDetail.html',
        controller: 'myscheduleDetailCtrl'
      }
    }
  })

  .state('app.maps', {
    url: '/maps',
    views: {
      'menuContent': {
        templateUrl: 'templates/maps.html',
        controller: 'MapCtl'
      }
    }
  })

  .state('app.about', {
    url: '/about',
    views: {
      'menuContent': {
        templateUrl: 'templates/about.html'
      }
    }
  })

  .state('app.home', {
    url: '/home',
    views: {
      'menuContent': {
        templateUrl: 'templates/home.html',
        controller: 'AppCtrl'
      }
    }
  })
  ;
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/home');
});
