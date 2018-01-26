function HistoryDetailMember($scope, NgTableParams, historyMemberService){
    var ctrl = this;
    console.log(historyMemberService.getMemberList());
    // var memberList = ctrl.onupdate();
    console.log(ctrl.onupdate);
    // console.log(memberList);
    $scope.memberTable = new NgTableParams({ count: 3 },{dataset :memberList});
}

app.component('historydetailmember',{
    templateUrl:'app/components/historyDetail/historyDetailMember.html',
    controller: HistoryDetailMember,
    bindings: {
        roommember: '=',
        onupdate: '='
    }
});