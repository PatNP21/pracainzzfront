import React, {useState, useEffect} from 'react'
import styled from 'styled-components'

const Container = styled.div`
    width:14vw;
    height:12vh;
    border-radius:10px;
    box-shadow:0 0 3px gray;
    margin:auto;
    position:fixed;
    top:40%;
    left:42vw;
    align-items:center;
    justify-content:center;
    background-color:white;
    opacity:1;
    z-index:2;
`
const LoadingHeader = styled.div`
    display:block;
    font-size:1.2rem;
    width:fit-content;
    margin:auto;
`
const Dots = styled.div`
    font-size:3rem;
    letter-spacing:15px;
    width:4vw;
    margin:auto;
`

function Loader() {

    const [dots, updateDots] = useState('')

    useEffect(() => {
        setTimeout(() => {
            if(dots.length < 3) {
                updateDots(dots + '.')
            } else {
                updateDots('')
            }
        }, 500)
    })

  return (
    <Container>
        <LoadingHeader>Loading</LoadingHeader>
        <Dots>{dots}</Dots>
    </Container>
  )
}

export default Loader