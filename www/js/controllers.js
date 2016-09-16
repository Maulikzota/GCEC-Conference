angular.module('starter.controllers', [])
// .directive('dividerCollectionRepeat', function($parse) {
//     return {
//       priority: 1001,
//       compile: compile
//     };
//
//     function compile (element, attr) {
//       var height = attr.itemHeight || '73';
//       attr.$set('itemHeight', 'item.isDivider ? 37 : ' + height);
//
//       element.children().attr('ng-hide', 'item.isDivider');
//       element.prepend(
//         '<div class="item item-divider ng-hide" ng-show="item.isDivider" ng-bind="item.divider"></div>'
//       );
//     }
//   })
// .filter('currentformat',function ($filter) {
//   var dividers = {};
//   return function(input) {
//     if (!input || !input.length) return;
//
//     var output = [],
//       previousDate,
//       currentDate;
//     alert("Inside filter: "+input.length)
//     for (var i = 0, ii = input.length; i < ii; i++) {
//       currentDate = $filter('date')((parseInt(input[i].session_date)+86400)*1000, "EEEE")
//       if (currentDate!=previousDate) {
//
//         var dividerId = currentDate;
//
//         if (!dividers[dividerId]) {
//           dividers[dividerId] = {
//             isDivider: true,
//             divider: currentDate
//           };
//         }
//
//         output.push(dividers[dividerId]);
//       }
//
//       output.push(item);
//       previousDate = currentDate;
//     }
//
//     return output;
//   };
// })

.filter('dformat',function($filter){
  return function(input) {
    var hr = $filter('limitTo')(input,2);
    var min = $filter('limitTo')(input,2,-2);
   return $filter('date')(new Date(0,0,0,hr,min),'hh:mm a')
  };
})

.controller('AppCtrl',function($scope, $rootScope, agendaService, speakerService, sponsorService, exhibitorService,$ionicNavBarDelegate, $ionicModal, $timeout, $location, $state, $ionicHistory, $ionicLoading, ngFB) {
  // , $ionicModal, $timeout, $location, $state, $ionicHistory, $ionicLoading, ngFB
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});
  // Form data for the login modal

  $scope.loginData = {};
  var token = window.localStorage.getItem("token");
  $scope.flogin = true;

  $scope.check = function (){
    token = window.localStorage.getItem("token");
    // console.log("From Menu: "+$scope.flogin)
    if(token===null||token===undefined){
      $scope.flogin=true;
      // console.log("From if: "+$scope.flogin)
    }else{
      $scope.flogin=false;
      // console.log("From else: "+token)
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
  // // Perform the login action when the user submits the login form
  // // $scope.doLogin = function() {
  // //   console.log('Doing login', $scope.loginData);
  // //
  // //   // Simulate a login delay. Remove this and replace with your login
  // //   // code if using a login system
  // //   $timeout(function() {
  // //     $scope.closeLogin();
  // //   }, 1000);
  // // };

  $scope.getData = function () {
    agendaService.getAgenda().then(function (response) {
        // console.log("agendaService done.");
      }
      // ,function(error){
      //   console.log("Error In ctrl for loading speaker data")
      // }
    );
    speakerService.getSpeakerCategory().then(function (response) {

    });
    speakerService.getSpeakers().then(function (response) {
        // console.log("speakerService done.");
      }
      // ,function(error){
      //   console.log("Error In ctrl for loading speaker data")
      // }
    );
    sponsorService.getSponsors().then(function (response) {
        // console.log("sponsorService done.");
      }
      // ,function(error){
      //   console.log("Error In ctrl for loading speaker data")
      // }
    );
    exhibitorService.getExhibitors().then(function (response) {
        // console.log("exhibitorService done.");
      }
      // ,function(error){
      //   console.log("Error In ctrl for loading speaker data")
      // }
    );
  }
  // $rootScope.$on('userLoggedIn',function () {
  //   console.log("CHecking the broadcast")
  // });
  $scope.getData();
  $scope.openinbrowser = function(url){
    window.open(url,'_system');
  };
  $scope.returnHome=function () {
    var path=$location.path();
    if (path.indexOf('submit') != -1)
      alert("Path if")
      // $ionicNavBarDelegate.showBackButton(false);
    else
      $ionicHistory.clearHistory();
      $ionicHistory.clearCache();
      $ionicHistory.nextViewOptions({
        disableBack: true
      });
      $state.transitionTo('app.home');
  }
  $scope.fbLogin = function () {
    // var bool = window.localStorage.getItem("LoggedIn");
    //  alert("Login func")
    //alert(window.sessionStorage)
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
        // $timeout(function () {
        //   // $ionicLoading.hide();
        //   $ionicHistory.clearCache();
        //   $ionicHistory.clearHistory();
        //   $ionicHistory.nextViewOptions({
        //     disableBack: true,
        //     historyRoot: true
        //   });
        //   // $scope.modal.show();
        //   $scope.modal.show();
        //   $state.transitionTo('app.home',{reload:true});
        // }, 30);
        // $state.go($state.current,$stateParams,{location:true,reload:true,inherit:false,notify:true});
        //$location.path('/app/home');
      },
      function (error) {
        navigator.notification.alert("An error occurred while logging out.",null,"Alert","Close");
      })
  };

})

