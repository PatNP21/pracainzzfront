import React, { useState, useEffect } from 'react'
import {Line} from 'react-chartjs-2'
import {Chart as ChartJS, Tooltip, Title} from 'chart.js'
import {} from 'chart.js/auto'

function Chart(props) {

  let chart = {
    labels: props.dataToStore.map(item => item.datetime),
    datasets: [{
      label: 'label',
      data: props.dataToStore.map(item => item.close),
      backgroundColor: ['red']
    }]
  }

  useEffect(() => {
    console.log(props.dataToStore)
  }, [])
  
  return (
    <Line data={chart}/>
  )
}

export default Chart