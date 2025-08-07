import React from 'react';
import dayjs from 'dayjs';
import Chart from 'react-apexcharts';

// eslint-disable-next-line react/prop-types
const AreaChart = ({ data }) => {
  const formattedData = Object.values(
    // eslint-disable-next-line react/prop-types
    data.reduce((acc, item) => {
      const date = dayjs(item.created_at).format('YYYY-MM-DD');
      if (!acc[date]) {
        acc[date] = { created_at: date, count: 0 };
      }
      acc[date].count += 1;
      return acc;
    }, {})
  );

  const series = [
    {
      name: 'Reports',
      data: formattedData.map((item) => ({
        x: item.created_at,
        y: item.count
      }))
    }
  ];

  const options = {
    chart: {
      type: 'area',
      zoom: { enabled: false }
    },
    dataLabels: { enabled: false },
    stroke: { curve: 'smooth' },
    xaxis: {
      type: 'category',
      title: { text: 'Date' }
    },
    yaxis: {
      title: { text: 'Report Count' }
    },
    tooltip: {
      x: {
        format: 'yyyy-MM-dd'
      }
    }
  };

  return (
    <div>
      <Chart options={options} series={series} type="area" height={350} />
    </div>
  );
};

export default AreaChart;
