const teamOneChart = document.getElementById('eloTeamOneChart');
const teamTwoChart = document.getElementById('eloTeamTwoChart');
let teamOneText = document.getElementById('teamOneID').innerText;
let teamTwoText = document.getElementById('teamTwoID').innerText;
let splintString = (string) => {
  let indexOfChar = string.indexOf(':');
  let newId = parseInt(string.slice(indexOfChar + 1).trim());
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
    }),
  });
  let teamData = response.json();
  return teamData;
}

let teamOneData = postData('http://localhost:4000/api', teamOneId).then(
  (value) => {
    new Chart(teamOneChart, {
      type: 'line',
      data: {
        labels: value.team.map((row) => row.inserted_at),
        datasets: [
          {
            label: 'team_one_rating',
            data: value.team.map((row) => row.rating),
            tension: 0.5,
          },
        ],
      },
      options: {
        scales: {
          x: {
            type: 'time',
            ticks: {
              source: 'labels',
            },
          },
        },
        responsive: true,
        maintainAspectRatio: false,
      },
    });
  }
);

let teamTwoData = postData('http://localhost:4000/api', teamTwoId).then(
  (value) => {
    new Chart(teamTwoChart, {
      type: 'line',
      data: {
        labels: value.team.map((row) => row.inserted_at),
        datasets: [
          {
            label: 'team_one_rating',
            data: value.team.map((row) => row.rating),
            tension: 0.5,
          },
        ],
      },
      options: {
        scales: {
          x: {
            type: 'time',
            time: {
              units: 'day',
            },
            ticks: {
              source: 'labels',
            },
          },
        },
        responsive: true,
        maintainAspectRatio: false,
      },
    });
  }
);
