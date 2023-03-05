import { Button } from "@mui/material";
import { useState,useEffect } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import  blurF from "./plant/blur.json"
import  custom1 from "./plant/custom1.json"
import  custom2 from "./plant/custom2.json"
import  custom3 from "./plant/custom3.json"
import  fil from "./plant/hi.json"
import  edge from "./plant/edge.json"
import  emboss from "./plant/emboss.json"
import  gauss from "./plant/gauss.json"
export default function Grid({filename}) {

  const Filter = fil;
  
  const [row, setrow] = useState(3);
  const [col, setcol] = useState(3);
  const [divisor,setDivisor]=useState(9);

  let w=(3/col)*26+"%"
    const divStyle = {
      width: w
  }
  // const [grid, setGrid] = useState([
  //   [1, 1, 1],
  //   [1, 1, 1],
  //   [1, 1, 1],
  // ]);

  const [grid, setGrid] = useState(emboss);

  // useEffect(() => {
  //   // Load the JSON file containing the 2D array
  //   fetch("hi.json")
  //     .then((response) => response.json()) // Parse the JSON string
  //     .then((json) => setGrid(json)) // Set the initial state of the grid
  //     .then(setrow(grid.length))
  //     .then(setrow(grid[0].length))
  //     then(calculateDivisor());
  // }, []);


  function handleInputChange(row, col, value) {
    setGrid((prevGrid) => {
      const newGrid = [...prevGrid];
      newGrid[row][col] = Number(value);
      calculateDivisor()
      return newGrid;
    });
  }

  function calculateDivisor() {
    let sum=0;
    grid.forEach(element => {
      element.forEach(v=>{sum+=v})
    });
    setDivisor(sum)
  }


  function logg() {
    console.log(grid)
    console.log(row)
    console.log(col)
    console.log(divisor)
    console.log(Filter)
  }

  function rPlus() {
    if (row + 2 < 10) {
      setrow(row + 2)
      let rr=[...grid[0]]
      let r2=[...grid[0]]
      grid.push(rr);
      grid.push(r2);
    }
    else setrow(9)
    calculateDivisor()
  }

  function rMin() {
    if (row - 2 > 2){
       setrow(row - 2)
       grid.pop()
       grid.pop()
    }
    else setrow(3)
    calculateDivisor()

  }

  function cPlus() {
    if (col + 2 < 10) {
      setcol(col + 2)
      grid.forEach(element => {
        element.push(1)
        element.push(1)
      });

    }
    else setcol(9)
    calculateDivisor()


  }

  function cMin() {
    if (col - 2 > 2){
       setcol(col - 2)
       grid.forEach(element => {
        element.pop()
        element.pop()
      });

    }else setcol(3)

    calculateDivisor()

  }
  function saveGrid() {
    console.log("saveG")
    invoke("send_array_to_rust", { filename: "gauss", grid: grid }).then((message) => {
      if(message)console.log(message);
    });
  }

  function applyGrid() {
    console.log("applyGrid")
    invoke("apply_in_rust", { filename: filename, grid: grid ,div: divisor}).then((message) => {
      if(message)window.location.reload(false)
    });
  }




  return (<div>
        <button onClick={cPlus}>
       C +
        </button>
        <button onClick={cMin}>
       C -
        </button>

        <button onClick={rPlus}>
       R +
        </button>
        <button onClick={rMin}>
        R -
        </button>

        <button onClick={logg}>
        show
        </button>
      
        <div className="grid">
       
      {grid.map((row, rowIndex) => (
        <div key={rowIndex}>
          {row.map((cell, colIndex) => (
            <input
              key={colIndex}
              type="number"
              style= { divStyle }
              value={cell}
              onChange={(event) =>
                handleInputChange(rowIndex, colIndex, event.target.value)
              }
            />
          ))}
        </div>
      ))}
      </div>
      <div>
      <p>divisor</p>
        <input
         type="number"
          value={divisor}
          onChange={ (e)=>setDivisor(Number(e.target.value))}
        >
         
        </input>
        <button onClick={saveGrid}>
        Save
        
        </button>

        <button onClick={applyGrid}>
        Apply
        </button>
      </div>
     </div>);
}




//Grid({col,row}){
//  //let w=((row*col*30)/9)+"%"
//  let w=(3/col)*25+"%"
//   const divStyle = {
//     width: w
// }

//     var indents = [];
// for (var r = 0; r < row; r++) {
//    for (var c= 0; c < col; c++) {
//     indents.push(
//     <input  style= { divStyle } className='indent' key={c+""+r}></input>
//     );
//   }
// }

// return indents

// }