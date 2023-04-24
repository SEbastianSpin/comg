import { Button } from "@mui/material";
import { useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import ButtonGroup from '@mui/material/ButtonGroup';
import CircleOutlinedIcon from '@mui/icons-material/CircleOutlined';
import PolylineOutlinedIcon from '@mui/icons-material/PolylineOutlined';
import CopyAllOutlinedIcon from '@mui/icons-material/CopyAllOutlined';
import MoodBadOutlinedIcon from '@mui/icons-material/MoodBadOutlined';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import PinchOutlinedIcon from '@mui/icons-material/PinchOutlined';
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
import MouseOutlinedIcon from '@mui/icons-material/MouseOutlined';
import BackupOutlinedIcon from '@mui/icons-material/BackupOutlined';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import UploadFileOutlinedIcon from '@mui/icons-material/UploadFileOutlined';
import ModeEditOutlinedIcon from '@mui/icons-material/ModeEditOutlined';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import RemoveCircleOutlineOutlinedIcon from '@mui/icons-material/RemoveCircleOutlineOutlined';
import Switch from '@mui/material/Switch';
import LocalPizzaOutlinedIcon from '@mui/icons-material/LocalPizzaOutlined';
import OutboundOutlinedIcon from '@mui/icons-material/OutboundOutlined';

export default function Vectors({ downloadImage, setInstrument, SaveFigures ,handleFileUpload ,setTip, setOpen ,thic,setThic ,handleChecked ,checked }) {

  return (<div>

    <ButtonGroup aria-label="outlined primary button group">

      <Button
        onClick={() => {
          setInstrument("line")
          console.log("line");
        }}
      >
        <PolylineOutlinedIcon />
      </Button>
      <Button
        onClick={() => {
          setInstrument("circunference")
        }}

      >
        <CircleOutlinedIcon />
      </Button>

      <Button
        onClick={() => {
          setInstrument("radius")
          console.log("radius");
        }}
      >
        <OutboundOutlinedIcon />
      </Button>



      <Button
        onClick={() => {
          setInstrument("pizza");
        }}
      >
        <LocalPizzaOutlinedIcon />
      </Button>

      <Button onClick={() => {
        setInstrument("poly")
      }}>
        <CategoryOutlinedIcon></CategoryOutlinedIcon>
      </Button>



      <Button onClick={() => {
        setInstrument("mouse")
      }}>
        <MouseOutlinedIcon></MouseOutlinedIcon>
      </Button>




   
      <Button

        onClick={() => {
          setInstrument("delete")
        }}
      >
        <DeleteOutlineOutlinedIcon></DeleteOutlineOutlinedIcon>
      </Button>




      <Button onClick={() => {
        setInstrument("move")
        setTip("Click the target position  then the obj for Lines the closest endpint you want to move");
        setOpen(true);
      }}>
        <PinchOutlinedIcon></PinchOutlinedIcon>
      </Button>


      <Button component="label">
      <Switch
      checked={checked}
      onChange={handleChecked}
      inputProps={{ 'aria-label': 'controlled' }}
    />
      </Button>


      

      <Button onClick={downloadImage}>
        <CloudDownloadIcon></CloudDownloadIcon>
      </Button>

      <Button onClick={SaveFigures} >
        <SaveOutlinedIcon></SaveOutlinedIcon>
      </Button>

      <Button onClick={()=>{
        setThic(prev => prev + 2)
      }}>
        <AddCircleOutlineOutlinedIcon></AddCircleOutlineOutlinedIcon>
      </Button>
      <Button component="label">
       {thic}
      </Button>
      <Button onClick={()=>{
        setThic(prev =>prev>3?prev - 2:1)
      }}>
        <RemoveCircleOutlineOutlinedIcon></RemoveCircleOutlineOutlinedIcon>
      </Button>

  
      
      <Button component="label">
        <UploadFileOutlinedIcon> </UploadFileOutlinedIcon>
        <input hidden id="uploadFi" type="file"  onChange={handleFileUpload} />
      </Button>

    

      <Button onClick={() => {
        setInstrument("draw")
      }}>
        <ModeEditOutlinedIcon> </ModeEditOutlinedIcon>

      </Button>

    </ButtonGroup>
   
  </div>);
}
