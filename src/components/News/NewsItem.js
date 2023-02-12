import React from 'react'
import styled from 'styled-components'

const Container = styled.div`
    width: 60vw;
    height: fit-content;
    border-radius:10px;
    box-shadow:0 0 3px #000080;
    margin:1vh auto;
    font-family: 'Nunito Sans', sans-serif;
`
const NewsHeader = styled.div`
  text-align:center;
  font-size:1.5rem;
  font-weight:500;
`
const NewsImage = styled.img`
  width:30vw;
  height:30vw;
  margin: 1vh auto;
`

function NewsItem(props) {
  return (
    <Container>
        <NewsHeader>
          {props.data.headline}
        </NewsHeader>
    </Container>
  )
}

export default NewsItem