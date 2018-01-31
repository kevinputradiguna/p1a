// function ConferenceController($scope, $rootScope, $q, Rest, ModalService, blockUI, CONFIG){
function ConferenceController($scope,$q,Rest,CONFIG,profileConference){

    var ctrl = this;
    var session;
    $scope.profileJson = {};
    var memberData = $scope.memberData = [];
    var isSwitch;
    
    
    ctrl.$onInit = function(){
         var sessionId = localStorage.getItem('sessionId');
         var token = localStorage.getItem('token');
         var apiKey = localStorage.getItem('apiKey');
         var isInstructor = localStorage.getItem('isInstructor');
         profileJson = profileConference.getProfileConference();
         $scope.roomName = localStorage.getItem('roomName');
         memberData = JSON.parse(localStorage.getItem('roomMember'));
         $scope.totalMember = localStorage.getItem('totalMember');

         if(localStorage.getItem('isSwitch') != undefined || localStorage.getItem('isSwitch') != '' || localStorage.getItem('isSwitch') != null){

         }else{
             isSwitch = localStorage.getItem('isSwitch');
         }

         ctrl.initialSession();
    }

    ctrl.initialSession = function(){
        session = OT.initSession(apiKey, sessionId);

        session.on({
            connectionCreated : function(event){
                if(event.connection.connectionId != session.connection.connectionId){
                    var eventObject = JSON.parse(event.connection.data);
                    $scope.$watch('memberData',() =>{
                        for(var index = 0; index < memberData.length; index++){
                            if(memberData[index].memberId == eventObject.userId){
                                memberData[index].onlineStatus = 1;
                                memberData[index].connectionId = event.connection.connectionId;
                            }
                        }
                        localStorage.setItem('roomMember',JSON.stringify(memberData));
                    });
                    $scope.$apply();
                }
            },

            connectionDestroyed : function(event){
                var eventObject = JSON.parse(event.connection.data);
                var localStorageVar = JSON.parse(localStorage.getItem('roomMember'));
                $scope.$watch('memberData',() => {
                    for(var index = 0; index < localStorageVar.length; index++){
                        if(localStorageVar[index].memberId == eventObject.userId){
                            memberData[index].onlineStatus = 0;
                        }
                    }
                    localStorage.setItem('roomMember',JSON.stringify(localStorageVar));
                });
                $scope.$apply();
            },

            streamCreated : function(event){
                if(isInstructor == 0 && localStorage.getItem('isSwitch') == 0){
                    subscriber = session.subscribe(event.stream,'subscriber',{
                    resolution:'320x240',
                    frameRate: 7,
                    insertMode: 'replace',
                    width: '100%',
                    height: '100%',
                    disabledAudioProcessing: false
                    },handleError);
                        subscriber.setAudioVolume(100);
                }else if(isInstructor == 1 && localStorage.getItem('isSwitch') == 1){
                    subscriber = session.subscribe(event.stream,'subscriber',{
                        resolution:'320x240',
                        frameRate: 7,
                        insertMode: 'replace',
                        width: '100%',
                        height: '100%',
                        disabledAudioProcessing: false
                    },handleError);
                    subscriber.setAudioVolume(100);
                }else if(isInstructor == 0 && localStorage.getItem('isSwitch') == 1 && localStorage.getItem('chosenMember') == session.connection.connectionId){
                    subscriber = session.subscribe(event.stream,'subscriber',{
                        resolution:'320x240',
                        frameRate: 7,
                        insertMode: 'replace',
                        width: '100%',
                        height: '100%',
                        disabledAudioProcessing: false
                    },handleError);
                    subscriber.setAudioVolume(100);
                }else{
                    subscriber = session.subscribe(event.stream,'subscriber',{
                        resolution:'320x240',
                        frameRate: 7,
                        insertMode: 'append',
                        width: '100%',
                        height: '50%',
                        disabledAudioProcessing: false
                    },handleError);
                    subscriber.setAudioVolume(100);}  
            },

            streamDestroyed: function(event){
                event.preventDefault();
                console.log('stream destroyed');
            }
        });

        session.connect(token, function(error){
            if(error){
                handleError(error);
            }else{
                if(isInstructor == 1){
                    publisher = OT.initPublisher('publisher',{
                        resolution:'1280x720',
                        frameRate: 30,
                        insertMode: 'replace',
                        width: '100%',
                        height: '100%',
                        disabledAudioProcessing: true,
                        audioBitrate: 64000,
                        enableStereo: true,
                    }, handleError);
                    
                    session.publish(publisher);
                    $scope.raiseHandInsShow = true;
                    $scope.messageShow = true;
                }
            }
        });

        session.on('signal:msg', function(event){
            if(event.from.connectionId != session.connection.connectionId){
                $scope.message['messageClass'] = 0;
                $scope.message['message'] = event.data.message;
                $scope.message['name'] = event.data.name;
                $scope.message['imageUrl'] = event.data.imageUrl;
            }else{
                $scope.message['messageClass'] = 1;
                $scope.message['message'] = event.data.message;
                $scope.message['name'] = event.data.name;
                $scope.message['imageUrl'] = event.data.imageUrl;
            }
        });

        session.on('signal:raiseHand', function(event){
            if(event.from.connectionId != session.connection.connectionId && event.data == 1){
                document.getElementById(event.from.connectionId).style.visibility = "visible";
            }else if(event.from.connectionId != session.connection.connectionId && event.data == 0){
                document.getElementById(event.from.connectionId).style.visibility = "hidden";
            }
        });

        session.on('signal:raiseHandSession', function(event){
            if(event.from.connectionId != session.connection.connectionId && event.data == 'open'){
                localStorage.setItem('insConnection',event.from.connectionId);
                localStorage.setItem('raiseHandSession',1);
            }else if(event.from.connectionId != session.connection.connectionId && event.data == 'closed'){
                localStorage.setItem('insConnection', event.from.connectionId);
                localStorage.setItem('raiseHandSession',0);
            }else if(event.from.connectionId == session.connection.connectionId && event.data == 'open'){
                document.getElementById('raiseHandIns').style.color = "green";
                localStorage.setItem('raiseHandSession',1);
            }else if(event.from.connectionId == session.connection.connectionId && event.data == 'closed'){
                document.getElementById('raiseHandIns').style.color = "white";
                localStorage.setItem('raiseHandSession',0);
            }
        });

        session.on('signal:switchConference',function(event){
            if(event.data.flag == 1){
                document.getElementById(localStorage.getItem('choosenMember')).style.color = "white";
                localStorage.setItem('choosenMember',event.data.memberConn);
                localStorage.setItem('isSwitch',1);
                if(event.from.connectionId == session.connection.connectionId && event.data.memberConn != session.connection.connectionId){
                    publisherSwitch = OT.initPublisher('publisherSwitch', {
                        resolution: '320x240',
                        frameRate: 7,
                        insertMode: 'replace',
                        width: '25%',
                        height: '25%',
                        disabledAudioProcessing: false
                    }, handleError);
                    session.publish(publisherSwitch);
                    session.unpublish(publisher);
                    var videoContainer = document.getElementById('videos');
                    var newPublisher = document.createElement('div');
                    newPublisher.setAttribute('id','publisher');
                    videoContainer.appendChild(newPublisher);
                    document.getElementById(event.data.memberConn).style.color = "green";
                }else if(event.from.connectionId == event.data.memberConn){
                    publisherMember = OT.initPublisher('publisherSwitch',{
                        resolution: '320x240',
                        frameRate: 7,
                        insertMode: 'replace',
                        width: '25%',
                        height: '25%',
                        disabledAudioProcessing: false
                    }, handleError);
                    session.publish(publisherMember);
                    document.getElementById('publisher').style.zIndex = -10;
                    document.getElementById(event.data.memberConn).style.color = "green";
                }else{
                    if(publisherMember != null){
                        session.unpublish(publisherMember);
                        var videoContainer = document.getElementById('videos');
                        var newPublisherSwitch = document.createElement('div');
                        newPublisherSwitch.setAttribute('id','publisherSwitch');
                        videoContainer.appendChild(newPublisherSwitch);

                    }
                    document.getElementById(event.data.memberConn).style.color = "green";
                    
                }
            }else{
                localStorage.setItem('isSwitch',0);
                localStorage.setItem('choosenMember',event.data.memberConn);
                if(event.from.connectionId == session.connection.connectionId && event.data.memberConn != session.connection.connectionId){
                    session.unpublish(publisherSwitch);
                    var videoContainer = document.getElementById('videos');
                    var newPublisherSwitch = document.createElement('div');
                    newPublisherSwitch.setAttribute('id','publisherSwitch');
                    videoContainer.appendChild(newPublisherSwitch);
                    session.unsubscribe(subscriber.stream);
                    var newSubscriber = document.createElement('div');
                    newSubscriber.setAttribute('id','subscriber');
                    videoContainer.appendChild(newSubscriber);
                    publisher = OT.initPublisher('publisher',{
                        resolution:'320x240',
                        frameRate: 7,
                        insertMode: 'replace',
                        width: '100%',
                        height: '100%',
                        disabledAudioProcessing: false
                    }, handleError);
                    session.publish(publisher);
                    document.getElementById(event.data.memberConn).style.color = "white";
                }else if(event.data.memberConn == session.connection.connectionId){
                    session.unpublish(publisherMember);
                    var videoContainer = document.getElementById('videos');
                    var newPublisherSwitch = document.createElement('div');
                    newPublisherSwitch.setAttribute('id','publisherSwitch')
                    videoContainer.appendChild(newPublisherSwitch);
                    document.getElementById(event.data.memberConn).style.color = "white";
                }else{
                    document.getElementById(event.data.memberConn).style.color = "white";
                }
            }
        });

        session.on('signal:raiseHandSessionStatus', function(event){
            localStorage.setItem('raiseHandSession', event.data);
            if(event.from.connectionId != session.connection.connectionId && event.data == 1){
                $scope.showRaiseHand = true;
            }else if(event.from.connectionId != session.connection.connectionId && event.data == 0){
                $scope.showRaiseHand = false;
            }
        });
    };

    window.setInterval(function(){
        subscriber.getStats(function(error,stats){
            
            var totalAudioPacket = stats.audio.packetsReceived + stats.audio.packetsLost;
            var totalVideoPacket = stats.video.packetsReceived + stats.video.packetsLost;
            var audioPacketLost = stats.audio.packetsLost / totalAudioPacket;
            var videoPacketLost = stats.video.packetsLost / totalVideoPacket;

            if(videoPacketLost < 0.005 && stats.video.bytesReceived > 1000000 ){
                subscriber.setPreferredResolution({width: 1280, height: 720});
                subscriber.setPreferredFrameRate(15);
            }else if(videoPacketLost < 0.005 && stats.video.bytesReceived > 600000){
                subscriber.setPreferredResolution({width: 640, height: 480});
                subscriber.setPreferredFrameRate(15);
            }else if(videoPacketLost < 0.005 && stats.video.bytesReceived > 300000){
                subscriber.setPreferredResolution({width: 320, height: 240});
                subscriber.setPreferredFrameRate(15);
            }else if(videoPacketLost < 0.03 && stats.video.bytesReceived > 350000){
                subscriber.setPreferredResolution({width: 1280, height: 720});
                subscriber.setPreferredFrameRate(7);
            }else if(videoPacketLost < 0.03 && stats.video.bytesReceived > 250000){
                subscriber.setPreferredResolution({width: 640, height: 480});
                subscriber.setPreferredFrameRate(7);
            }else{
                subscriber.setPreferredResolution({width: 320, height: 240});
                subscriber.setPreferredFrameRate(7);
            }
        });
    }, 10000);

    ctrl.raiseHandSessionStatus = function(){
        if(isInstructor == 1){
            session.signal({
                type : 'raiseHandSessionStatus',
                data : localStorage.getItem('raiseHandSession')
            }, function(error){
                if(error){
                    console.log('error blasting raise hand session status');
                }
            });
        }
    }

    var openRaiseHandFlag = 1;
    $scope.openRaiseHand = function($event){
        if($event){
            $event.preventDefault();
        }
        var dataRaiseHand;
        if(openRaiseHandFlag == 1){
            dataRaiseHand = 'open';
            openRaiseHandFlag = 0;
        }else{
            dataRaiseHand = 'closed';
            openRaiseHandFlag = 1;
        }

        session.signal({
            type:'raiseHandSession',
            data : dataRaiseHand
        }, function(error){
            if(error){
                console.log('error opening raise hand session');
            }
        });
    }

    var choosenMemberFlag = 1;
    $scope.choosenMember = function($event,connectionId){
        if($event){
            $event.preventDefault();
        }
        if(isInstructor == 1){
            session.signal({
                type:'switchConference',
                data:{
                    memberConn : connectionId,
                    flag : choosenMemberFlag
                }
            }, function(error){
                if(error){
                    console.log('error switching monitor');
                }
            });
            if(connectionId == localStorage.getItem('choosenMember')){
                if(flag == 1){
                    flag = 0;
                }else{
                    flag = 1;
                }
            }

            
        }else{
            console.log('you cannot do this');
        }
    }

    $scope.sendMessage = function($event){
        if($event){
            $event.preventDefault();
        }
        var msg = $scope.msg;
        session.signal({
            type:'msg',
            data:{
                message : msg,
                name : localStorage.getItem('name'),
                imageUrl : localStorage.getItem('propic')
            }
        }, function(error){
            if(error){
                console.log('error sending message');
            }else{
                $scope.msg = "";
            }
        });
    }

    function handleError(error) {
        if (error) {
            alert(error.message);
        }
    }

    $scope.open_content_navigation = function ($event, page) {
        $event = $event || '';
        if ($event) {
            $event.preventDefault();
        }
        var d = $q.defer();
        $scope.disabled_video_side_nav = false;
        $scope.close_all_content_navigation()
            .then(() => {
                $scope.contentNav_is_active = false;
                if (page == 1) {
                    $scope.contentNav_is_active = true;
                    $scope.profile_side_nav = true;
                }
                if (page == 2) {
                    $scope.contentNav_is_active = true;
                    $scope.chat_side_nav = true;
                }
                if (page == 3) {
                    $scope.contentNav_is_active = true;
                    $scope.share_doc_side_nav = true;
                }
                if (page == 4) {
                    $scope.share_screen_side_nav = true;
                }
                if (page == 5) {
                    $scope.ask_question_side_nav = true;
                }
                if (page == 6) {
                    $scope.disabled_video_side_nav = true;
                }
                if (page == 7) {
                    $scope.disabled_audio_side_nav = true;
                }
                if (page == 8) {
                    $scope.exit_screen_side_nav = true;
                    openModal();
                }
                if (page == 9) {
                    $scope.record_video_side_nav = true;
                }
                d.resolve(true);
            });
        return d.promise;
    };

    $scope.close_content_navigation = function ($event, page) {

        $event = $event || '';
        if ($event) {
            $event.preventDefault();
        }

        var d = $q.defer();
        $scope.contentNav_is_active = false;

        $scope.close_all_content_navigation()
            .then(() => {

                if (page == 1) {
                    $scope.profile_side_nav = false;
                }
                if (page == 2) {
                    $scope.chat_side_nav = false;
                }
                if (page == 3) {
                    $scope.share_doc_side_nav = false;
                }
                if (page == 4) {
                    $scope.share_screen_side_nav = false;
                }
                if (page == 5) {
                    $scope.ask_question_side_nav = false;
                }
                if (page == 6) {
                    $scope.disabled_video_side_nav = false;
                }
                if (page == 7) {
                    $scope.disabled_audio_side_nav = false;
                }
                if (page == 8) {
                    $scope.exit_screen_side_nav = false;
                }
                if (page == 9) {
                    $scope.record_video_side_nav = false;
                }
                d.resolve(true);
            });
        return d.promise;
    };

    $scope.close_all_content_navigation = function () {

        var d = $q.defer();
        $scope.profile_side_nav = false;
        $scope.chat_side_nav = false;
        $scope.share_doc_side_nav = false;
        $scope.exit_screen_side_nav = false;
        $scope.share_screen_side_nav = false;
        $scope.ask_question_side_nav = false;
        $scope.disabled_video_side_nav = false;
        $scope.disabled_audio_side_nav = false;
        $scope.record_video_side_nav = false;
        d.resolve(true);
        return d.promise;
    };

    var openModal = function () {
        ModalService.showModal({
            templateUrl: "app/view/shared/sidecontent/logout/logout.inc.html",
            controller: "logout_controller",
            preClose: (modal) => {
                modal.element.modal('hide');
            }
        }).then(function (modal) {
            modal.element.modal();
            modal.close.then(function (result) {
                console.log(result);
            });
        });
    };
}

app.component('conference', {
    templateUrl: 'app/components/conference/conference.html',
    controller: ConferenceController
});