import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';

// eslint-disable-next-line react/prop-types
const Index = ({ data, type_id, colors, title }) => {
  const [chartData, setChartData] = useState({
    options: {},
    series: []
  });

  useEffect(() => {
    // Filter and group data
    const grouped = {};
    // eslint-disable-next-line react/prop-types
    const filtered = data?.filter((item) => item.type_id === type_id) || [];

    filtered.forEach((item) => {
      const content_id = item.content_id || 'Unknown';
      grouped[content_id] = (grouped[content_id] || 0) + 1;
    });

    const labels = Object.keys(grouped);
    const series = Object.values(grouped);

    // Update chart state
    setChartData({
      series,
      options: {
        chart: {
          type: 'donut',
          animations: {
            enabled: true,
            easing: 'easeinout',
            speed: 300
          }
        },
        plotOptions: {
          pie: {
            donut: {
              labels: {
                show: true,
                total: {
                  show: true,
                  label: title,
                  fontSize: '18px',
                  color: '#333',
                  formatter: () => ''
                }
              }
            },
            expandOnClick: false
          }
        },
        labels,
        colors,
        legend: {
          position: 'bottom'
        }
      }
    });
  }, [data, type_id, colors, title]);

  if (chartData.series.length === 0) return null;

  return (
    <div hidden={chartData.series.length === 0} style={{ maxHeight: '30rem' }}>
      <p style={{ width: '100%', textAlign: 'center', fontWeight: 'bold' }}>Report On {title}</p>
      <ReactApexChart
        key={`${type_id}-${chartData.series.join('-')}`}
        options={chartData.options}
        series={chartData.series}
        type="donut"
        width="300"
        height="300"
      />
    </div>
  );
};

export default Index;
