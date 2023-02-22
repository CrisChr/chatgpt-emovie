import * as BlinkIDSDK from '@microblink/blinkid-in-browser-sdk';

const licenseKey = "sRwAAAYZY2hhdGdwdC1lbW92aWUudmVyY2VsLmFwcF+uxGco4rtzwl2PyrqtwuHxXVMcRJxCOKuNeR+m5E8UQVR5x206L6GLadZhWXIksDial3zCJo3e4FnZFSg4/B8ZBHa/W7xWhMW40e6C5RqkzHB8/+i902tdJSoj7w9G6GYAau5KggMB9i5iOc7rKMu3FSMrFaJ/2qczSfzRMsSILYxnwsRxVK2g97HOG7PDgBaZUwKm8UHTh3VSmfp98TW+cQEfHgPJFBQ=";

async function main(){
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

async function getWorkerLocation(path){
  return new Promise((resolve) => {
    window.fetch(path)
      .then(response => response.text())
      .then(data => {
        const blob = new Blob( [ data ], { type: "application/javascript" } );
        const url = URL.createObjectURL( blob );
        resolve(url);
      });
  });
}

async function startScan(sdk, fileList) {
  const recognizer = await BlinkIDSDK.createBlinkIdSingleSideRecognizer(sdk);
  const recognizerRunner = await BlinkIDSDK.createRecognizerRunner(sdk, [recognizer], true);

  let file = null;
  const imageRegex = RegExp(/^image\//);
  for(let i=0; i<fileList.length; ++i){
    if(imageRegex.exec(fileList[i].type)){
      file = fileList[i];
    }
  }

  if ( !file ){
    alert( "No image files provided!" );
    recognizerRunner?.delete();
    recognizer?.delete();
    inputImageFile.value = "";
    return;
  }

  const imageElement = new Image();
  const url = URL.createObjectURL(file);
  imageElement.src = url;

  await imageElement.decode();
  const imageFrame = BlinkIDSDK.captureFrame( imageElement );
  URL.revokeObjectURL( url );

  const processResult = await recognizerRunner.processImage( imageFrame );
  if ( processResult !== BlinkIDSDK.RecognizerResultState.Empty ){
    const singleSideIDResults = await singleSideIDRecognizer.getResult();
    if ( singleSideIDResults.state !== BlinkIDSDK.RecognizerResultState.Empty ){
      console.log( "BlinkID Single-side recognizer results", singleSideIDResults );
    }
  }else{
    alert("Could not extract information!")
  }

  recognizerRunner?.delete();
  singleSideIDRecognizer?.delete();
  inputImageFile.value = "";
}

// main();

export {
  getWorkerLocation,
  startScan
}