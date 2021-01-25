import React from 'react';
import PropTypes from 'prop-types';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  LabelList,
  Label,
} from 'recharts';
import { PieColor } from '../utility';
import { TYPE_INCOME, TYPE_OUTCOME } from '../constants';

const CustomPieChart = ({ title, type, categoryData }) => {
  const colorsArr =
    type === TYPE_OUTCOME
      ? Object.keys(PieColor).map((color, index) => PieColor[color])
      : Object.keys(PieColor)
          .map((color, index) => PieColor[color])
          .reverse();

  const RADIAN = Math.PI / 180;

  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
    name,
    value,
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 1.3;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="#363534"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
      >
        {`$${value}(${(percent * 100).toFixed(0)}%)`}
      </text>
    );
  };

  return (
    <div className="pie-chart-component">
      <h3 className="text-center mt-5">{title}</h3>
      <ResponsiveContainer width={'100%'} height={300}>
        <PieChart>
          <Pie
            data={categoryData}
            cx={'50%'}
            cy={'40%'}
            outerRadius={100}
            fill="#8884d8"
            labelline={true}
            label={renderCustomizedLabel}
            isAnimationActive={true}
          >
            {categoryData.map((entry, index) => (
              <Cell key={index} fill={colorsArr[index % colorsArr.length]} />
            ))}
            <LabelList dataKey={'name'} />
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

CustomPieChart.propTypes = {};

export default CustomPieChart;
