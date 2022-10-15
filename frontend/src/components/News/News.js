import React, {useState, useEffect} from 'react'
import Header from '../../elements/Header/Header'
import styled from 'styled-components'
import {useFinnhub} from 'react-finnhub'
import NewsItem from './NewsItem'

const Container = styled.div`
  width:70vw;
  height:90vh;
  margin:2vh auto;
  overflow:scroll;
`
const Img = styled.img`
  width:200px;
  height:200px;
  margin:2vh auto;
`

function News() {

  const [newsList, setNewsList] = useState()

  const finnhub = useFinnhub()

  useEffect(() => {
    finnhub.marketNews('general').then(res => {
      console.log(res)
      setNewsList(res.data.filter(item => {
        return item.category === 'business'
      }))
      
    }).catch(err => {
      console.log(err)
    })
  }, [])

  return (
    <>
      <Header/>
      <Container>
        {newsList ? newsList.map(item => {
          return (
            <NewsItem>
              {item.headline}
              <Img src={item.image}/>
            </NewsItem>
          )
        }) : <p>Hejo!</p>}
      </Container>
    </>
  )
}

export default News