import React from 'react';

import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid,ResponsiveContainer } from 'recharts';
// const data = [{id: 1, rowd_date: '01/01/2023', bu: 'c47', quantity: 2400},
// {id: 2, rowd_date: '01/01/2023', bu: 'c51', quantity: 2500},
// {id: 3, rowd_date: '02/01/2023', bu: 'c47', quantity: 500},
// {id: 4, rowd_date: '02/01/2023', bu: 'c51', quantity: 1400},
// {id: 5, rowd_date: '03/01/2023', bu: 'c47', quantity: 200},
// {id: 6, rowd_date: '03/01/2023', bu: 'c51', quantity: 400},
// {id: 7, rowd_date: '04/01/2023', bu: 'c47', quantity: 900},
// {id: 8, rowd_date: '04/01/2023', bu: 'c51', quantity: 600},
// {id: 9, rowd_date: '05/01/2023', bu: 'c47', quantity: 1000},
// {id: 10, rowd_date: '05/01/2023', bu: 'c51', quantity: 1200},
// {id: 11, rowd_date: '06/01/2023', bu: 'c47', quantity: 1300},
// {id: 12, rowd_date: '06/01/2023', bu: 'c51', quantity: 1500},
// {id: 13, rowd_date: '07/01/2023', bu: 'c47', quantity: 1600},
// {id: 14, rowd_date: '07/01/2023', bu: 'c51', quantity: 1700}
// ];


export default function BarChartDisplay({ data, bu }) {
  const barColor = bu === 'c47' ? '#8884d8' : '#82ca9d';
console.log(data)
  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, bottom: 20, left: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="process_date" angle={-45} textAnchor="end" height={60} />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey={bu} fill={barColor} name={bu.toUpperCase()} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
