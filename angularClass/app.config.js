// {
//     id:'0-0',
//     type:'home',
//     templateUrl: 'page/home/home.html',
//     parentId:''
// },
(function(angular){
    angular.module('myApp').constant('routerCollections',[{
            id:'0-1',
            type:'home',
            title:'机构详情',
            params:['companyId'],
            templateUrl: 'page/home/institutionDetail/institutionDetail.html',
            parentId:''
        },{
            id:'0-2',
            type:'home',
            title:'培训需求',
            templateUrl: 'page/home/demandTrainList/demandTrainList.html',
            parentId:''
        },{
            id:'0-3',
            type:'home',
            title:'课程列表',
            templateUrl: 'page/home/courseList/courseList.html',
            parentId:''
        },{
            id:'0-4',
            type:'home',
            title:'课程详情',
            params:['courseId'],
            templateUrl: 'page/home/courseDetail/courseDetail.html',
            parentId:''
        },{
            id:'1-0',
            type:'company',
            title:'发布需求',
            templateUrl: 'page/company/releaseRequirement/releaseRequirement.html',
            parentId:''
        },{
            id:'1-1',
            type:'company',
            title:'我的课程',
            templateUrl: 'page/company/paidCourses/paidCourses.html',
            parentId:''
        },{
            id:'1-2',
            type:'company',
            title:'已发布课程',
            templateUrl: 'page/company/demandList/demandList.html',
            parentId:''
        },{
            id:'1-3',
            type:'company',
            title:'机构信息',
            templateUrl: 'page/company/companyInfo/companyInfo.html',
            parentId:''
        },{
            id:'2-0',
            type:'crew',
            title:'我的课程',
            templateUrl: 'page/crew/crewPaidCourses/crewPaidCourses.html',
            parentId:''
        },{
            id:'2-1',
            type:'crew',
            title:'个人简历',
            templateUrl: 'page/crew/resume/resume.html',
            parentId:''
        },{
            id:'2-2',
            type:'crew',
            title:'待支付课程',
            templateUrl: 'page/crew/unpaidCourses/unpaidCourses.html',
            parentId:''
        },{
            id:'3-0',
            type:'hsj',
            title:'通知公告列表',
            templateUrl: 'page/hsj/hsj.notice-list/noticeList.html',
            parentId:''
        },{
            id:'3-1',
            type:'hsj',
            title:'发送通知公告',
            params:['id'],
            templateUrl: 'page/hsj/hsj.notice-notice/noticeNotice.html',
            parentId:''
        },{
            id:'4-0',
            type:'institution',
            title:'机构简介',
            templateUrl: 'page/institution/institutionInfo/institutionInfo.html',
            parentId:''
        },{
            id:'4-1',
            type:'institution',
            title:'已接收培训需求',
            templateUrl: 'page/institution/receiveRequirement/receiveRequirement.html',
            parentId:''
        },{
            id:'4-2',
            type:'institution',
            title:'发布课程',
            templateUrl: 'page/institution/releaseCourse/releaseCourse.html',
            parentId:''
        },{
            id:'4-3',
            type:'institution',
            title:'已发布课程',
            templateUrl: 'page/institution/releasedCourseList/releasedCourseList.html',
            parentId:''
        },{
            id:'4-4',
            type:'institution',
            title:'师资力量',
            templateUrl: 'page/institution/teacherStrength/teacherStrength.html',
            parentId:''
        },{
            id:'5-0',
            type:'preHome',
            stateName:'preHome',
            title:'首页',
            templateUrl: 'page/preHome/preHome.html',
            parentId:''
        },{
            id:'5-1',
            type:'preHome',
            stateName:'preHome.courseList',
            title:'首页',
            templateUrl: 'page/preHome/courseList/courseList.html',
            parentId:''
        }
                
    ])
    .constant('enableRouters',{
        common:{
            menus:['5-0','5-1']
        },
        hsjData:{
            power:[2],
            menus:['0-3'],
            type:'hsj'
        },
        institutionData:{
            power:[6],
            menus:['0-3','0-2','4-0','4-2','4-3','4-4'],
            // type:'institution'
        },
        companyData:{
            power:[1,5,{
                'admin':[0]
            }],
            menus:['0-3'],
            type:'company'
        },
        crewData:{
            power:[0,4],
            menus:['0-3','2-0'],
            // type:'crew',
        }
    });
})(angular);