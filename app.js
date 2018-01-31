var app = angular.module('bluebox',['ngRoute','ngTable', 'angularjs-datetime-picker', 'ngSanitize', 'ngResource','ngAnimate','angularUtils.directives.dirPagination','ngWebworker','blockUI', 'angularModalService']);

app.service('detailServices', function(){
    var historyDetails = "";
    var evaluationDetails = "";
    
    this.setHistoryDetail = function(historyDetail){
        historyDetails = historyDetail;
    };

    this.setEvaluationDetail = function(evaluationDetail){
        evaluationDetails = evaluationDetail;
    };
    this.getHistoryDetail = function(){
        return historyDetails;
    };

    this.getEvaluationDetail = function(){
        return evaluationDetails;
    };
});

app.service('locationService',function(){
    var subLocation = "";

    this.setSubLocation = function(location){
        subLocation = location;
    };

    this.getSubLocation = function(){
        return subLocation;
    }
});

app.service('historyMemberService', function(){
    var memberList = "";

    this.setMemberList = function(member){
        memberList = member;
    }

    this.getMemberList = function(){
        return memberList;
    }
});

app.service('profileConference', function(){
    var profileJson = {};

    this.setProfileConference = function(profile){
        profileJson = profile;
    }

    this.getProfileConference = function(){
        return profileJson;
    }

});

app.service('userHeartBeatService', function(Rest){
    this.doHeartBeat = function(){
        var hdrs = {
            "X-TOKEN": localStorage.getItem("edplusId") 
        };
        Rest.get('/v1/userHeartBeat', hdrs)
        .success(function (result) {
            console.log("detak jantung");
        })
        .error(function (error, status) {
            console.log("error catch");
        });
    }
});

app.filter('type', function() {
    return function(obj) {
        return typeof obj;
}});