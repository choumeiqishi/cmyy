angular.module('cmyy.controllers', [])

.controller('ListController', function($scope, account) {
    console.log('show account list');

    var total = 0;
    $scope.items = [];

    account.getAllItems().then(function(items) {
        $scope.items = items;
        console.log($scope.items);

        for (var i=0; i<items.length; i++) {
            if (items[i].isIncome) {
                total += items[i].value;
            } else {
                total -= items[i].value;
            }
        }
        console.log(total);

        var listTitle = document.getElementById('listTitle');

        if (total > 0) {
            $scope.title = '小有结余: ';
            $scope.total = total;
            listTitle.style.color = '#00bf00';
        } else if (total < 0) {
            $scope.title = '入不敷出: ';
            $scope.total = Math.abs(total);
            listTitle.style.color = '#ff0000';
        } else {
            $scope.title = '收支平衡';
            $scope.total = '';
        }
    });
})

.controller('CreationController', function($scope, account) {
    console.log('begin to create');

    // const
    var SUB_TYPE_INCOME = [
        {label: '工资', value: 1},
        {label: '兼职', value: 2},
        {label: '馈赠', value: 3},
        {label: '理财', value: 4},
        {label: '其它', value: 5}
    ];
    var SUB_TYPE_EXPENSE = [
        {label: '住宅', value: 1},
        {label: '交通', value: 2},
        {label: '食品', value: 3},
        {label: '礼品', value: 4},
        {label: '通讯', value: 5},
        {label: '育儿', value: 6},
        {label: '个护', value: 7},
        {label: '衣服', value: 8},
        {label: '保险', value: 9},
        {label: '交际', value: 10},
        {label: '其它', value: 11}
    ];

    $scope.subtypes = SUB_TYPE_EXPENSE;

    function initSubType(isIncome) {
        if (isIncome) {
            $scope.subtypes = SUB_TYPE_INCOME;
        } else {
            $scope.subtypes = SUB_TYPE_EXPENSE;
        }
    }

    // default value
    $scope.item = {
        date: new Date(),
        isIncome: false,
        subtype: 1,
        title: ''
    };

    $scope.changeType = function() {
        console.log($scope.item.isIncome);
        initSubType($scope.item.isIncome);
    };
    
    $scope.addItem = function(){
        console.log($scope.item);
        account.addItem($scope.item);
    };


})
.directive('convertToNumber', function() {
    return {
        require: 'ngModel',
        link: function(scope, element, attrs, ngModel) {
            ngModel.$parsers.push(function(val) {
                return parseInt(val, 10);
            });
            ngModel.$formatters.push(function(val) {
                return '' + val;
            });
        }
    };
})

.controller('StatisticsController', function($scope, account) {
    console.log('show statistics');

    

    drawStatsPie();
});

function drawStatsPie() {
    console.log('draw pie chart...');
    require.config({
        paths: {
            echarts: '/lib/echarts'
        }
    });

    require(
        [
            'echarts',
            'echarts/chart/pie'
        ],
        function (ec) {
            var myChart = ec.init(document.getElementById('statPieContainer'));
            myChart.setOption({
                // title : {
                //     text: '收入支出统计',
                //     subtext: '(2015/08/01 - 2015/08/31)',
                //     x: 'center',
                //     y: 20,
                //     textStyle: {fontSize: 14}
                // },
                tooltip : {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },

                // legend: {
                //     orient : 'horizontal',
                //     x : 'center',
                //     y : 'bottom',
                //     padding: [0, 10, 0, 10],
                //     data:['直达','营销广告','搜索引擎','邮件营销','联盟广告','视频广告','百度','谷歌','必应','其他']
                // },
                //calculable : false,
                //animation: false,
                series : [
                    {
                        name:'收入',
                        type:'pie',
                        selectedMode: 'single',
                        radius : [0, 60],
                        
                        // for funnel
                        x: '20%',
                        width: '40%',
                        funnelAlign: 'right',
                        max: 1548,
                        
                        itemStyle : {
                            normal : {
                                label : {
                                    textStyle: {color: '#000000'},
                                    position : 'inner',
                                },
                                labelLine : {
                                    show : false
                                }
                            }
                        },
                        data:[
                            {value:9000, name:'工资'},
                            {value:500, name:'馈赠'}
                        ]
                    },
                    {
                        name:'支出',
                        type:'pie',
                        radius : [90, 120],
                        
                        // for funnel
                        x: '60%',
                        width: '35%',
                        funnelAlign: 'left',
                        max: 1048,
                        itemStyle : {
                            normal : {
                                label : {
                                    textStyle: {color: '#000000'},
                                    position : 'inner'
                                },
                                labelLine : {
                                    show : false
                                }
                            }
                        },
                        data:[
                            {value:5000, name:'房屋'},
                            {value:600, name:'交通'},
                            {value:100, name:'食品'},
                            {value:150, name:'个护'},
                            {value:200, name:'衣服'}
                        ]
                    }
                ]
            });
        }
    );
}