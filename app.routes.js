app.config(function ($routeProvider) {
	$routeProvider
    
		.when('/',{
			template: "<signin></signin>"
		})

		.when('/archives',{
			template: "<archives></archives>",
			activetab: 'archives'
		})

		.when('/createroom',{
			template: "<createroom></createroom>",
			activetab: 'createroom'
		})

		.when('/conference',{
			template: "<conference></conference>",
			activetab: 'conference'
		})

		.when('/evaluation',{
			template: "<evaluation></evaluation>",
			activetab: 'evaluation'
		})

		.when('/evaluationdetail',{
			template: "<evaluationdetail></evaluationdetail>",
			activetab: 'evalution'
		})

		.when('/history',{
			template: "<history></history>",
			activetab: 'history'
		})

		.when('/historydetail',{
			template: "<historydetail></historydetail>",
			activetab: 'history'
		})

		.when('/joinroom',{
			template: "<joinroom></joinroom>",
			activetab: 'joinRoom'
		})

		.when('/profile',{
			template: "<profile></profile>",
			activetab: 'profile'
		})

		.when('/statistic',{
			template: "<statistic></statistic>",
			activetab: 'statistic'
		})
		
		.otherwise({
			redirectTo: '/'
		})

});