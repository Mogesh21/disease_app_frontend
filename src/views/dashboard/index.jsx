import { Card, notification, Table } from 'antd';
import axiosInstance from 'config/axiosConfig';
import dayjs from 'dayjs';
// import LineChart from 'components/charts/LineChart';
import React, { useEffect, useState } from 'react';
import DateSelector from 'components/DateSelector';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import isoWeek from 'dayjs/plugin/isoWeek';
import isBetween from 'dayjs/plugin/isBetween';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import PieChart from '../../components/charts/PieChart';
import AreaChart from 'components/charts/LineChart/AreaChart';

dayjs.extend(weekOfYear);
dayjs.extend(isoWeek);
dayjs.extend(advancedFormat);
dayjs.extend(isBetween);

const Index = () => {
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [counts, setCounts] = useState({
    Image: 0,
    Video: 0,
    Disease: 0
  });
  const [tableLoading, setTableLoading] = useState(true);
  const [date, setDate] = useState({
    start: dayjs().startOf('month'),
    end: dayjs().endOf('month')
  });

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      sorter: (a, b) => a.id - b.id
    },
    {
      title: 'Content ID',
      dataIndex: 'content_id',
      key: 'content_id',
      sorter: (a, b) => a.id - b.id
    },
    {
      title: 'Type Name',
      dataIndex: 'type',
      key: 'type'
    },
    {
      title: 'Reason',
      dataIndex: 'reason_name',
      key: 'reason_name'
    },
    {
      title: 'Device Id',
      dataIndex: 'device_id',
      key: 'device_id'
    },
    {
      title: 'User Reason',
      dataIndex: 'reason',
      key: 'reason',
      render: (data) => <p>{data?.reason || '-'}</p>
    }
  ];

  const fetchReports = async () => {
    try {
      const response = await axiosInstance.get('/reports');
      setReports(response.data.data || []);
      setTableLoading(false);
    } catch (err) {
      notification.error({ message: 'Please reload the page' });
    }
  };

  const uniqueReportUserCount = () => {
    const user = [];
    const count = filteredReports.reduce((total, current) => {
      if (!user.includes(current.device_id)) {
        user.push(current.device_id);
        return total + 1;
      }
      return total;
    }, 0);

    return count;
  };

  const getTotalCounts = () => {
    const newCount = {
      Image: 0,
      Video: 0,
      Disease: 0
    };

    filteredReports.forEach((report) => {
      const type = report.type_id || 0;
      if (type === 1) {
        newCount.Video = newCount.Video + 1;
      } else if (type === 2) {
        newCount.Video = newCount.Image + 1;
      } else if (type === 3) {
        newCount.Video = newCount.Disease + 1;
      }
    });

    setCounts(newCount);
  };

  useEffect(() => {
    fetchReports();
    setTableLoading(false);
  }, []);

  useEffect(() => {
    const filteredReport = reports.filter((report) => {
      const start = dayjs(date.start).valueOf();
      const end = dayjs(date.end).valueOf();
      const current = dayjs(report.created_at).valueOf();
      if (current >= start && current <= end) return true;
      return false;
    });
    setFilteredReports(filteredReport);
  }, [reports, date]);

  useEffect(() => {
    getTotalCounts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredReports]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div className="filter-header">
        <p style={{ margin: 0, textAlign: 'center', alignContent: 'center' }}>Currently viewing</p>
        <DateSelector date={date} setDate={setDate} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))', gap: 10 }}>
        <Card title="Report Count" variant="borderless" style={{ minWidth: 250 }}>
          <span style={{ fontWeight: 'bold', fontSize: '1.5rem' }}>{filteredReports.length}</span>
        </Card>
        <Card title="Report User Count" variant="borderless" style={{ minWidth: 250 }}>
          <span style={{ fontWeight: 'bold', fontSize: '1.5rem' }}>{uniqueReportUserCount()}</span>
        </Card>
        <Card title="Most Reported" variant="borderless" style={{ minWidth: 250, display: 'flex', flexDirection: 'column' }}>
          <p style={{ fontWeight: 'normal', fontSize: '1.2rem' }}>
            Disease : <span style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>{counts?.Disease || 0}</span>
          </p>
          <p style={{ fontWeight: 'normal', fontSize: '1.2rem', margin: '0' }}>
            Image : <span style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>{counts?.Image || 0}</span>
          </p>
          <p style={{ fontWeight: 'normal', fontSize: '1.2rem' }}>
            Video : <span style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>{counts?.Video || 0}</span>
          </p>
        </Card>
      </div>
      {filteredReports && filteredReports.length > 0 && (
        <>
          <div className="graph-container">
            <PieChart
              data={filteredReports || []}
              title="Diseases"
              type_id={1}
              colors={['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#00BFFF', '#E91E63']}
            />
            <PieChart
              data={filteredReports || []}
              title="Images"
              type_id={2}
              colors={['#4BC0C0', '#9966FF', '#00BFFF', '#E91E63', '#FF6384', '#36A2EB', '#FFCE56']}
            />
            <PieChart
              data={filteredReports || []}
              title="Videos"
              type_id={3}
              colors={['#00BFFF', '#E91E63', '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF']}
            />
          </div>
          <AreaChart data={filteredReports} />
        </>
      )}
      <Table style={{ width: '100%', overflow: 'auto' }} columns={columns} loading={tableLoading} dataSource={reports} rowKey="id" />
    </div>
  );
};

export default Index;
