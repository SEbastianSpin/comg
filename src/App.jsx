import { useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import react from "./assets/react.svg";
import modified from './assets/plant/modified.png';
import Slider from '@mui/material/Button';
import Grid from "./assets/Grid";
import Button from '@mui/material/Button';
import Dithering from "./assets/Dithering";
import Vectors from "./assets/Vectors";
import Image from 'image-js';
import Accordion from '@mui/material/Accordion';
import ShapeLineSharpIcon from '@mui/icons-material/ShapeLineSharp';
import AccordionSummary from '@mui/material/AccordionSummary';
import AppsSharpIcon from '@mui/icons-material/AppsSharp';
import BlurOnSharpIcon from '@mui/icons-material/BlurOnSharp';
import TuneSharpIcon from '@mui/icons-material/TuneSharp';
import MyDiv from "./assets/MyDiv";
import Tabs from "./assets/Tabs"
import PaletteOutlinedIcon from '@mui/icons-material/PaletteOutlined';



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
      if (message) window.location.reload(false)
    });
  }


  function brightness() {

    invoke("bright1", { filename: userImageName, val: value }).then((message) => {
      if (message) window.location.reload(false)
    });
  }

  function contrast() {

    invoke("contrast", { filename: userImageName, val: value }).then((message) => {
      console.log(message);
      window.location.reload(false)
    });
  }
  function median() {

    invoke("median", { filename: userImageName, val: value }).then((message) => {
      console.log(message);
      window.location.reload(false)
    });
  }

  function gamma() {

    invoke("gamma", { filename: userImageName, val: value }).then((message) => {
      if (message) window.location.reload(false)
    });
  }

  function blur() {

    invoke("blur", { filename: userImageName, val: value }).then((message) => {
      if (message) window.location.reload(false)
    });
  }

  function blu2() {

    invoke("gblur2", { filename: userImageName, val: value }).then((message) => {
      if (message) window.location.reload(false)
    });
  }

 
  //edge_horizontal

  function edgeH() {

    invoke("edge_horizontal", { filename: userImageName, val: value }).then((message) => {
      if (message) window.location.reload(false)
    });
  }

  function sharp() {

    invoke("sharp", { filename: userImageName, val: value }).then((message) => {
      if (message) window.location.reload(false)
    });
  }

  function eemboss() {

    invoke("eemboss", { filename: userImageName, val: value }).then((message) => {
      if (message) window.location.reload(false)
    });
  }


  function handleChange(event) {
    setValue(parseInt(event.target.value));
    console.log(value)
  }




  return (
    <div className="container">
      <nav className="Menu">

        <Accordion>

          <AccordionSummary
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
          <TuneSharpIcon></TuneSharpIcon>
          </AccordionSummary>


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
        </Accordion>


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

        <Accordion>
          <AccordionSummary
            aria-controls="panel1a-content"
            id="panel2a-header"
          >
          <AppsSharpIcon/>
          </AccordionSummary>


          <Grid filename={userImageName} ></Grid>

        </Accordion>



        <Accordion>
          <AccordionSummary
            aria-controls="panel1a-content"
            id="panel2a-header"

          >
            <BlurOnSharpIcon fontSize="large"></BlurOnSharpIcon>
          </AccordionSummary>
          <Dithering filename={userImageName}></Dithering>


        </Accordion>


        {/* <Accordion>
          <AccordionSummary
            aria-controls="panel1a-content"
            id="panel2a-header"

          >
            <ShapeLineSharpIcon></ShapeLineSharpIcon>
          </AccordionSummary>
          <Vectors filename={userImageName}></Vectors>


        </Accordion> */} 


        <Accordion>
          <AccordionSummary
            aria-controls="colors"
            id="panel3a-header"

          >
            <PaletteOutlinedIcon fontSize="large"></PaletteOutlinedIcon>
          </AccordionSummary>
          


        </Accordion>




      </nav>

      <div className="WorkBench">

      <Tabs uploadf={onFileChange} userImage={userImage}>

      </Tabs>

    
      

      
          
        {/* <div className="bench">
          <img src={userImage} className="ImagePreview">
          </img>

        </div> */}


      </div>


    </div>
  );
}




export default App;