// .controller('LoginCtrl',function ($scope, $rootScope,$ionicModal, $timeout, $location, $state, $ionicHistory, $ionicLoading, ngFB) {
//
//   $scope.loginData = {};
//   var token = window.localStorage.getItem("token");
//   $scope.check = function () {
//     if(token===null||token===undefined){
//       return true;
//     }else{
//       return false;
//     }
//   };
//   // Create the login modal that we will use later
//   $ionicModal.fromTemplateUrl('templates/login.html', {
//     scope: $scope
//   }).then(function(modal) {
//     $scope.modal = modal;
//   });
//   // Triggered in the login modal to close it
//   $scope.closeLogin = function() {
//     $scope.modal.hide();
//   };
//   // Open the login modal
//   $scope.login = function() {
//     $scope.modal.show();
//   };
//   // Perform the login action when the user submits the login form
//   // $scope.doLogin = function() {
//   //   console.log('Doing login', $scope.loginData);
//   //
//   //   // Simulate a login delay. Remove this and replace with your login
//   //   // code if using a login system
//   //   $timeout(function() {
//   //     $scope.closeLogin();
//   //   }, 1000);
//   // };
//   $scope.fbLogin = function () {
//     // var bool = window.localStorage.getItem("LoggedIn");
//     //  alert("Login func")
//     //alert(window.sessionStorage)
//     if(token===null || token===undefined){
//       ngFB.login({scope: 'email,publish_actions,user_likes'}).then(
//         function (response) {
//           if (response.status === 'connected') {
//             // $rootScope.$broadcast('userLoggedIn');
//             $scope.closeLogin();
//             $ionicHistory.clearHistory();
//             $ionicHistory.clearCache();
//             $ionicHistory.nextViewOptions({
//               disableBack: true
//             });
//             $state.transitionTo('app.profile');
//             // $location.path('/app/profile');
//             console.log("Checking...")
//             // $route.reload();
//           } else {
//             alert('Facebook login failed');
//           }
//         });
//     }else{
//       $scope.closeLogin();
//       $location.path("/app/profile");
//     }
//   };
//
//   $scope.logout = function () {
//     ngFB.logout().then(
//       function (response) {
//         $scope.closeLogin();
//         $timeout(function () {
//           // $ionicLoading.hide();
//           $ionicHistory.clearCache();
//           $ionicHistory.clearHistory();
//           $ionicHistory.nextViewOptions({
//             disableBack: true,
//             historyRoot: true
//           });
//           $location.path('/app/agenda');
//         }, 30);
//         // $state.go($state.current,$stateParams,{location:true,reload:true,inherit:false,notify:true});
//         //$location.path('/app/home');
//       },
//       function (error) {
//         navigator.notification.alert("An error occurred while logging out.",null,"Alert","Close");
//       })
//   };
//
// })

