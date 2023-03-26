import { Button } from "@mui/material";
import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/tauri";

export default function Dithering({ filename }){

  const [k,setK] =useState(5);
  function applyDithering() {
    console.log("Dithering")
    invoke("thresholding", { filename: filename , k:k}).then((message) => {
      if (message) window.location.reload(false);
    });
  }

  function applyMedian() {
    console.log("median_cut")
    invoke("median_cut", { filename: filename , k:k}).then((message) => {
      if (message) window.location.reload(false);
    });
  }

  function applyGrey() {
    console.log("grey")
    invoke("grey", { filename: filename , k:k}).then((message) => {
      if (message) window.location.reload(false);
    });
  }



  return (<div>
   
    <Button  onClick={applyDithering}>
         applyDithering
    </Button>
    <input onChange={(e)=>setK(Number(e.target.value)+1

    )}></input>

    <Button onClick={applyMedian}>
    applyMedian
    </Button>


    <Button onClick={applyGrey}>
    B&W
    </Button>

   
  </div>);}
