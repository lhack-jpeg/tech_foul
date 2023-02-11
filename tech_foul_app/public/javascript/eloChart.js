const ctx = document.getElementById('eloChart');
let teamOneText = document.getElementById('teamOneID').innerText;
let teamTwoText = document.getElementById('teamTwoID').innerText;
let splintString = (string) => {
  let indexOfChar = string.indexOf(':');
  let newId = parseInt(string.slice(indexOfChar + 1).trim());
  return newId;
};

const teamOneId = splintString(teamOneText);
const teamTwoId = splintString(teamTwoText);
console.log('team info', teamOneId, teamTwoId);
async function postData(url = '') {
  const response = await fetch(url, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      teamOne: teamOneId,
      teamTwo: teamTwoId,
    }),
  });
  let teamData = response.json();
  return teamData;
}

let teamData = postData('http://localhost:4000/api').then((value) => {
  new Chart(ctx, {
    type: 'line',
    data: {
      datasets: [
        {
          label: 'team_one_rating',
          xAxisID: 'teamOne',
          data: value.teamOne.map((row) => ({
            x: row.inserted_at,
            y: row.rating,
          })),
          tension: 0.5,
        },
        {
          label: 'team_two_rating',
          xAxisID: 'teamTwo',
          data: value.teamTwo.map((row) => ({
            x: row.inserted_at,
            y: row.rating,
          })),
          tension: 0.5,
        },
      ],
    },
    options: {
      scales: {
        xAxis: {
          ticks: {
            soruce: 'auto',
            maxTicksLimit: 12,
          },
        },
      },
    },
  });
});