.controller('ProfileCtrl', function($scope, ngFB,$timeout,$state,$ionicHistory) {
  // $location
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
        //alert('Profile Facebook error: ' + error.error_description);
      });
    // $scope.imageFile = 'http://graph.facebook.com/'+$scope.user.id+'/picture?width=200&height=200';

    ngFB.api({
      path: '/GCECConference',
      params: {fields: 'id,name'}
    }).then(
      function (obj) {
        window.localStorage.setItem("GCECPageID", obj.id);
      },
      function (error) {
        //alert('GCEC Facebook error: ' + error.error_description);
      });

    $scope.sharefunc = function (msg) {
      //alert("Inside the function.")
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
          //alert("Id: "+obj)
          navigator.notification.alert("The session was shared on Facebook.", null, "Alert", "Close")
          // alert('The session was shared on Facebook');
        },
        function (error) {
          navigator.notification.alert("An error occurred while sharing this session on Facebook.", null, "Alert", "Close")
          // alert('An error occurred while sharing this session on Facebook' + error.error_description);
        });
    };

    $scope.pic = function (msg) {
      alert(msg);
      var options = {
        quality: 75,
        destinationType: Camera.DestinationType.DATA_URL,
        sourceType: Camera.PictureSourceType.CAMERA,
        allowEdit: true,
        encodingType: Camera.EncodingType.JPEG,
        targetWidth: 300,
        targetHeight: 300,
        popoverOptions: CameraPopoverOptions,
        saveToPhotoAlbum: false
      };
      $cordovaCamera.getPicture(options).then(function (imageData) {
          $scope.imgURI = "data:image/jpeg;base64," + imageData;
        }, function (err) {
          alert("Error occured while getting the picture.")
        }
      )
    }
  }else{
    $timeout(function () {
      // $ionicLoading.hide();
      $ionicHistory.clearCache();
      $ionicHistory.clearHistory();
      $ionicHistory.nextViewOptions({
        disableBack: true,
        historyRoot: true
      });
      $state.transitionTo('app.home',{reload:true});
      $scope.modal.show();
      // $state.transitionTo('app.login', { reload: true, inherit: false, notify: true });
      // $state.transitionTo('app.login',{reload:true});
      // $location.path('/app/login');
    }, 30);
    // $state.transitionTo('app.login',{reload:true});
    // $location.path('/app/login');
  }
})

.controller('PlaylistsCtrl', function($scope) {
  $scope.playlists = [
    { title: 'Reggae', id: 1 },
    { title: 'Chill', id: 2 },
    { title: 'Dubstep', id: 3 },
    { title: 'Indie', id: 4 },
    { title: 'Rap', id: 5 },
    { title: 'Cowbell', id: 6 }
  ];
})
.controller('PlaylistCtrl', function($scope, $stateParams) {
})

.controller('AgendaCtrl', ['$scope','$filter','agendaService','$stateParams',function($scope, $filter,agendaService,$stateParams,$ionicListDelegate){
  $scope.dayofWeek = agendaService.getDayDetail();

  // $scope.getData = function () {
  //   //$scope.dayofWeek = agendaService.getDayDetail();
  //   agendaService.getAgenda().then(function (response) {
  //     $scope.agendadata = response;
  //     $scope.dayofWeek = agendaService.getDayDetail(response);
  //     })
  // }
  //
  // $scope.getData();
}])
.controller('AgendaBlockCtrl', ['$scope','agendaService','$stateParams',function($scope, agendaService,$stateParams){
    $scope.timeblock = agendaService.getBlockDetail($stateParams.dayId);
    $scope.dayof = agendaService.getDay($stateParams.dayId);
  }])
.controller('AgendaListCtrl', ['$scope','agendaService','$stateParams',function($scope, agendaService,$stateParams){
    $scope.eventinfo = agendaService.getEventDetail($stateParams.blockId);
    $scope.block = agendaService.getBlock($stateParams.blockId);
  }])
.controller('AgendaDetailCtrl', ['$scope','agendaService','$stateParams',function($scope, agendaService,$stateParams){
  var favour = [];
  $scope.spkcheck = true;
  $scope.agendaItem = agendaService.getAgendaDetail($stateParams.agendaId);
  if($scope.agendaItem.speakerlist.length!=0){
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
          navigator.notification.alert("Added to your schedule.",null,"Alert","Close")
          // alert("Added to your schedule.")
        }
        else {
          navigator.notification.alert("Already in your schedule.",null,"Alert","Close")
          // alert("Already in your schedule.")
        }
      }
    }else{
        favour.push(agendaId);
        navigator.notification.alert("Added to your schedule.",null,"Alert","Close");
        // alert("Added to your schedule.");
      }

    window.localStorage.setItem("favourites",JSON.stringify(favour));
  }
}])

