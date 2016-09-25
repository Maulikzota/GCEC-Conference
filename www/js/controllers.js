angular.module('starter.controllers', [])
.filter('dformat',function($filter){
  return function(input) {
    var hr = $filter('limitTo')(input,2);
    var min = $filter('limitTo')(input,2,-2);
   return $filter('date')(new Date(0,0,0,hr,min),'hh:mm a')
  };
})

.controller('AppCtrl',function($scope, $rootScope, agendaService, speakerService, sponsorService, exhibitorService,$ionicNavBarDelegate, $ionicModal, $timeout, $location, $state, $ionicHistory, $ionicLoading, ngFB) {
  // Form data for the login modal
  $scope.loginData = {};
  var token = window.localStorage.getItem("token");
  $scope.flogin = true;
  $scope.check = function (){
    token = window.localStorage.getItem("token");
    if(token===null||token===undefined){
      $scope.flogin=true;
    }else{
      $scope.flogin=false;
    }
  };
  // // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope,
    backdropClickToClose: false,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });
  // // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };
  // // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  $scope.getData = function () {
    $timeout(function () {
      agendaService.getAgenda().then(function (response) {
        });
    },0);
    $timeout(function () {
      speakerService.getSpeakerCategory().then(function (response) {
        });
      speakerService.getSpeakers().then(function (response) {
        $scope.spkdata = speakerService.getParsing();
        });
    },0);
    $timeout(function () {
      sponsorService.getSponsors().then(function (response){
        });
    },0);
    $timeout(function () {
      exhibitorService.getExhibitors().then(function (response) {
        });
    },0);
  }
  $scope.getData();
  $scope.openinbrowser = function(url){
    window.open(url,'_system');
  };
  $scope.returnHome=function () {
    var path=$location.path();
    if (path.indexOf('submit') != -1)
      console.log("Path If.")
    else
      $ionicHistory.nextViewOptions({
        disableBack: true
      });
      $state.transitionTo('app.home');
  }
  $scope.fbLogin = function () {
    if(token===null || token===undefined){
      ngFB.login({scope: 'email,publish_actions,user_likes'}).then(
        function (response) {
          if (response.status === 'connected') {
            $rootScope.$broadcast('userLoggedIn');
            $scope.closeLogin();
            $ionicHistory.clearHistory();
            $ionicHistory.clearCache();
            $ionicHistory.nextViewOptions({
              disableBack: true
            });
            $state.transitionTo('app.profile');
          } else {
            navigator.notification.alert("Facebook login failed.",null,"Alert","Close");
          }
        });
    }else{
      $scope.closeLogin();
      $state.transitionTo('app.profile',{reload:true});;
    }
  };
  $scope.logout = function () {
    ngFB.logout().then(
      function (response) {
        window.localStorage.removeItem("userInfo");
        $scope.closeLogin();
        $ionicHistory.clearCache();
          $ionicHistory.clearHistory();
          $ionicHistory.nextViewOptions({
            disableBack: true,
            historyRoot: true
          });
          $state.transitionTo('app.home',{reload:true});
      },
      function (error) {
        navigator.notification.alert("An error occurred while logging out.",null,"Alert","Close");
      })
  };
})

