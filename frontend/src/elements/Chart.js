import React, { useState, useEffect } from 'react'
import {Line} from 'react-chartjs-2'
import {Chart as ChartJS, Tooltip, Title} from 'chart.js'
import {} from 'chart.js/auto'

function Chart(props) {

  let cryptoChart = {
    labels: props.dataToStore.map(item => item.datetime),
    datasets: [{
      label: crypto,
      data: props.dataToStore.map(item => item.close),
      backgroundColor: ['red']
    }]
  }

  useEffect(() => {
    console.log(props.dataToStore)
  }, [])
  
  return (
    <Line data={cryptoChart}/>
  )
}

export default Chart