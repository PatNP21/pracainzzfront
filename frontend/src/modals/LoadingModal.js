import React from 'react'
import {Circles} from 'react-loader-spinner'
import styled from 'styled-components'

const Container = styled.div`
  width:fit-content;
  height:fit-content;
  padding:2vh 2vw;
  margin:10vh auto;
  box-shadow:0 0 3px #000080;
  border-radius:10px;
  transform: translate(0, 100%);
  z-index:2;
  perspective:300px;
`

function LoadingModal() {
  return (
    <Container>
      <Circles
        height="80"
        width="80"
        color="#4fa94d"
        ariaLabel="circles-loading"
        wrapperStyle={{}}
        wrapperClass=""
        visible={true}
      />
    </Container>
  )
}

export default LoadingModal