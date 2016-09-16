/**
 * Created by MaulikZota on 8/4/16.
 */
angular.module('starter.filters',[])
  .filter('dformat',function($filter){
    return function(input) {
      var hr = $filter('limitTo')(input,2);
      var min = $filter('limitTo')(input,2,-2);
      return $filter('date')(new Date(0,0,0,hr,min),'hh:mm a')
    };
  })
;