.controller('ProfileCtrl', function($scope, ngFB,$timeout,$state,$ionicHistory) {
  var token = window.localStorage.getItem("token");
  if(token){
    $scope.sharing = " ";
    $scope.$watch(function () {
        return $scope.sharing;
      },
      function (newValue, oldValue) {
        if (newValue == oldValue) {
          return;
        }
        $scope.sharing = newValue;
      }, true);

    ngFB.api({
      path: '/me',
      params: {fields: 'id,name'}
    }).then(
      function (user) {
        window.localStorage.setItem("userInfo", user);
        $scope.user = user;
      },
      function (error) {
        console.log('Profile Facebook error: ' + error.error_description);
      });

    ngFB.api({
      path: '/GCECConference',
      params: {fields: 'id,name'}
    }).then(
      function (obj) {
        window.localStorage.setItem("GCECPageID", obj.id);
      },
      function (error) {
        console.log('GCEC Facebook error: ' + error.error_description);
      });

    $scope.sharefunc = function (msg) {
      var pageId = window.localStorage.getItem("GCECPageID");
      var message = msg;
      ngFB.api({
        method: 'POST',
        path: '/' + pageId + '/feed',
        params: {
          message: message
        }
      }).then(
        function (obj) {
          navigator.notification.alert("The session was shared on Facebook.", null, "Alert", "Close")
        },
        function (error) {
          navigator.notification.alert("An error occurred while sharing this session on Facebook.", null, "Alert", "Close")
        });
    };

    // $scope.pic = function (msg) {
    //   alert(msg);
    //   var options = {
    //     quality: 75,
    //     destinationType: Camera.DestinationType.DATA_URL,
    //     sourceType: Camera.PictureSourceType.CAMERA,
    //     allowEdit: true,
    //     encodingType: Camera.EncodingType.JPEG,
    //     targetWidth: 300,
    //     targetHeight: 300,
    //     popoverOptions: CameraPopoverOptions,
    //     saveToPhotoAlbum: false
    //   };
    //   $cordovaCamera.getPicture(options).then(function (imageData) {
    //       $scope.imgURI = "data:image/jpeg;base64," + imageData;
    //     }, function (err) {
    //       alert("Error occured while getting the picture.")
    //     }
    //   )
    // }
  }else{
    $timeout(function () {
      $ionicHistory.clearCache();
      $ionicHistory.clearHistory();
      $ionicHistory.nextViewOptions({
        disableBack: true,
        historyRoot: true
      });
      $state.transitionTo('app.home',{reload:true});
      $scope.modal.show();
    }, 30);
  }
})

.controller('AgendaCtrl', ['$scope','$filter','agendaService','$stateParams',function($scope, $filter,agendaService,$stateParams,$ionicListDelegate){
  $scope.dayofWeek = agendaService.getDayDetail();
}])
.controller('AgendaBlockCtrl', ['$scope','agendaService','$stateParams','$state',function($scope, agendaService,$stateParams,$state){
    $scope.sessiondata = agendaService.getSessionList($stateParams.dayId);
    $scope.dayof = agendaService.getDay($stateParams.dayId);
    $scope.sessionpage=function (id) {
      if(id>10){
        $state.transitionTo('app.singleAgenda',{agendaId:id});
      }else{
        $state.transitionTo('app.breaksession',{breakId:id});
      }
    }
  }])
.controller('AgendaSessionCtrl', ['$scope','agendaService','$stateParams',function($scope, agendaService,$stateParams){
     $scope.sessions = agendaService.getSession($stateParams.breakId);
  }])
.controller('AgendaListCtrl', ['$scope','agendaService','$stateParams',function($scope, agendaService,$stateParams){
    $scope.eventinfo = agendaService.getEventDetail($stateParams.blockId);
    $scope.block = agendaService.getBlock($stateParams.blockId);
  }])
.controller('AgendaDetailCtrl', ['$scope','agendaService','$stateParams',function($scope, agendaService,$stateParams){
  var favour = [];
  $scope.spkcheck = true;
  $scope.agendaItem = agendaService.getAgendaDetail($stateParams.agendaId);
  if($scope.agendaItem.speakerlist!=null){
    $scope.spkcheck = true;
  }else{
    $scope.spkcheck = false;
  }

  $scope.fav=function(agendaId){
    if(window.localStorage.getItem("favourites")!=null) {
      favour = JSON.parse(window.localStorage.getItem("favourites"));
      if (favour.length == undefined) {
        var temp = favour;
        favour = [];
        favour.push(temp);
      }
      else {
        if (favour.indexOf(agendaId) == -1) {
          favour.push(agendaId);
          navigator.notification.alert("Added to your schedule.",null,"Alert","Close");
        }
        else {
          navigator.notification.alert("Already in your schedule.",null,"Alert","Close");
        }
      }
    }else{
        favour.push(agendaId);
        navigator.notification.alert("Added to your schedule.",null,"Alert","Close");
      }
    window.localStorage.setItem("favourites",JSON.stringify(favour));
  }
}])

