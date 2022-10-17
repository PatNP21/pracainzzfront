import React, {useEffect} from 'react'
import styled from 'styled-components'

const Container = styled.div`
    width: 70vw;
    height:70vh;
`

function ExtendedNewsInfo(props) {

    useEffect(() => {
        console.log(props.data)
    }, [])

  return (
    <Container>
        <h2>News</h2>
    </Container>
  )
}

export default ExtendedNewsInfo