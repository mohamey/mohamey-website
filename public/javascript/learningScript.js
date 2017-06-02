$(document).ready(function () {
    // Graph scripts here
    var graphData = [{
      // Experience
      data: [[new Date("2017/06/01").getTime(), 6], [new Date("2017/06/02").getTime(), 8], [new Date("2017/06/05").getTime(), 4] ],
      color: '#71c73e'
      }
  ];
  // Lines
  $.plot($('#graph-lines'), graphData, {
      series: {
          points: {
              show: true,
              radius: 5
          },
          lines: {
              show: true
          },
          shadowSize: 0
      },
      grid: {
          color: '#646464',
          borderColor: 'transparent',
          borderWidth: 20,
          hoverable: true
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
          shadowSize: 0
      },
      grid: {
          color: '#646464',
          borderColor: 'transparent',
          borderWidth: 20,
          hoverable: true
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

  $('#graph-lines, #graph-bars').bind('plothover', function (event, pos, item) {
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
});
