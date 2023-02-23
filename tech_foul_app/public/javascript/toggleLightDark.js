document.addEventListener('DOMContentLoaded', domloaded, false);
// Script needs to be delayed and wait for the DOM to load.
function domloaded () {
  const teamOneName = document.getElementById('team-one-name').innerText;
  const teamTwoName = document.getElementById('team-two-name').innerText;
  let teamOneElo = document.getElementById('team-one-elo').innerText;
  let teamTwoElo = document.getElementById('team-two-elo').innerText;

  teamOneElo = parseInt(teamOneElo.slice(0, -1));
  teamTwoElo = parseInt(teamTwoElo.slice(0, -1));
  console.log(teamOneElo, teamTwoElo, teamOneName, teamTwoName);

  window.onload = () => {
    const toggleMode = document.getElementById('darkmode-toggle');
    const body_element = document.getElementById('body-light');
    const main_element = document.getElementById('main-light');
    // Selects all in both html files
    const textMainSwitch = document.querySelectorAll('.main-text');
    const headerMainSwitch = document.querySelectorAll('.main-header');
    const textLightSwitch = document.querySelectorAll('.light-mode-text');
    const headerLightSwitch = document.querySelectorAll('.light-mode-header');
    const chart = new CanvasJS.Chart('chartContainer', {
      backgroundColor: '#374354',
      legend: {
        verticalAlign: 'top',
        fontColor: '#666666',
        fontWeight: 'lighter'
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
        }
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
        labelFontColor: '#666666'
      },
      data: [
        {
          toolTipContent: teamOneName + '{y}%',
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
              indexLabelFontColor: '#666666'
            }
          ]
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
              indexLabelFontColor: '#666666'
            }
          ]
        }
      ]
    });
    chart.render();
    toggleMode.addEventListener('click', function () {
      console.log({ toggleMode });
      if (toggleMode.checked) {
        // When toggle is checked, dark mode is enabled
        body_element.classList.toggle('light-mode-body');
        main_element.classList.toggle('light-mode-main');
        iterateChangeElement(textMainSwitch, 'light-mode-text', 'main-text');
        iterateChangeElement(textLightSwitch, 'light-mode-text', 'main-text');
        iterateChangeElement(
          headerMainSwitch,
          'light-mode-header',
          'main-header'
        );
        iterateChangeElement(
          headerLightSwitch,
          'light-mode-header',
          'main-header'
        );
        var chart = new CanvasJS.Chart('chartContainer', {
          backgroundColor: '#374354',
          legend: {
            verticalAlign: 'top',
            fontColor: '#666666',
            fontWeight: 'lighter'
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
            }
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
            labelFontColor: '#666666'
          },
          data: [
            {
              toolTipContent: teamOneName + '{y}%',
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
                  indexLabelFontColor: '#666666'
                }
              ]
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
                  indexLabelFontColor: '#666666'
                }
              ]
            }
          ]
        });
        chart.render();
      } else {
        body_element.classList.toggle('light-mode-body');
        main_element.classList.toggle('light-mode-main');
        iterateChangeElement(textMainSwitch, 'main-text', 'light-mode-text');
        iterateChangeElement(textLightSwitch, 'main-text', 'light-mode-text');
        iterateChangeElement(
          headerMainSwitch,
          'main-header',
          'light-mode-header'
        );
        iterateChangeElement(
          headerLightSwitch,
          'main-header',
          'light-mode-header'
        );
        console.log('Unchecked');
        var chart = new CanvasJS.Chart('chartContainer', {
          backgroundColor: '#5698CE',
          legend: {
            verticalAlign: 'top',
            fontColor: '#000000',
            fontWeight: 'lighter'
          },
          axisX: {
            lineThickness: 1,
            lineColor: 'black',
            titleFontColor: '#000000',
            titleFontWeight: 'lighter',
            gridDashType: 'solid',
            gridThickness: 0.25,
            gridColor: '#000000',
            interval: 1,
            tickLength: 0,
            labelFormatter: function (e) {
              return '';
            }
          },
          axisY: {
            includeZero: true,
            lineThickness: 1,
            lineColor: 'black',
            gridThickness: 0.25,
            gridColor: '#000000',
            title: '%',
            titleColor: '#000000',
            tickLength: 10,
            titleFontColor: '#000000',
            titleFontWeight: 'lighter',
            margin: 10,
            titleFontWeight: 'bold',
            labelFormatter: function (e) {
              return e.value;
            },
            gridDashType: 'solid',
            interval: 10,
            labelAngle: 30,
            labelFontColor: '#000000'
          },
          data: [
            {
              toolTipContent: teamOneName + '{y}%',
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
                  indexLabelFontColor: '#000000'
                }
              ]
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
                  indexLabelFontColor: '#000000'
                }
              ]
            }
          ]
        });
        chart.render();
      }
    });
  };
}

/*
 * @iterateChangeElement - Takes an array of Html objects and iterates throgh them with
 * a callback function
 * @listofHtmlElemet - Array of htmlObjects
 * @classNameOne - Class name to check if exist on object and pass through to call back
 * @classNameTwo - Class name to add to html object
 */
const iterateChangeElement = (
  listOfHtmlElement,
  classNameOne,
  classNameTwo
) => {
  listOfHtmlElement.forEach((htmlElement) => {
    addRemoveClassName(htmlElement, classNameOne, classNameTwo);
  });
};

/*
 * addRemoveClassName
 * @htmlElement - Element that is checked
 * @classNameOne - Class name to check if it exists on the Element and remove if true
 * @classNameTwo - Class name to add to element
 */
function addRemoveClassName (htmlElement, classNameOne, classNameTwo) {
  if (htmlElement.classList.contains(classNameOne)) {
    htmlElement.classList.remove(classNameOne);
    htmlElement.classList.add(classNameTwo);
  }
}
