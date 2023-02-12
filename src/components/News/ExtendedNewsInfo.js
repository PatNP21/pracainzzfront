import React, {useEffect} from 'react'
import { useLocation } from 'react-router-dom'
import styled from 'styled-components'

const Container = styled.div`
    width: 70vw;
    height:70vh;
    margin:auto;
`
const NewsHeader = styled.div`
  text-align:center;
  width:80vw;
  height:fit-content;
  margin:2vh auto; 
  font-size:2rem;
  font-family: 'Nunito Sans', sans-serif;
`
const NewsDate = styled.div`
  width:fit-content;
  height:fit-content;
  margin:1vh 3vw;
`
const NewsImage = styled.img`
  width:40vw;
  height:40vh;
`
const NewsSourceURL = styled.a`
  font-family: 'Nunito Sans', sans-serif;
  font-size:1em;
  font-style:cursive;
`
const NewsContent = styled.div`
width:70vw;
height:fit-content;
margin:2vh auto; 
font-size:1rem;
justify-content: justify;
font-family: 'Nunito Sans', sans-serif;
`

function ExtendedNewsInfo() {

  const {state} = useLocation()


  return (
    <Container>
        <NewsHeader>
          {state.headline}
        </NewsHeader>
        <NewsDate>
          {new Date(state.datetime).toLocaleDateString('en-CA')}
        </NewsDate>
        <NewsImage src={state.image}/>
        <NewsContent>
          {state.summary}
        </NewsContent>
        source: <NewsSourceURL href={state.url}>
          {state.source}
        </NewsSourceURL>
    </Container>
  )
}

export default ExtendedNewsInfo