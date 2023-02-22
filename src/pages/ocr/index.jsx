import { useEffect } from "react";
import {setupBlinkID} from '../../../utils/ocr';

const OCR =  () => {

  useEffect(() => {
    setupBlinkID();
  }, []);

  return (
    <div className='img-container'>
      <input id='image-file' type='file' accept='image/*'/>
      <label htmlFor='image-file'>Scan from file</label>
    </div>
  )
}

export default OCR;