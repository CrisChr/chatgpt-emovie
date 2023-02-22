import { useEffect } from "react";
import * as BlinkIDSDK from '@microblink/blinkid-in-browser-sdk';
import {getWorkerLocation, startScan} from '../../../utils/ocr';

const licenseKey = "sRwAAAYZY2hhdGdwdC1lbW92aWUudmVyY2VsLmFwcF+uxGco4rtzwl2PyrqtwuHxXVMcRJxCOKuNeR+m5E8UQVR5x206L6GLadZhWXIksDial3zCJo3e4FnZFSg4/B8ZBHa/W7xWhMW40e6C5RqkzHB8/+i902tdJSoj7w9G6GYAau5KggMB9i5iOc7rKMu3FSMrFaJ/2qczSfzRMsSILYxnwsRxVK2g97HOG7PDgBaZUwKm8UHTh3VSmfp98TW+cQEfHgPJFBQ=";


const OCR =  () => {

  const initalBlinkID = async () => {
    if (!BlinkIDSDK.isBrowserSupported()) {
      alert("This browser is not supported!");
      return;
    }

    const loadSettings = new BlinkIDSDK.WasmSDKLoadSettings(licenseKey);
    loadSettings.engineLocation = "https://unpkg.com/@microblink/blinkid-in-browser-sdk@6.0.0/resources/";
    loadSettings.workerLocation = await getWorkerLocation('https://unpkg.com/@microblink/blinkid-in-browser-sdk@6.0.0/resources/BlinkIDWasmSDK.worker.min.js');
    BlinkIDSDK.loadWasmModule(loadSettings).then(
      (sdk) => {
        document.getElementById("image-file")?.addEventListener('change', ($event) => {
          $event.preventDefault();
          startScan(sdk, $event.target.files);
        })
      },
      (error) => {
        console.error('Failed to load SDK!', error);
      }
    )
  }

  useEffect(() => {

    initalBlinkID();
  }, []);

  return (
    <div className='img-container'>
      <input id='image-file' type='file' accept='image/*'/>
      <label htmlFor='image-file'>Scan from file</label>
    </div>
  )
}

export default OCR;