.controller('myscheduleCtrl', ['$scope','agendaService','$stateParams', '$ionicHistory','$state','$timeout',function($scope, agendaService,$stateParams,$ionicHistory, $state, $timeout){
  var removelist = [];
  var agendalist = [];
  var agendalist = JSON.parse(window.localStorage.getItem("favourites"));
  if(agendalist!=null) {
    if(agendalist.length!=0){
      $scope.AgendaList = agendaService.getAgendaList(agendalist);
      $scope.doRefresh = function () {
        $scope.AgendaList = agendaService.getAgendaList(JSON.parse(window.localStorage.getItem("favourites")));
        $scope.$broadcast('scroll.refreshComplete');
      }
      $scope.del = function (id) {
        removelist = JSON.parse(window.localStorage.getItem("favourites"));
        for (var i = 0; i < removelist.length; i++) {
          if (removelist.indexOf(id) != -1) {
            removelist.splice(removelist.indexOf(id), 1);
          }
        }
        window.localStorage.setItem("favourites", JSON.stringify(removelist));
        $scope.AgendaList = agendaService.getAgendaList(removelist);
      }
    }
    else{
      navigator.notification.alert("Please add session to your schedule.",null,"Alert","Close");
      $timeout(function () {
        $ionicHistory.clearCache();
        $ionicHistory.clearHistory();
        $ionicHistory.nextViewOptions({
          disableBack: true,
          historyRoot: true
        });
        $state.transitionTo('app.agenda',{reload:true});
      }, 10);
    }
  }else{
    navigator.notification.alert("Please add session to your schedule.",null,"Alert","Close");
    $timeout(function () {
      $ionicHistory.clearCache();
      $ionicHistory.clearHistory();
      $ionicHistory.nextViewOptions({
        disableBack: true,
        historyRoot: true
      });
      $state.transitionTo('app.agenda',{reload:true});
    }, 10);
  }

}])
.controller('myscheduleDetailCtrl', ['$scope','agendaService','$stateParams',function($scope, agendaService,$stateParams){
  $scope.spkcheck = true;
  $scope.AgendaItem = agendaService.getAgendaDetail($stateParams.bookId);
  if($scope.AgendaItem.speakerlist!=null){
    $scope.spkcheck = true;
  }else{
    $scope.spkcheck = false;
  }
}])

.controller('SpeakersCtl', ['$scope','speakerService','$ionicLoading',function($scope, speakerService,$ionicLoading) {
  $scope.booleanspeaker = true;
  $scope.sortedspeaker = speakerService.getSortedSpeaker();
  $scope.universitySpeaker = speakerService.getSpeakerUniversity();
  $scope.toggleCustom = function(){
  $scope.booleanspeaker = $scope.booleanspeaker === false ? true: false
  }
}])
 .controller('SpeakerCtl',['$scope','$stateParams','speakerService',function($scope, $stateParams,speakerService) {
  $scope.getSpeak = function () {
     $scope.speaker=speakerService.getSpeaker($stateParams.speakersId);
   }
   $scope.getSpeak();
}])

.controller('SponsorsCtl', ['$scope','sponsorService',function($scope, sponsorService) {
  $scope.sortedsponsor = sponsorService.getSortedSponsor();

}])
.controller('SponsorCtl',['$scope','$stateParams','sponsorService',function($scope, $stateParams,sponsorService) {
  $scope.getSpons = function () {
    $scope.sponsor=sponsorService.getSponsor($stateParams.sponsorsId);
  }
  $scope.LinkBrowser=function(url){
    window.open(url,'_system');
  }
  $scope.getSpons();
}])

.controller('ExhibitorsCtl', ['$scope','exhibitorService',function($scope, exhibitorService) {
  $scope.exhibitordata=exhibitorService.getSortedExhibitor();
}])
.controller('ExhibitorCtl',['$scope','$stateParams','exhibitorService',function($scope, $stateParams,exhibitorService) {
  $scope.getExhibit = function () {
    $scope.exhibitor=exhibitorService.getExhibitor($stateParams.exhibitorsId);
  }
  $scope.getExhibit();
}])

.controller('AttendeesCtl',['$scope','attendeesService',function ($scope,attendeesService) {
  $scope.booleanattendie = true;
  attendeesService.getAttendees().then(function (response) {
    $scope.attendees = attendeesService.getAttendeesData();
    console.log($scope.attendees);
    $scope.uniattendees = attendeesService.getUniAttendies();
    console.log($scope.uniattendees);
  });
  $scope.toggleCustom1 = function(){
    console.log($scope.booleanattendie);
    $scope.booleanattendie = $scope.booleanattendie === false ? true: false
  }
}]);
