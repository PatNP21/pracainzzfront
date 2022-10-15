import React from 'react'
import styled from 'styled-components'

const Container = styled.div`
    width: 60vw;
    height: fit-content;
    border-radius:10px;
    box-shadow:0 0 3px #000080;
    margin:1vh auto;
`

function NewsItem(props) {
  return (
    <Container>
        {props.children}
    </Container>
  )
}

export default NewsItem