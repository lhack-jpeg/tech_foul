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
async function postData(url = '', teamID) {
  const response = await fetch(url, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      team: teamID,
      teamTwo: teamTwoID,
    }),
  });
  const teamData = response.json();
  return teamData;
}

(async function () {
  const teamOneData = await postData('http://localhost:4000/api', teamOneId);
  let teamOneChart = new Chart(ctxOne, {
    type: 'line',
    data: {
      datasets: [
        {
          label: teamOneName,
          data: teamOneData.team.map((row) => ({
            x: row.inserted_at,
            y: row.rating,
          })),
          borderColor: '#009ef2',
          tension: 0.5,
        },
      ],
    },
    options: {
      plugins: {
        legend: {
          labels: { color: 'white', size: 18 },
        },
      },
      scales: {
        x: {
          scaleLabel: {
            display: true,
            labelString: 'Date',
          },
          ticks: {
            color: 'white',
          },
        },
        y: {
          beginAtZero: false,
          ticks: {
            color: 'white',
          },
        },
      },
    },
  });
  toggleMode.addEventListener('click', function () {
    if (toggleMode.checked) {
      teamOneChart.data.datasets[0].borderColor = '#009ef2';
      teamOneChart.update();
    } else {
      teamOneChart.data.datasets[0].borderColor = '#0cf79b';
      teamOneChart.update();
    }
  });
})();

(async function () {
  const teamTwoData = await postData('http://localhost:4000/api', teamTwoId);
  let teamTwoChart = new Chart(ctxTwo, {
    type: 'line',
    data: {
      datasets: [
        {
          label: teamTwoName,
          data: teamTwoData.team.map((row) => ({
            x: row.inserted_at,
            y: row.rating,
          })),
          tension: 0.5,
          borderColor: '#fc4c7c',
          color: 'white',
        },
      ],
    },
    options: {
      plugins: {
        legend: {
          labels: { color: 'white', size: 18 },
        },
      },
      scales: {
        x: {
          scaleLabel: {
            display: true,
            labelString: 'Date',
          },
          ticks: {
            color: 'white',
          },
        },
        y: {
          beginAtZero: false,
          ticks: {
            color: 'white',
          },
        },
      },
    },
  });
})();
