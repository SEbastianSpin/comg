import { Button } from "@mui/material";
import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import blurF from "./plant/blur.json"
import custom1 from "./plant/custom1.json"
import custom2 from "./plant/custom2.json"
import custom3 from "./plant/custom3.json"
import fil from "./plant/hi.json"
import edge from "./plant/edge.json"
import emboss from "./plant/emboss.json"
import gauss from "./plant/gauss.json"
import sharpen from "./plant/sharpen.json"
export default function Grid({ filename }){

  const Filter = fil;


  const [divisor, setDivisor] = useState(9);
  const [grid, setGrid] = useState(blurF);

  const [selectedFruit, setSelectedFruit] = useState('blur');
  const [row, setrow] = useState(blurF.length);
  const [col, setcol] = useState(blurF[0].length);
  const [offset,setOffset] =useState(0);


  let w = (3 / col) * 26 + "%"
  const divStyle = {
    width: w
  }
  // const [grid, setGrid] = useState([
  //   [1, 1, 1],
  //   [1, 1, 1],
  //   [1, 1, 1],
  // ]);



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
    let sum = 0;
    grid.forEach(element => {
      element.forEach(v => { sum += v })
    });
    setDivisor(sum)
  }


  function logg() {
    console.log(grid)
    console.log(row)
    console.log(col)
    console.log(divisor)
    console.log(grid)
  }

  function rPlus() {
    if (row + 2 < 10) {
      setrow(row + 2)
      let rr = [...grid[0]]
      let r2 = [...grid[0]]
      grid.push(rr);
      grid.push(r2);
    }
    else setrow(9)
    calculateDivisor()
  }

  function rMin() {
    if (row - 2 > 2) {
      setrow(row - 2)
      grid.pop()
      grid.pop()
    }
    else setrow(3)
    calculateDivisor()

  }

  function changeFilter(e) {

    setSelectedFruit(e.target.value)


    switch (e.target.value) {
      case "edge":
        setGrid(edge);
        setcol(edge[0].length);
        setrow(edge.length)
        break;

      case "custom1":
        setGrid(custom1);
        setcol(custom1[0].length);
        setrow(custom1.length)
        break;

      case "custom2":
        setGrid(custom2);
        setcol(custom2[0].length);
        setrow(custom2.length)
        break;


      case "custom3":
        setGrid(custom3);
        setcol(custom3[0].length);
        setrow(custom3.length)
        break;


      case "blur":
        setGrid(blurF);
        setcol(blurF[0].length);
        setrow(blurF.length)
        break;


      case "emboss":
        setGrid(emboss);
        setcol(emboss[0].length);
        setrow(emboss.length)
        break;

      case "gauss":
        setGrid(gauss);
        setcol(gauss[0].length);
        setrow(gauss.length)
        break;

      case "sharpen":
        setGrid(sharpen);
        setcol(sharpen[0].length);
        setrow(sharpen.length)
        break;
    }

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
    if (col - 2 > 2) {
      setcol(col - 2)
      grid.forEach(element => {
        element.pop()
        element.pop()
      });

    } else setcol(3)

    calculateDivisor()

  }
  function saveGrid() {
    console.log("saveG")
    invoke("send_array_to_rust", { filename: selectedFruit, grid: grid }).then((message) => {
      if (message) console.log(message);
    });
  }

  function applyGrid() {
    console.log("applyGrid")
    invoke("apply_in_rust", { filename: filename, grid: grid, div: divisor, o:offset }).then((message) => {
      if (message) window.location.reload(false)
    });
  }




  return (<div>
    <Button onClick={cPlus}>
      C +
    </Button>
    <Button onClick={cMin}>
      C -
    </Button>

    <Button onClick={rPlus}>
      R +
    </Button>
    <Button onClick={rMin}>
      R -
    </Button>

    <Button  onClick={logg}>
      show
    </Button>

    <select onChange={changeFilter}>
        <option value="blur">blur</option>
        <option value="custom1">custom1</option>
        <option value="custom2">custom2</option>
        <option value="custom3">custom3</option>
        <option value="edge">edge</option>
        <option value="emboss">emboss</option>
        <option value="gauss">gauss</option>
        <option value="sharpen">sharpen</option>
      </select>

    <div className="grid">


      {grid.map((row, rowIndex) => (
        <div key={rowIndex}>
          {row.map((cell, colIndex) => (
            <input
              key={colIndex}
              type="number"
              style={divStyle}
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
     

      {/* <p>divisor</p> */}

      {/* <input
        type="number"
        value={divisor}
        onChange={(e) => setDivisor(Number(e.target.value))}
      >

        

      </input>
<p>setOffset</p>
      <input
        type="number"
        value={offset}
        onChange={(e) => setOffset(Number(e.target.value))}
      /> */}

      <Button onClick={saveGrid}>
        Save

      </Button>

      <Button onClick={applyGrid}>
        Apply
      </Button>
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