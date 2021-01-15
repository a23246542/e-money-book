import React from 'react'
import PropTypes from 'prop-types'
import { PieChart, Pie, Cell, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import { PieColor } from '../utility';
const data = [
  {
    name: 'Page A', 
    uv: 400,
    pv: 2400,
    amt: 2400
  }
];

const data01 = [{name: 'Group A', value: 400}, {name: 'Group B', value: 300},
                  {name: 'Group C', value: 300}, {name: 'Group D', value: 200},
                  {name: 'Group E', value: 278}, {name: 'Group F', value: 189}]

const data02 = [{name: 'Group A', value: 2400}, {name: 'Group B', value: 4567},
                  {name: 'Group C', value: 1398}, {name: 'Group D', value: 9800},
                  {name: 'Group E', value: 3908}, {name: 'Group F', value: 4800}];

const Charts = props => {


  const colorsArr = Object.keys(PieColor).map((color,index) =>PieColor[color])

  return (
    <div>
      {/* <LineChart width={400} height={400} data={data}>
        <Line type="monotone" dataKey="uv" stroke="#8884d8" />
        <CartesianGrid stroke="#ccc" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
      </LineChart> */}
      <PieChart width={800} height={400}>
        <Pie isAnimationActive={false} 
          data={data01} 
          cx={200} 
          cy={200} 
          outerRadius={80} 
          fill="#8884d8" 
          label>
            {
              data01.map((entry, index) => <Cell key={index} fill={colorsArr[index % colorsArr.length]}/>)
            }
          </Pie>
        {/* <Pie data={data02} cx={500} cy={200} innerRadius={40} outerRadius={80} fill="#82ca9d"/> */}
        <Tooltip/>
      </PieChart>
    </div>
  )
}

Charts.propTypes = {

}

export default Charts
