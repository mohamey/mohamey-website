$(document).ready(function () {
    allData = []
    $.getJSON("../resources/data.json", function(storyData) {
        // Graph scripts here
        allData = storyData
        console.log(allData)
        var graphData = [{
            data: [],
            color: '#71c73e',
            curvedLines: {
                apply: true,
                monotonicFit: true
            }
        }]
        storyData.forEach(function (entry) {
            console.log(entry)
            // var obj = JSON.parse(entry)
            graphData[0]["data"].push([new Date(entry["date"]), entry["score"]])
        })
        // console.log(allData)
        //   var graphData = [{
        //     // Experience
        //     data: [[new Date("2017/06/01").getTime(), 6], [new Date("2017/06/02").getTime(), 8], [new Date("2017/06/05").getTime(), 4] ],
        //     color: '#71c73e'
        //     }
        // ];
        // Lines
        var options = {
            series: {
                curvedLines: {
                    active: true
                }
            }
        }
        $.plot($('#graph-lines'), graphData, {
            series: {
                points: {
                    show: true,
                    radius: 5
                },
                lines: {
                    show: true
                },
                shadowSize: 0,
                curvedLines: {
                    apply: true,
                    active: true,
                    monotonicFit: true
                }
            },
            grid: {
                color: '#646464',
                borderColor: 'transparent',
                borderWidth: 20,
                hoverable: true,
                clickable: true
            },
            xaxis: {
                tickColor: 'transparent',
                mode: "time",
                timeformat: "%d/%b",
                margin: 10
            },
            yaxis: {
                tickSize: 1
            }
        });

        // Bars
        $.plot($('#graph-bars'), graphData, {
            series: {
                bars: {
                    show: true,
                    barWidth: .9,
                    align: 'center'
                },
                shadowSize: 0,
                curvedLines: {
                    apply: true,
                    active: true,
                    monotonicFit: true
                }
            },
            grid: {
                color: '#646464',
                borderColor: 'transparent',
                borderWidth: 20,
                hoverable: true,
                clickable: true
            },
            xaxis: {
                tickColor: 'transparent',
                tickDecimals: 2
            },
            yaxis: {
                tickSize: 1000
            }
        });

        function showTooltip(x, y, contents) {
            $('<div id="tooltip">' + contents + '</div>').css({
                top: y - 16,
                left: x + 20
            }).appendTo('body').fadeIn();
        }

        var previousPoint = null;

        $('#graph-lines').bind('plothover', function (event, pos, item) {
            if (item) {
                if (previousPoint != item.dataIndex) {
                    previousPoint = item.dataIndex;
                    $('#tooltip').remove();
                    var x = item.datapoint[0],
                        y = item.datapoint[1];
                        showTooltip(item.pageX, item.pageY, y + ' visitors at ' + x + '.00h');
                }
            } else {
                $('#tooltip').remove();
                previousPoint = null;
            }
        });

        // $("#graph-lines").bind("plotclick", function (event, pos, item) {
        //     if (item) {
        //         console.log(item)
        //         alert(item.series.label)
        //     }
        // })
        $('#graph-lines').bind('plotclick', function (event, pos, item) {
            console.log(allData)
            if (item) {
                var x = item.datapoint[0],
                    y = item.datapoint[1];
                var res;
                for(var i=0; i < allData.length; i++) {
                    tmpDate = new Date(allData[i]['date']).getTime()
                    console.log(tmpDate)
                    console.log(x)
                    if (tmpDate == x){
                        // Change article contents
                        document.getElementById('story-title').innerHTML = allData[i]['story-title']
                        document.getElementById('story-date').innerHTML = allData[i]['date']
                        document.getElementById('story-author').innerHTML = allData[i]['story-author']
                        document.getElementById('story-image').src = allData[i]['story-img']
                        document.getElementById('story-content').innerHTML = allData[i]['story-content']
                        break
                    }
                }
                console.log("Clicked!")
                console.log(res)
            }
        })

        $('#graph-bars').hide();

        $('#lines').on('click', function (e) {
            $('#bars').removeClass('active');
            $('#graph-bars').fadeOut();
            $(this).addClass('active');
            $('#graph-lines').fadeIn();
            e.preventDefault();
        });

        $('#bars').on('click', function (e) {
            $('#lines').removeClass('active');
            $('#graph-lines').fadeOut();
            $(this).addClass('active');
            $('#graph-bars').fadeIn().removeClass('hidden');
            e.preventDefault();
        });
    })
});
