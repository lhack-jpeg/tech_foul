const ctxOne = document.getElementById('eloChartTeamOne');
const ctxTwo = document.getElementById('eloChartTeamTwo');
const teamOneText = document.getElementById('teamOneID').innerText;
const teamOneName = document.getElementById('team-one-name').innerText;
const teamTwoName = document.getElementById('team-two-name').innerText;
const teamTwoText = document.getElementById('teamTwoID').innerText;
const toggleMode = document.getElementById('darkmode-toggle');
const splintString = (string) => {
  const indexOfChar = string.indexOf(':');
  const newId = parseInt(string.slice(indexOfChar + 1).trim());
  return newId;
};

const teamOneId = splintString(teamOneText);
const teamTwoId = splintString(teamTwoText);
// console.log('team info', teamOneId, teamTwoId);
async function postData (url = '', teamID) {
  const response = await fetch(url, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      team: teamID,
      teamTwo: teamTwoID
    })
  });
  const teamData = response.json();
  return teamData;
}

(async function () {
  const teamOneData = await postData('http://localhost:4000/api', teamOneId);
  const teamOneChart = new Chart(ctxOne, {
    type: teamOneData.type,
    data: {
      datasets: [
        {
          label: teamOneName,
          data: teamOneData.team.map((row) => ({
            x: row.inserted_at,
            y: row.rating
          })),
          backgroundColor: '#009ef2',
          borderColor: '#009ef2',
          tension: 0.5
        }
      ]
    },
    options: {
      plugins: {
        legend: {
          labels: { color: 'white', size: 18 }
        }
      },
      scales: {
        x: {
          grid: {
            color: '#202020'
          },
          gridLines: {
            zeroLineColor: 'white'
          },
          scaleLabel: {
            display: true,
            labelString: 'Date'
          },
          ticks: {
            color: 'white'
          }
        },
        y: {
          grid: {
            color: '#202020'
          },
          beginAtZero: false,
          ticks: {
            color: 'white'
          }
        }
      }
    }
  });
  toggleMode.addEventListener('click', function () {
    if (toggleMode.checked) {
      teamOneChart.data.datasets[0].borderColor = '#009ef2';
      teamOneChart.data.datasets[0].backgroundColor = '#009ef2';
      teamOneChart.options.plugins.legend.labels.color = 'white';
      teamOneChart.options.scales.x.ticks.color = 'white';
      teamOneChart.options.scales.y.ticks.color = 'white';
      teamOneChart.options.scales.x.grid.color = '#202020';
      teamOneChart.options.scales.y.grid.color = '#202020';
      teamOneChart.update();
    } else {
      teamOneChart.data.datasets[0].borderColor = '#0cf79b';
      teamOneChart.data.datasets[0].backgroundColor = '#0cf79b';
      teamOneChart.options.plugins.legend.labels.color = 'black';
      teamOneChart.options.scales.x.ticks.color = 'black';
      teamOneChart.options.scales.y.ticks.color = 'black';
      teamOneChart.options.scales.x.grid.color = '#005A94';
      teamOneChart.options.scales.y.grid.color = '#005A94';
      teamOneChart.update();
    }
  });
})();

(async function () {
  const teamTwoData = await postData('http://localhost:4000/api', teamTwoId);
  const teamTwoChart = new Chart(ctxTwo, {
    type: teamTwoData.type,
    data: {
      datasets: [
        {
          label: teamTwoName,
          data: teamTwoData.team.map((row) => ({
            x: row.inserted_at,
            y: row.rating
          })),
          tension: 0.5,
          backgroundColor: '#fc4c7c',
          borderColor: '#fc4c7c',
          color: 'white'
        }
      ]
    },
    options: {
      plugins: {
        legend: {
          labels: { color: 'white', size: 18 }
        }
      },
      scales: {
        x: {
          grid: {
            color: '#202020'
          },
          scaleLabel: {
            display: true,
            labelString: 'Date'
          },
          ticks: {
            color: 'white'
          }
        },
        y: {
          grid: {
            color: '#202020'
          },
          beginAtZero: false,
          ticks: {
            color: 'white'
          }
        }
      }
    }
  });
  toggleMode.addEventListener('click', function () {
    if (toggleMode.checked) {
      teamTwoChart.data.datasets[0].borderColor = '#fc4c7c';
      teamTwoChart.data.datasets[0].backgroundColor = '#fc4c7c';
      teamTwoChart.options.plugins.legend.labels.color = 'white';
      teamTwoChart.options.scales.x.ticks.color = 'white';
      teamTwoChart.options.scales.y.ticks.color = 'white';
      teamTwoChart.options.scales.x.grid.color = '#202020';
      teamTwoChart.options.scales.y.grid.color = '#202020';
      teamTwoChart.update();
    } else {
      teamTwoChart.data.datasets[0].borderColor = '#fc0347';
      teamTwoChart.data.datasets[0].backgroundColor = '#fc0347';
      teamTwoChart.options.plugins.legend.labels.color = 'black';
      teamTwoChart.options.scales.x.ticks.color = 'black';
      teamTwoChart.options.scales.y.ticks.color = 'black';
      teamTwoChart.options.scales.x.grid.color = '#005A94';
      teamTwoChart.options.scales.y.grid.color = '#005A94';
      teamTwoChart.update();
    }
  });
})();
