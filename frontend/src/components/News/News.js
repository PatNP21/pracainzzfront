import React, {useState, useEffect} from 'react'
import Header from '../../elements/Header/Header'
import styled from 'styled-components'
import { useNavigate } from 'react-router-dom'
import {useFinnhub} from 'react-finnhub'
import NewsItem from './NewsItem'

const Container = styled.div`
  width:70vw;
  height:80vh;
  padding:5px;
  margin:2vh auto;
  overflow:scroll;
  cursor:pointer;
`
const ImgContainer = styled.div`
  width:fit-content;
  height:fit-content;
  margin:2vh auto;
`
const Img = styled.img`
  width:200px;
  height:200px;
`
const ItemBtn = styled.button`
  border:none;
  width:fit-content;
  height:fit-content;
  margin:2vh auto;
  cursor:pointer;
  border-radius:10px;
  background-color:#ffffff;
`
const NewsHeader = styled.div`
  width: 60vw;
  height: fit-content;
  border-radius:10px;
  box-shadow:0 0 3px #000080;
  margin:1vh auto;
  font-family: 'Nunito Sans', sans-serif;
  text-align:center;
  font-size:1.5rem;
  font-weight:500;
`

function News() {

  const [newsList, setNewsList] = useState()
  const navigate = useNavigate()
  const finnhub = useFinnhub()

  useEffect(() => {
    console.log(finnhub.marketNews)//.marketNews.arguments('merger')   // marketNews('merger').then(res => {
      /*console.log(res)
      setNewsList(res.data)
      console.log(newsList)
    }).catch(err => {
      console.log(err)
    })*/
  }, [])

  return (
    <>
      <Header/>
      <Container>
        {newsList && newsList.map(item => {
          return (
            <ItemBtn onClick={() => {
              console.log(`newsItem selected!`)
              navigate(`/news/${Number(newsList.indexOf(item)+1)}`, {state: item})
            }}>
              <NewsHeader>
                {item.headline}
              </NewsHeader>
            </ItemBtn>
          )
        })}
      </Container>
    </>
  )
}

export default News