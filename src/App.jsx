import { useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import react from "./assets/react.svg";
import modified from './assets/plant/modified.png';
import Slider from '@mui/material/Button';
import Grid from "./assets/Grid";
import Button from '@mui/material/Button';
import Dithering from "./assets/Dithering";

function App() {

 
  const [userImage, setuserImage] = useState(modified);
  const [userImageName, setuserImageName] = useState("modified.png");
  const [bright, setbrightness] = useState(56);


  function onFileChange(e) {
    if (e.target.files && e.target.files[0]) {
      setuserImage(URL.createObjectURL(e.target.files[0]));
      setuserImageName(e.target.files[0].name);
    }
  }

  const [value, setValue] = useState(0);

  async function Invert() {

    invoke("inverse", { filename: userImageName }).then((message) => {
      if(message)window.location.reload(false)
    });
  }


  function brightness() {

    invoke("bright1", { filename: userImageName, val: value }).then((message) => {
      if(message)window.location.reload(false)
    });
  }

  function contrast() {

    invoke("contrast", { filename: userImageName, val: value }).then((message) => {
      console.log(message);
      window.location.reload(false)
    });
  }
  function median(){

    invoke("median", { filename: userImageName, val: value }).then((message) => {
      console.log(message);
      window.location.reload(false)
    });
  }

  function gamma() {

    invoke("gamma", { filename: userImageName, val: value }).then((message) => {
      if(message)window.location.reload(false)
    });
  }

  function blur() {

    invoke("blur", { filename: userImageName, val: value }).then((message) => {
      if(message)window.location.reload(false)
    });
  }

  function blu2() {

    invoke("gblur2", { filename: userImageName, val: value }).then((message) => {
      if(message)window.location.reload(false)
    });
  }

//edge_horizontal

function edgeH() {

  invoke("edge_horizontal", { filename: userImageName, val: value }).then((message) => {
    if(message)window.location.reload(false)
  });
}

  function sharp() {

    invoke("sharp", { filename: userImageName, val: value }).then((message) => {
      if(message)window.location.reload(false)
    });
  }

  function eemboss() {

    invoke("eemboss", { filename: userImageName, val: value }).then((message) => {
      if(message)window.location.reload(false)
    });
  }


  function handleChange(event) {
    setValue(parseInt(event.target.value));
    console.log(value)
  }

  return (
    <div className="container">
      <nav className="Menu">
        <Button onClick={Invert}>
          Invert
        </Button>

        <div className="roller">
          <input
            id="typeinp"
            type="range"
            min="0" max="255"
            value={value}
            name="bright"
            onChange={handleChange}

            step="1" />

          <label for="bright">Brightness </label>

        </div>
        <Button onClick={brightness}>
           Brightness correction
        </Button>
        <Button onClick={gamma}>
          gamma correction
        </Button>

        <Button onClick={contrast}>
          contrast
        </Button>
        {/* <Button onClick={blur}>
          Blur
        </Button> */}

        {/* <Button onClick={blu2}>
          Gaussian blur
        </Button> */}

        <Button onClick={median}>
        Median
        </Button>

        <Dithering filename={userImageName}></Dithering>

{/* 
       <Button onClick={sharp}>
        Sharpen
        </Button>
 
        <Button onClick={edgeH}>
        edge detection X
        </Button>

        

       

        <Button onClick={eemboss}>
        emboss detection X
        </Button> */}


        
       <Grid filename={userImageName} ></Grid>

      </nav>

      <div className="WorkBench">

        <div className="fileUpload">
          <input id="upload" type="file" accept="image/*" onChange={onFileChange}/>
        </div>
        <div className="bench">
          <img src={userImage} className="ImagePreview">
          </img>

        </div>


      </div>


    </div>
  );
}




export default App;
