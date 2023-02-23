document.addEventListener('DOMContentLoaded', domloaded, false);
// Script needs to be delayed and wait for the DOM to load.
function domloaded() {
  const teamOneName = document.getElementById('team-one-name').innerText;
  const teamTwoName = document.getElementById('team-two-name').innerText;
  let teamOneElo = document.getElementById('team-one-elo').innerText;
  let teamTwoElo = document.getElementById('team-two-elo').innerText;

  teamOneElo = parseInt(teamOneElo.slice(0, -1));
  teamTwoElo = parseInt(teamTwoElo.slice(0, -1));
  console.log(teamOneElo, teamTwoElo, teamOneName, teamTwoName);

  // Once loaded it generates the Chart
  window.onload = function () {
    var chart = new CanvasJS.Chart('chartContainer', {
      backgroundColor: '#374354',
      legend: {
        verticalAlign: 'top',
        fontColor: '#666666',
        fontWeight: 'lighter',
      },
      axisX: {
        lineThickness: 1,
        titleFontColor: '#666666',
        titleFontWeight: 'lighter',
        gridDashType: 'solid',
        gridThickness: 0.25,
        gridColor: 'black',
        interval: 1,
        tickLength: 0,
        labelFormatter: function (e) {
          return '';
        },
      },
      axisY: {
        includeZero: true,
        lineThickness: 1,
        gridThickness: 0.25,
        gridColor: 'black',
        title: '%',
        titleColor: '#666666',
        tickLength: 10,
        titleFontColor: '#666666',
        titleFontWeight: 'lighter',
        margin: 10,
        titleFontWeight: 'bold',
        labelFormatter: function (e) {
          return e.value;
        },
        gridDashType: 'solid',
        interval: 10,
        labelAngle: 30,
        labelFontColor: '#666666',
      },
      data: [
        {
          toolTipContent: teamOneName + '{y}',
          type: 'stackedBar100',
          name: teamOneName,
          showInLegend: true,
          legendMarkerColor: '#1b70a4',
          legendMarkerBorderColor: '#009ef2',
          legendMarkerBorderThickness: 2,
          bevelEnabled: true,
          color: '#009ef2',
          dataPoints: [
            {
              y: teamOneElo,
              indexLabel: teamOneName,
              indexLabelFontWeight: 'bold',
              indexLabelFontColor: '#666666',
            },
          ],
        },
        {
          toolTipContent: teamTwoName + '{y}%',
          type: 'stackedBar100',
          name: teamTwoName,
          showInLegend: true,
          legendMarkerColor: '#A44869',
          legendMarkerBorderColor: '#FC4C7C',
          legendMarkerBorderThickness: 2,
          bevelEnabled: true,
          color: '#FC4C7C',
          dataPoints: [
            {
              y: teamTwoElo,
              indexLabel: teamTwoName,
              indexLabelFontWeight: 'bold',
              indexLabelFontColor: '#666666',
            },
          ],
        },
      ],
    });
    chart.render();
  };
}
