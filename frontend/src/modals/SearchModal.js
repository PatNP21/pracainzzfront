import React from 'react'
import styled from 'styled-components'
import {FiSearch} from 'react-icons/fi'
import {ImCross} from 'react-icons/im'
import './SearchModal.css'

const Container = styled.div`
  width:fit-content;
  height:fit-content;
`

const Input = styled.input`
    width:30vw;
    height:3vh;
    border-radius:10px;
    box-shadow:0 0 3px gray;
    float:left;
`
const Option = styled.button`
    width:fit-content;
    height:fit-content;
    float:left;
`

function SearchModal() {
  return (
    <>
       <input id="search_input" type="text" placeholder='Search'/>
        <div>
            <FiSearch/>
        </div>
        <div>
            <ImCross/>
        </div>
    </>
  )
}

export default SearchModal