import React from 'react'
import PropTypes from 'prop-types'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, LabelList,Label  } from 'recharts';
import { PieColor } from '../utility';
import { TYPE_INCOME, TYPE_OUTCOME} from '../constants';

const CustomPieChart = ({ title, type, categoryData }) => {

  const colorsArr = type === TYPE_OUTCOME ?
    Object.keys(PieColor).map((color,index) =>PieColor[color]) :
    Object.keys(PieColor).map((color,index) =>PieColor[color]).reverse();

  const RADIAN = Math.PI / 180;

  const renderCustomizedLabel = ({
    cx, cy, midAngle, innerRadius, outerRadius, percent, index, name,value
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 1.3;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    
    return (
      <text x={x} y={y} fill="#363534" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
        {`$${value}(${(percent * 100).toFixed(0)}%)`}
      </text>
    );
  };

  const renderCustomizedLabel1 = (props) => {
    const {
      x, y, width, height, value, percent, name
    } = props;
    const radius = 10;
  
    return (  
        // <text x={x + width / 2} y={y - radius} fill="#fff" textAnchor="middle" dominantBaseline="middle">
        //   {'30%'}
        // </text>
        // <div>
        //   30趴
        // </div>
        <text 
            x={x} 
            y={y}
            dy={18}
            textAnchor={textAnchor}
            fill="#999"
            // style={{ fontSize: '2rem' }}
            >
        {`(Rate ${(percent * 100).toFixed(2)}%)`}
      </text>
    );
  };

  const pieLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    let x = cx + radius * Math.cos(-midAngle * RADIAN);
    let y = cy + radius * Math.sin(-midAngle * RADIAN);
  
    if (index === 0) {
      x = x - 5;
    } else {
      x = x + 10;
    }
  
    return (
      <text
        x={x}
        y={y}
        // dy={18}
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        // style={{ fontSize: '0.5rem' }}
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
      // <p>'aaaa'</p>
    );
  };

  // const pie =({
  //   cx,
  //   cy,
  //   midAngle,
  //   innerRadius,
  //   outerRadius,
  //   value,
  //   index,
  //   data
  // }) => {
  //   console.log("handling label?");
  //   const RADIAN = Math.PI / 180;
  //   // eslint-disable-next-line
  //   const radius = 25 + innerRadius + (outerRadius - innerRadius);
  //   // eslint-disable-next-line
  //   const x = cx + radius * Math.cos(-midAngle * RADIAN);
  //   // eslint-disable-next-line
  //   const y = cy + radius * Math.sin(-midAngle * RADIAN);

  //   return (
  //     <text
  //       x={x}
  //       y={y}
  //       fill="#8884d8"
  //       textAnchor={x > cx ? "start" : "end"}
  //       dominantBaseline="central"
  //     >
  //       {data[index].name} ({value})
  //     </text>
  //   );
  // }

  return (
    <div className="pie-chart-component">
      <h3 className="text-center mt-5">{ title }</h3>
      <ResponsiveContainer width={'100%'} height={300}>
        <PieChart>
          <Pie 
            data={categoryData}
            cx={'50%'}
            cy={'40%'}
            outerRadius={100} 
            fill="#8884d8"
            labelline={false}
            label={renderCustomizedLabel}
            isAnimationActive={true} 
            >
              {
                categoryData.map((entry, index) =>
                  <Cell 
                    key={index}
                    fill={colorsArr[index % colorsArr.length]}
                    // label
                  />
                )
              }
              <LabelList
                dataKey={'name'}
              />
            </Pie>
          <Tooltip/>
        </PieChart>
      </ResponsiveContainer> 
    </div>
  )
}

CustomPieChart.propTypes = {

}

export default CustomPieChart;
