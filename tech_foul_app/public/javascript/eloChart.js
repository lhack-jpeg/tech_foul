const ctx = document.getElementById('eloChart');

new Chart(ctx, {
  type: 'bar',
  data: {
    labels: ['test'],
    datasets: [
      {
        label: 'rating',
        data: data.map((row) => row.rating),
        borderWidth: 1,
      },
    ],
  },
  options: {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  },
});