.controller('myscheduleCtrl', ['$scope','agendaService','$stateParams', '$ionicHistory','$state','$timeout',function($scope, agendaService,$stateParams,$ionicHistory, $state, $timeout){
  var removelist = [];
  var agendalist = [];
  var agendalist = JSON.parse(window.localStorage.getItem("favourites"));
  if(agendalist||agendalist.length!=0) {
    $scope.AgendaList = agendaService.getAgendaList(agendalist);
    //alert($scope.AgendaList.length)
    $scope.doRefresh = function () {
      $scope.AgendaList = agendaService.getAgendaList(JSON.parse(window.localStorage.getItem("favourites")));
      $scope.$broadcast('scroll.refreshComplete');
    }
    $scope.$watch('day', function () {
      if ($scope.inputty == "pday") {
        $scope.output = "OK!";
      } else {
        $scope.output = "NOT OK!";
      }
    });
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
  }else{
    navigator.notification.alert("Please add session to your schedule.",null,"Alert","Close");
    $timeout(function () {
      // $ionicLoading.hide();
      $ionicHistory.clearCache();
      $ionicHistory.clearHistory();
      $ionicHistory.nextViewOptions({
        disableBack: true,
        historyRoot: true
      });
      $state.transitionTo('app.agenda',{reload:true});
    }, 30);
  }

}])
.controller('myscheduleDetailCtrl', ['$scope','agendaService','$stateParams',function($scope, agendaService,$stateParams){
  $scope.AgendaItem = agendaService.getSingleAgenda($stateParams.bookId);
  // $scope.fav=function(agendid){
  //   window.localStorage.setItem("favouites",agendid);
  //   alert("Added to your schedule.")
  // }
}])
// .controller('SpeakersCtl', function($scope, $http) {
//
//   $http.get("https://www.rit.edu/gcec2016/gcec2016feed.php?which=speaker")
//     .success(function(data) {
//       $scope.speakerdata=data;
//     })
//     .error(function(data) {
//       alert("There are no Speakers available.");
//     });
// })
 // this is a service http request
.controller('SpeakersCtl', ['$scope','speakerService',function($scope, speakerService) {
      $scope.booleanspeaker = true;
      $scope.speakerSorted = speakerService.getParsing();
      $scope.sortedspeaker = speakerService.getSortedSpeaker();
      $scope.universitySpeaker = speakerService.getSpeakerUniversity();
      $scope.toggleCustom = function(){
        $scope.booleanspeaker = $scope.booleanspeaker === false ? true: false
      }
  // $scope.getData = function () {
  //   speakerService.getSpeakers().then(function (response) {
  //     $scope.booleanspeaker = true;
  //     $scope.speakerdata=response;
  //     $scope.speakersdata = speakerService.getParsing();
  //     $scope.sortedspeaker = speakerService.getSortedSpeaker();
  //     $scope.universitySpeaker = speakerService.getSpeakerUniversity();
  //     $scope.toggleCustom = function(){
  //       $scope.booleanspeaker = $scope.booleanspeaker === false ? true: false
  //     }
  //   })
  // }
  // $scope.getData();
}])
 .controller('SpeakerCtl',['$scope','$stateParams','speakerService',function($scope, $stateParams,speakerService) {
  $scope.getSpeak = function () {
     $scope.speaker=speakerService.getSpeaker($stateParams.speakersId);
   }
   $scope.getSpeak();
}])

.controller('SponsorsCtl', ['$scope','sponsorService',function($scope, sponsorService) {
  $scope.sortedsponsor = sponsorService.getSortedSponsor();
  // $scope.getData = function () {
  //   sponsorService.getSponsors().then(function (response) {
  //     $scope.sponsordata=response;
  //     $scope.sortedsponsor = sponsorService.getSortedSponsor();
  //   })
  // }
  // $scope.getData();
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
  // $scope.getData = function () {
  //   exhibitorService.getExhibitors().then(function (response) {
  //     $scope.exhibitordata=response;
  //   })
  // }
  // $scope.getData();
}])
.controller('ExhibitorCtl',['$scope','$stateParams','exhibitorService',function($scope, $stateParams,exhibitorService) {
  $scope.getExhibit = function () {
    $scope.exhibitor=exhibitorService.getExhibitor($stateParams.exhibitorsId);
  }
  $scope.getExhibit();
}])

  // .controller('AgendaCtrl', ['$scope','$filter','agendaService','$stateParams',function($scope, $filter,agendaService,$stateParams,$ionicListDelegate){
  //   $scope.getData = function () {
  //     //$scope.dayofWeek = agendaService.getDayDetail();
  //     agendaService.getAgenda().then(function (response) {
  //       $scope.agendadata = response;
  //       $scope.dayofWeek = agendaService.getDayDetail(response);
  //     })
  //   }
  //   $scope.getData();
  // }])
// .controller('SponsorsCtl', function($scope, $http) {
//
//   $http.get("https://www.rit.edu/gcec2016/gcec2016feed.php?which=sponsor")
//     .success(function(data) {
//       $scope.sponsordata=data;
//     })
//     .error(function(data) {
//       alert("There are no Sponsors available.");
//     });
// })
// .controller('MapCtl',function($scope) {
// });
;
