import { useState, useEffect } from 'react';
import Image from 'next/image'
import {TextField, Button} from '@mui/material';
import useChatGpt from '../hooks/useChatgpt';
import movieLoading from '../public/marvel_loading.gif'

const promptId = "cldohcs2w09d3i7ehsvsyxj28";

const InputArea = () => {
  const [text, setText] = useState('');
  const [message, setMessage] = useState('');
  const {data, isLoading} = useChatGpt(message, promptId);

  return (
    <>
      <TextField label='Movie Name' value={text} defaultValue='' onChange={(e) => {
        setText(e.target.value)
      }}/>
      <section className='btn-container'>
        <Button variant='contained' disabled={isLoading} onClick={() => setMessage(text)}>
          {isLoading ? 'Loading...' : 'Play 🎬'}
        </Button>
        <Button variant='outlined' disabled={isLoading} onClick={() => {
          setText('');
          setMessage('');
        }}>
          {'Reset 📀'}
        </Button>
      </section>
      <section style={{marginTop: "30px"}}>
        {isLoading ? <Image src={movieLoading} width={200} height={200} alt="Loading..."/> : <p style={{fontSize: '35px'}}>{data}</p>}
      </section>
    </>
  )
};

export default InputArea;