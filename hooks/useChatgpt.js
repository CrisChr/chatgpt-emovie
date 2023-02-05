import {useEffect, useState} from 'react';

const useChatGpt = (message, promptId) => {
  const [data, setData] = useState('');
  const [isLoading, setLoading] = useState(false);

  const fetchData = async () => {
    if(!message) {
      setData('');
      return;
    }
    console.log('fetching data....');
    setLoading(true);
    try{
      const response = await fetch('/api/chatgpt', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message,
          promptId
        })
      }).then(res => res.json());
      if(response.reply){
        setData(response.reply)
      }
    }catch(error){
      console.error('call chatgpt api error: ', error);
    }finally{
      setLoading(false);
    }
  }

  useEffect(() => {
    // if(message){
      fetchData();
    // }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [message]);

  return {
    data,
    isLoading
  }
};

export default useChatGpt;