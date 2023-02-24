const ctxOne = document.getElementById('eloChartTeamOne');
const ctxTwo = document.getElementById('eloChartTeamTwo');
const teamOneText = document.getElementById('teamOneID').innerText;
const teamOneName = document.getElementById('team-one-name').innerText;
const teamTwoName = document.getElementById('team-two-name').innerText;
const teamTwoText = document.getElementById('teamTwoID').innerText;
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

const teamOneData = postData('http://localhost:4000/api', teamOneId).then(
  (value) => {
    new Chart(ctxOne, {
      type: 'line',
      data: {
        datasets: [
          {
            label: teamOneName,
            data: value.team.map((row) => ({
              x: row.inserted_at,
              y: row.rating,
            })),
            tension: 0.5,
          },
        ],
      },
      options: {
        scales: {
          x: {
            scaleLabel: {
              display: true,
              labelString: 'Date',
            },
          },
          y: {
            beginAtZero: false,
          },
        },
      },
    });
  }
);

const teamTwoData = postData('http://localhost:4000/api', teamTwoId).then(
  (value) => {
    new Chart(ctxTwo, {
      type: 'line',
      data: {
        datasets: [
          {
            label: teamTwoName,
            data: value.team.map((row) => ({
              x: row.inserted_at,
              y: row.rating,
            })),
            borderColor: '#fc4c7c',
            tension: 0.5,
            fill: {
              display: true,
              target: 'origin',
              below: '#fc4c7c',
            },
          },
        ],
      },
      options: {
        scales: {
          x: {
            ticks: {
              source: 'labels',
            },
          },
          y: {
            beginAtZero: false,
          },
        },
      },
    });
  }
);
