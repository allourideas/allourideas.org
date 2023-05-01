document.addEventListener("DOMContentLoaded", function () {
  const chartDataElement = document.getElementById("chart-data");
  const chartData = JSON.parse(chartDataElement.dataset.chartData);
  const type = chartDataElement.dataset.type;
  const choiceUrlTemplate = chartDataElement.dataset.choiceUrlTemplate;

  const ctx = document
    .getElementById(`${type}-chart-container`)
    .getContext("2d");
  const votesChart = new Chart(ctx, {
    type: "scatter",
    data: {
      datasets: [
        {
          label: type.replace("_", " ").charAt(0).toUpperCase() + type.slice(1),
          data: chartData.map((point) => ({
            x: point.x,
            y: point.y,
            name: point.name,
          })),
          backgroundColor: "rgba(49, 152, 193, 0.5)",
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        x: {
          type: "linear",
          title: {
            display: true,
            text: "Non Uniform Date Intervals",
          },
        },
        y: {
          type: "linear",
          min: 0,
          title: {
            display: true,
            text: "Number of ratings",
          },
        },
      },
      plugins: {
        tooltip: {
          callbacks: {
            label: function (context) {
              const splitResult = context.raw.name.split("@@@");
              const name = splitResult[0];
              const id = splitResult[1];
              const created = splitResult[2];
              return `<b>${name}</b>: ${context.raw.y} ratings <br /> Created: ${created}`;
            },
          },
        },
        legend: {
          display: false,
        },
      },
      onClick: function (event, elements) {
        if (elements.length > 0) {
          const element = elements[0];
          const splitResult = element.element.$context.raw.name.split("@@@");
          const id = splitResult[1];
          const theUrl = choiceUrlTemplate.replace("fakeid", id);
          location.href = theUrl;
        }
      },
    },
  });
});
