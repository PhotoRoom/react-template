import React, { ChangeEvent, useState } from 'react';
import './App.css';
import AddButton from './components/AddButton';
import loadImage, { LoadImageResult } from 'blueimp-load-image';
import { API_URL } from './Constants';

function App() {
  const [result, setResult] = useState<string | null>(null)
  
  let uploadImageToServer = (file: File) => {
    loadImage(
      file,
      {
        maxWidth: 400,
        maxHeight: 400,
        canvas: true
      })
      .then(async (imageData: LoadImageResult) => {
        let image = imageData.image as HTMLCanvasElement
        
        let imageBase64 = image.toDataURL("image/png")
        let data = {
          b64_img: imageBase64,
        }
        const response = await fetch(API_URL + '/upload', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify(data)
        });

        if (response.status >= 400 && response.status < 600) {
          throw new Error("Bad response from server");
        }

        const result = await response.json();
        const imagePath = API_URL + result.path
        setResult(imagePath)
      })
      
      .catch(error => {
        console.error(error)
      })
    }
    
    let onImageAdd = (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        uploadImageToServer(e.target.files[0])
      } else {
        console.error("No file was picked")
      }
    }
    
    return (
      <div className="App">
        <header className="App-header">
          {!result && <AddButton onImageAdd={onImageAdd}/>}
          {result && <img src={result} width={300} alt="result from the API"/>}
        </header>
      </div>
      );
    }
    
    export default App;
    