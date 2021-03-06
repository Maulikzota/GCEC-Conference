/**
 * Created by MaulikZota on 6/20/16.
 */
angular.module('starter.services', [])

.service('agendaService',['$http','$q', '$filter','speakerService',function($http,$q,$filter,speakerService) {
  _agenda = [];
  _daydata = [];
  _blockdata =[];
  _eventblock =[];
  _sessionlist=[];
  _sessions=[]
  _self = this;
  breakid=0;
  this.getAgenda=function(){
    var deferred = $q.defer();
    $http.get("https://www.rit.edu/gcec2016/gcec2016feed.php?which=session")
      .success(function (response) {
        deferred.resolve(response);
        _agenda=response;
        for(var i=0;i<_agenda.length;i++) {
          _agenda[i]['content'] = JSON.parse(_agenda[i]['content']);
        }
      });
    return deferred.promise;
  };
  var sortingByKey = function (array,key) {
    return array.sort(function(a, b) {
      var x = a[key]; var y = b[key];
      return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
  }
  var sortingByDay = function (array) {
    var day = [];
    var sun = [];
    var mon = [];
    var tue = [];
    var wed = [];
    var thu = [];
    var fri = [];
    var sat = [];
    for (var j = 0; j < array.length; j++) {
      var tempday = $filter('date')((parseInt(array[j].session_date) + 86400) * 1000, "EEEE");
      switch (tempday) {
        case 'Monday':
          mon.push(array[j]);
          break;
        case 'Tuesday':
          tue.push(array[j]);
          break;
        case 'Wednesday':
          wed.push(array[j]);
          break;
        case 'Thursday':
          thu.push(array[j]);
          break;
        case 'Friday':
          fri.push(array[j]);
          break;
        case 'Saturday':
          sat.push(array[j]);
          break;
        default :
          sun.push(array[j]);
          break;
      }
    }
    if(thu.length>0){
      day.push(thu);
    }
    if(fri.length>0){
      day.push(fri);
    }
    if(sat.length>0){
      day.push(sat);
    }
    return day;
  }

  this.getDayDetail=function(){
    var data1 = sortingByKey(_agenda, 'session_time');
    function timeblock(array){
      var ar=[];
      var eventinfo=[];
      var bcount = 0;
      var temp = $filter('date')(array[0].session_time, "H");
      var ptimebk = parseInt($filter('limitTo')(temp,2));
      var cslot = parseInt(temp.replace(":",""));
      var temptime = (parseInt(array[0].session_date) + 86400)* 1000 ;
      var tempday = $filter('date')(temptime, "EEEE");
      eventinfo.push(array[0]);
      var pamvar = " am";
      var camvar = " am";
      var endvar = ptimebk+1;
      for(var k=1;k<array.length;k++){
        var temp = $filter('date')(array[k].session_time, "H");
        var cslot = parseInt(temp.replace(":",""));
        var ctimebk = parseInt($filter('limitTo')(temp,2));
        if(ptimebk!=ctimebk){
          endvar = ptimebk+1;
          if(ptimebk>=12){
            pamvar = " pm";
          }
          if(endvar>=12){
            camvar = " pm";
          }
          if(ptimebk>12){
            ptimebk = ptimebk - 12;
          }
          if(endvar>12){
            endvar = endvar - 12;
          }
          ar.push({'bid':bcount,'blot':ptimebk+pamvar+" - "+endvar+camvar,'eventinfo':eventinfo});
          bcount++;
          eventinfo=[];
          ptimebk=ctimebk;
        }
        if(0<=cslot<100){
          eventinfo.push(array[k]);
          ptimebk=parseInt($filter('limitTo')(temp,2));
        }
      }
      endvar = ptimebk+1
      if(endvar>=12){
        camvar = " pm";
      }
      if(ptimebk>12){
        ptimebk = ptimebk - 12;
        endvar = endvar - 12;
        pamvar = " pm";
      }

      ar.push({'bid':bcount,'blot':ptimebk+pamvar+" - "+endvar+camvar,'eventinfo':eventinfo});
      return ar;
    }
    function breakclub(array){
      var arr = [];
      var count=0;
      var pbreaktitle="";
      var breakblock = null;
      for(var i=0,j=array.length;i<j;i++){
        var tit = array[i].title;
        var cbreaktitle = tit.split(':')[0];
        var upcbreaktitle = $filter('uppercase')(cbreaktitle);
        if(pbreaktitle==upcbreaktitle){
          if(count==0){
            breakblock = {id: breakid,title:cbreaktitle,session_time:array[i].session_time,sessions:[]}
            // array[i-1].title = tit.split(/:(.+)?/)[1];
            breakblock.sessions.push(array[i-1]);
            breakid++;
          }
          // array[i].title = tit.split(/:(.+)?/)[1];
          breakblock.sessions.push(array[i]);
          count++;
        }
        else{
          count=0;
          if(breakblock!=null){
            arr.pop();
            _sessions.push(breakblock);
            arr.push(breakblock);
            arr.push(array[i]);
            breakblock=null;
          }else{
            arr.push(array[i]);
          }
          pbreaktitle=upcbreaktitle;
        }

      }
      // console.log(arr);
      return arr;
    }
    var daysort = sortingByDay(data1);
    var data2=[]
    for(var i=0;i<daysort.length;i++){
      var dayofWeek = $filter('date')((parseInt(daysort[i][0].session_date)+86400)*1000, "fullDate");
      data2.push({'did':i,'day':dayofWeek,'session':breakclub(daysort[i])});
    }
    _daydata = data2;
    return data2;
  }
  this.getDay=function (id) {
    return _daydata[id].day;
  };
  this.getBlockDetail=function(id){
    for(i=0;i<_daydata.length;i++){
      if(_daydata[i].did == id){
        _blockdata = _daydata[i].block;
        return _daydata[i].block;
      }
    }
    return null;
  };
  this.getSessionList=function(id){
    for(i=0;i<_daydata.length;i++){
      if(_daydata[i].did == id){
        _sessionlist = _daydata[i].session;
        return _daydata[i].session;
      }
    }
    return null;
  };
  this.getBlock=function (id) {
    return _blockdata[id].blot;
  };
  this.getSession=function(id){
     return _sessions[id];
  };
  this.getEventDetail=function(id){
    for(i=0;i<_blockdata.length;i++){
      if(_blockdata[i].bid == id){
        _eventblock = _blockdata[i].eventinfo;
        return _blockdata[i].eventinfo;
      }
    }
    return null;
  };
  this.getItem=function(id){
    for(i=0;i<_agenda.length;i++){
      if(_agenda[i].id == id){
        return _agenda[i];
      }
    }
    return null;
  };
  this.getAgendaDetail=function(id){
    var spkidlist=[];
    var agenda = [];
    // var agenda = _agenda;
    var list;
    var init = 5;
    for(var i=0;i<_agenda.length;i++){
      if(_agenda[i].id==id){
        agenda = _agenda[i];
        agenda['session_date'] = parseInt(_agenda[i]['session_date']);
        list = agenda['session_speakers_list'];
        if(list!=undefined) {
          var list1 = list.split(':');
          for (var k = 5, j = list1.length; k < j; k++) {
            if (k==init){
              var spkid=$filter('limitTo')(list1[k],4,1);
              var speak = speakerService.getSpeaker(spkid);
              spkidlist.push(speak);
              init+=3;
            }
          }
          agenda.speakerlist = spkidlist;
        }
        else{
          agenda.speakerlist =[];
        }
        return agenda;
      }
    }
    return null;
  };
  this.getSingleAgenda=function (id) {
    for(i=0;i<_agenda.length;i++){
      if(_agenda[i].id == id){
        return _agenda[i];
      }
    }
    return null;
  };
  this.getAgendaList=function (arr) {
    var agdarr = [];
    for(var i=0;i<arr.length;i++){
      for(var j=0;j<_agenda.length;j++){
        if(_agenda[j].id==arr[i]){
          agdarr.push(_agenda[j]);
          break;
        }
      }
    }
    var timearr = sortingByKey(agdarr,'session_time');
    var dayarr = sortingByDay(timearr);
    var idDay;
    var newarr = {};
    for(var i = 0; i < dayarr.length; i++) {
      idDay = $filter('date')((parseInt(dayarr[i][0].session_date) + 86400) * 1000, "fullDate");
      newarr[i]={day:idDay,agenda:[]};
      for(var j=0;j<dayarr[i].length;j++){
        newarr[i].agenda.push(dayarr[i][j]);
      }
    }
    return newarr;
  }
}])

.service('speakerService',['$http','$q','$filter',function($http,$q,$filter) {
  _speakers = [];
  _updatedspeakers=[];
  _speakerssorted = [];
  _universityspeaker=[];
  _speakerscat = [];
  var sortingByKey = function (array,key) {
    return array.sort(function(a, b) {
      var x = a[key]; var y = b[key];
      return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
  }
  var sortbyLname = function(array){
    var speaker = array;
    var speakerarr = {};
    var sortedarr = [];
    var nam;
    for(var i=0;i<speaker.length;i++){
      var name = speaker[i]['title'];
      if(name!='Break of Reality') {
        var lname = name.split(' ').splice(-1).toString();
        var fname = $filter('limitTo')(name, name.lastIndexOf(" "))
        speakerarr = {lname:lname,fname:fname,speakerdata:speaker[i]}
        sortedarr.push(speakerarr);
      }else{
        speakerarr = {lname:"Break",fname:" of Reality",speakerdata:speaker[i]}
        sortedarr.push(speakerarr);
      }
    }
    var speakers = sortingByKey(sortedarr,'lname');
    return speakers;

  }

  this.getSpeakerCategory=function () {
    var deferred = $q.defer();
    $http.get("https://www.rit.edu/gcec2016/gcec2016feed.php?which=speaker&categories=yes")
      .success(function (response) {
        deferred.resolve(response);
        _speakerscat=response;
      });
    return deferred.promise;
  }
  this.getSpeakers=function(){
    var deferred = $q.defer();
    $http.get("https://www.rit.edu/gcec2016/gcec2016feed.php?which=speaker")
      .success(function (response) {
        deferred.resolve(response);
        _speakers=response;
      });
    return deferred.promise;
    };
  this.getParsing=function(){
    // console.log("Parsing");
    // var speaker = _speakers;
    for(i=0,j=_speakers.length;i<j;i++) {
      _speakers[i].content = JSON.parse(_speakers[i].content);
      _speakers[i].content = _speakers[i].content ? String(_speakers[i].content).replace(/<[^>]+>/gm, '') : '';
      var tit2 = _speakers[i]['speaker_title'];
      if (tit2!==undefined){
        if(tit2.length != 0) {
          _speakers[i]['speaker_title'] = tit2 ? String(tit2).replace(/<[^>]+>/gm, '') : '';
        }
      }
    }
  }
  this.getSortedSpeaker=function(){
    // // var speaker = _speakers;
    var speaklist = [];
    var speakerarr=[];
    angular.forEach(_speakerscat,function (value,key) {
      speaklist.push(value);
    });
    for (i=0,j=speaklist.length;i<j;i++){
      speaklist[i] = speaklist[i].split(',');
    }
    var count=0;
    for (k=0,l=speaklist.length;k<l;k++){
     if(k%2==1) {
       speakerarr[count]={category: speaklist[k-1][0],speaklist:[]};
       for (m = 0, n = speaklist[k].length; m < n; m++) {
         var speakerdata =[];
         speakerdata= this.getSpeaker(speaklist[k][m]);
         // console.log(speakerdata);
         if(speakerdata!=null){
           speakerarr[count].speaklist.push(speakerdata);
           _updatedspeakers.push(speakerdata);
         }
       }
       count++;
     }
    }
    for(i=0,j=speakerarr.length;i<j;i++){
      speakerarr[i].speaklist = sortbyLname(speakerarr[i].speaklist);
    }
    return speakerarr;
  };
  this.getSpeaker=function(id){
    for(i=0;i<_speakers.length;i++){
      if(_speakers[i].id == id){
        _speakers[i]['speaker_title'] = _speakers[i]['speaker_title'] ? String(_speakers[i]['speaker_title']).replace(/<[^>]+>/gm, '') : '';
        return _speakers[i];
      }
    }
    return null;
  };
  this.getSpeakerUniversity=function(){
    var speaker = _updatedspeakers;
    var sortedarr = [];
    var ucount=0;
    var speakcount;
    var check = function (array,key) {
      if(array.length!=0){
        for(var i=0,j=array.length;i<j;i++){
          if(array[i].university == key){
            speakcount=i;
            return false;
          }
        }
        return true;
      }else{
        return true;
      }
    }
    for(var i=0;i<speaker.length;i++){
      var uni = $filter('uppercase')(speaker[i]['speaker_title']);
      if( uni===undefined || uni.length!=0) {
          if(check(sortedarr,uni)){
            sortedarr[ucount]={university:uni,speakerdata:[]};
            sortedarr[ucount].speakerdata.push(speaker[i]);
            ucount++;
          }else{
            sortedarr[speakcount].speakerdata.push(speaker[i]);
          }
      }else{
          uni = "UNIVERSITY NOT SPECIFIED";
          if(check(sortedarr,uni)){
            sortedarr[ucount]={university:uni,speakerdata:[]};
            sortedarr[ucount].speakerdata.push(speaker[i]);
            ucount++;
          }else{
            sortedarr[speakcount].speakerdata.push(speaker[i]);
          }

      }
    }
    for(var k=0,l=sortedarr.length;k<l;k++) {
      sortedarr[k].speakerdata = sortbyLname(sortedarr[k].speakerdata);
    }
    for(var k=0,l=sortedarr.length;k<l;k++) {
      var unispeakdata=[];
      unispeakdata=sortedarr[k].speakerdata;
      for(var m=1,n=unispeakdata.length;m<n;m++){
        if(unispeakdata[m].speakerdata.title==unispeakdata[m-1].speakerdata.title){
          unispeakdata.splice(m,1);
          n=n-1;
        }
      }
      sortedarr[k].speakerdata = unispeakdata;
    }
    sortedarr = sortingByKey(sortedarr,'university');
    return sortedarr;
  }
}])

.service('sponsorService',['$http','$q', function($http,$q) {
  _sponsors = [];
  _rankSponsor = [{name:"Premiere",rank:0},{name:"Awards Gala Banquet",rank:1},{name:"Redwood",rank:2},{name:"Oak and Drink Tickets",rank:3},{name:"Oak",rank:4},{name:"Maple",rank:5},{name:"Birch",rank:6},{name:"Host Universities",rank:7},{name:"GCEC Central Office",rank:8},{name:"Leadership Circle Schools",rank:9}];
  var sortingByKey = function (array,key) {
    return array.sort(function(a, b) {
      var x = a[key]; var y = b[key];
      return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
  }

  this.getSponsors=function(){
    var deferred = $q.defer();
    $http.get("https://www.rit.edu/gcec2016/gcec2016feed.php?which=sponsor")
      .success(function (response) {
        deferred.resolve(response);
        _sponsors=response;
      });
    return deferred.promise;
  };
  this.getSponsor=function(id){
    for(i=0;i<_sponsors.length;i++){
      if(_sponsors[i].id == id){
        var imga = _sponsors[i]['image'];
        var link = _sponsors[i]['sponsor_link'];
        _sponsors[i]['content']=JSON.parse(_sponsors[i]['content']);
        _sponsors[i]['image']=imga ? String(imga).replace(/<[^>]+>/gm, '') : '';
        _sponsors[i]['sponsor_link']=link ? String(link).replace(/<[^>]+>/gm, '') : '';
        return _sponsors[i];

      }
    }
    return null;
  };
  this.getSortedSponsor=function () {
    var tcount =0;
    var sortedspon = []
    var sponcount;
    var check = function (array,key) {
      if(array.length!=0){
        for(var i=0,j=array.length;i<j;i++){
          if(array[i].tier == key){
            sponcount=i;
            return false;
          }
        }
        return true;
      }else{
        return true;
      }
    }
    var getrank = function (name) {
      var rank;
      for(var i=0,j=_rankSponsor.length;i<j;i++){
        if(_rankSponsor[i].name == name){
          rank = _rankSponsor[i].rank;
          return rank;
        }
      }
      if(i=8){
        return 10;
      }
    }

    for(var i=0,j=_sponsors.length;i<j;i++) {
      var tier = _sponsors[i]['tier'];
      var rank;
      if (check(sortedspon, tier)) {
        rank = getrank(tier);
        sortedspon[tcount] = {tier: tier, rank: rank,sponsorsdata: []}
        sortedspon[tcount].sponsorsdata.push(_sponsors[i]);
        tcount++;
      } else {
        sortedspon[sponcount].sponsorsdata.push(_sponsors[i]);
      }
    }
    for(var i=0,j=sortedspon.length;i<j;i++){
      sortedspon[i].sponsorsdata=sortingByKey(sortedspon[i].sponsorsdata,'title');
    }
    sortedspon = sortingByKey(sortedspon,'rank');
    return sortedspon;
  }
}])

.service('exhibitorService',['$http','$q', function($http,$q) {
  _exhibitors = [];
  var sortingByKey = function (array,key) {
    return array.sort(function(a, b) {
      var x = a[key]; var y = b[key];
      return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
  }

  this.getExhibitors=function(){
    var deferred = $q.defer();
    $http.get("https://www.rit.edu/gcec2016/gcec2016feed.php?which=exhibitor")
      .success(function (response) {
        deferred.resolve(response);
        _exhibitors=response;
      });
    return deferred.promise;
  };
  this.getExhibitor=function(id){
    for(i=0;i<_exhibitors.length;i++){
      if(_exhibitors[i].id == id){
        return _exhibitors[i];
      }
    }
    return null;
  };

  this.getSortedExhibitor=function () {
    var sorted = sortingByKey(_exhibitors,'title');
    return sorted;
  }
}])

.service('mapService',['$http','$q', function($http,$q) {
    _locations = [];
    this.getLocations=function(){
      var deferred = $q.defer();
      $http.get("https://www.rit.edu/gcec2016/gcec2016feed.php?which=poi")
        .success(function (response) {
          deferred.resolve(response);
          _locations=response;
        });
      return deferred.promise;
    };
    this.getLocaton=function(id){
      for(i=0;i<_locations.length;i++){
        if(_locations[i].id == id){
          return _locations[i];
        }
      }
      return null;
    };
  }])

.service('attendeesService',['$http','$q','$filter',function ($http,$q,$filter) {
  _attendeesdata =[];
  var sortingByKey = function (array,key) {
    return array.sort(function(a, b) {
      var x = a[key]; var y = b[key];
      return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
  }
  this.getAttendees=function(){
    var deferred = $q.defer();
    // /Users/MaulikZota/GCEC2016/platforms/ios/www/Registrated.csv
    $http.get("Registrated.csv")
      .success(function (response) {
        deferred.resolve(response);
        var attendees = response;
        attendees = attendees.split(/\r\n|\n/);
        var headers = attendees[0].split(',');
        var lines = [];
        for (var i = 1, j = attendees.length - 1; i < j; i++) {
          var data = attendees[i].split(',');
          var tarr = {fname:data[0],lname:data[1],uni:data[2]};
          lines.push(tarr);
        }
        _attendeesdata=lines;
      });
    return deferred.promise;
  };
  this.getAttendeesData = function () {
    var lines=sortingByKey(_attendeesdata,'lname');
    console.log(lines);
    return lines;
  }
  this.getUniAttendies=function () {
    var data = _attendeesdata;
    var sortedarr = [];
    var ucount=0;
    var attcount;
    var check = function (array,key) {
      if(array.length!=0){
        for(var i=0,j=array.length;i<j;i++){
          if(array[i].uni == key){
            attcount=i;
            return false;
          }
        }
        return true;
      }else{
        return true;
      }
    }
    for(var i=0;i<data.length;i++){
      var uni = $filter('uppercase')(data[i]['uni']);
      if( uni===undefined || uni.length!=0) {
        if(check(sortedarr,uni)){
          sortedarr[ucount]={uni:uni,attendiedata:[]};
          sortedarr[ucount].attendiedata.push(data[i]);
          ucount++;
        }else{
          sortedarr[attcount].attendiedata.push(data[i]);
        }
      }else{
        uni = "UNIVERSITY NOT SPECIFIED";
        if(check(sortedarr,uni)){
          sortedarr[ucount]={uni:uni,attendiedata:[]};
          sortedarr[ucount].attendiedata.push(data[i]);
          ucount++;
        }else{
          sortedarr[attcount].attendiedata.push(data[i]);
        }

      }
    }
    for(var k=0,l=sortedarr.length;k<l;k++) {
      sortedarr[k].attendiedata = sortingByKey(sortedarr[k].attendiedata,'lname');
    }
    sortedarr = sortingByKey(sortedarr,'uni');
    console.log(sortedarr);
    return sortedarr;
  }
}])
;
