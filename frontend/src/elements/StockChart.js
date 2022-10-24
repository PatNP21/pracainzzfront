import React, { useState, useEffect } from 'react'
import {Line} from 'react-chartjs-2'
import {Chart as ChartJS, Tooltip, Title} from 'chart.js'
import {} from 'chart.js/auto'

function StockChart(props) {

    const stockChart = {
    labels: props.data.map(item => item.datetime),
    datasets: [{
        label: stock,
        data: props.data.map(item => item.metric['52WeekHigh']),
        backgroundColor: ['blue']
    }]
    }

    useEffect(() => {
        console.log(props.data)
    }, [])
  return (
    <Line data={stockChart}/>
  )
}

export default StockChart