import Vectors from "./Vectors";
import React, { useRef, useEffect, useState } from 'react';
import { Button } from "@mui/material";
import FileSaver from "file-saver";
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';


function Canvas({ setOpen, setfigure2ip }) {
    const canvasRef = useRef(null);
    let vertices = [];
    const width = 1000;
    const height = 600;
    const [instrument, setInstrument] = useState("mouse");
    const [pic, setPic] = useState(new ImageData(width, height));
    const [objectss, setObjects] = useState([...pic.data]);
    const [figuresFile, setFileContent] = useState([]);
    const [thic, setThic] = useState(1);

    const [checked, setChecked] = React.useState(true);

    const handleChecked = (event) => {
        setChecked(event.target.checked);
        console.log(checked);
    };


    function det(a, b, c) {
        return a.x * b.y - a.x * c.y - a.y * b.x + a.y * c.x + b.x * c.y - b.y * c.x
    }
    function handleFileUpload(e) {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = () => {
            const content = JSON.parse(reader.result);
            setFileContent(content);
        };
        reader.readAsfigure2ext(file);
        // console.log(figuresFile); // output to console
        setfigure2ip("Select the pen and then click on the screen")
        setOpen(true);
    }


    function changeInstrument(type) {
        console.log(type);
        setInstrument(type);

    }

    function downloadImage() {
        const canvas = canvasRef.current;
        const dataURL = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = 'image.png';
        link.href = dataURL;
        link.click();
    }

    function SaveFigures() {
        const link = document.createElement('a');
        const json = JSON.stringify(figuresFile);
        const blob = new Blob([json], { type: 'application/json' });
        link.download = 'figures.json';
        link.href = URL.createObjectURL(blob);
        link.click();
    }

    const colors = {
        blue: [0, 0, 255, 255],
        red: [255, 0, 0, 255],
        green: [0, 255, 0, 255],
        clear: [0, 0, 0, 0]
    }


    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        const imageData = pic;
        //const objData = [...imageData.data];
        const objData = objectss;  //objects


        function getObject(x, y) {
            const clicked = y * (width * 4) + x * 4;
            console.log(`${objData[clicked].t}  ${objData[clicked].x1}   ${objData[clicked].y1}  ${objData[clicked].x2}  ${objData[clicked].y2} `);
            return objData[clicked];
        }

        function putPixel(x, y, figure, g = 1) {

            let i = Math.floor(y) * (width * 4) + Math.floor(x) * 4;
            let color = figure.color ? figure.color : [0, 0, 0, 0];
            imageData.data[i] = color[0]; // red
            imageData.data[i + 1] = color[1]; // green
            imageData.data[i + 2] = color[2]; // blue
            imageData.data[i + 3] = color[3]; // alpha

            objData[i] = figure; // red
            objData[i + 1] = figure; // green
            objData[i + 2] = figure; // blue
            objData[i + 3] = figure; // alpha


        }


        function putPixel2(x, y, figure, cc, a, b, c, d) {
            console.log(cc);
            let detabd = det(a, b, d);
            let detacd = det(a, c, d);
            if (cc == 1) {
                if (detabd >= 0 && detacd <= 0) {
                    let i = Math.floor(y) * (width * 4) + Math.floor(x) * 4;
                    let color = figure.color ? figure.color : [0, 0, 0, 0];
                    imageData.data[i] = color[0]; // red
                    imageData.data[i + 1] = color[1]; // green
                    imageData.data[i + 2] = color[2]; // blue
                    imageData.data[i + 3] = color[3]; // alpha

                    objData[i] = figure; // red
                    objData[i + 1] = figure; // green
                    objData[i + 2] = figure; // blue
                    objData[i + 3] = figure; // alpha
                } else { console.log("Nodraw") }
            }
            else {

                if (detabd < 0 && detacd > 0) {
                    let i = Math.floor(y) * (width * 4) + Math.floor(x) * 4;
                    let color = figure.color ? figure.color : [0, 0, 0, 0];
                    imageData.data[i] = color[0]; // red
                    imageData.data[i + 1] = color[1]; // green
                    imageData.data[i + 2] = color[2]; // blue
                    imageData.data[i + 3] = color[3]; // alpha

                    objData[i] = figure; // red
                    objData[i + 1] = figure; // green
                    objData[i + 2] = figure; // blue
                    objData[i + 3] = figure; // alpha
                } else { console.log("Nodraw") }
            }



        }


        // function MidpointCircle(center, R, color) {
        //     let d = 1 - R;
        //     let x = center;
        //     let y = R;
        //     putPixel(x, y, center, R, center, y, color, "c");
        //     while (y > x) {
        //         if (d < 0) //move to E
        //             d += 2 * x + 3;
        //         else //move to SE
        //         {
        //             d += 2 * x - 2 * y + 5;
        //             --y;
        //         }
        //         ++x;
        //         putPixel(x, y, center, R, center, y, color, "c");
        //     }
        // }

        // function SymmetricLine(x1, y1, x2, y2, color) {
        //     let dx = x2 - x1;
        //     let dy = y2 - y1;
        //     let d = 2 * dy - dx;
        //     let dE = 2 * dy;
        //     let dNE = 2 * (dy - dx);
        //     let xf = x1, yf = y1;
        //     let xb = x2, yb = y2;
        //     putPixel(xf, yf, x1, y1, x2, y2, color, "l");
        //     putPixel(xb, yb, x1, y1, x2, y2, color, "l");
        //     while (xf < xb) {
        //         ++xf; --xb;
        //         if (d < 0)
        //             d += dE;
        //         else {
        //             d += dNE;
        //             ++yf;
        //             --yb;
        //         }
        //         putPixel(xf, yf, x1, y1, x2, y2, color, "l");
        //         putPixel(xb, yb, x1, y1, x2, y2, color, "l");
        //     }

        // }


        function SymmetricLine(x1, y1, x2, y2, color, g = 1, t = "l", v) {
            console.log(g);
            let figure = color.toString() === [0, 0, 0, 0].toString() ? 0 : { x1: x1, y1: y1, x2: x2, y2: y2, color: color, t: t, g: g };
            if (t == "p") {
                figure["v"] = v;
            }
            let xcase = (x1, y1, x2, y2) => {
                let dx = x2 - x1
                let dy = y2 - y1
                let yi = 1

                if (dy < 0) {
                    yi = -1
                    dy = -dy
                }

                let d = 2 * dy - dx
                let dE = 2 * dy
                let dNE = 2 * (dy - dx)
                //  let y = y1
                let xs = x1
                let ys = y1
                let xf = x2
                let yf = y2
                let thic = g;
                while (xs <= xf) {
                    //putPixel(x0, y0, vertical = figure2rue)
                    //putPixel(x1, y1, vertical = figure2rue)
                    putPixel(xf, yf, figure);
                    putPixel(xs, ys, figure);
                    g--;
                    while (g > 0) {

                        putPixel(xf, yf + g, figure);
                        putPixel(xf, yf - g, figure);
                        putPixel(xs, ys - g, figure);
                        putPixel(xs, ys + g, figure);
                        g = g - 2;
                    }
                    g = thic;
                    xs += 1
                    xf -= 1
                    if (d < 0) {
                        d += dE
                    }

                    else {
                        d += dNE
                        ys += yi
                        yf -= yi
                    }

                }

            }


            let ycase = (x1, y1, x2, y2) => {
                let dx = x2 - x1
                let dy = y2 - y1
                let xi = 1

                if (dx < 0) {
                    xi = -1
                    dx = -dx
                }


                let d = 2 * dx - dy
                let dE = 2 * dx
                let dNE = 2 * (dx - dy)

                let xs = x1
                let ys = y1
                let xf = x2
                let yf = y2
                let thic = g;
                while (ys <= yf) {
                    putPixel(xf, yf, figure);
                    putPixel(xs, ys, figure);
                    g--;
                    while (g > 0) {
                        putPixel(xf, yf + g, figure);
                        putPixel(xf, yf - g, figure);
                        putPixel(xs, ys - g, figure);
                        putPixel(xs, ys + g, figure);
                        g = g - 2;
                    }
                    g = thic;
                    ys += 1
                    yf -= 1
                    if (d < 0) {
                        d += dE
                    }
                    else {
                        d += dNE
                        xs += xi
                        xf -= xi
                    }

                }

            }

            if (Math.abs(y2 - y1) < Math.abs(x2 - x1)) {
                if (x1 > x2) {
                    xcase(x2, y2, x1, y1);
                }

                else {
                    xcase(x1, y1, x2, y2);
                }
            } else {
                if (y1 > y2) {
                    ycase(x2, y2, x1, y1)
                }

                else {
                    ycase(x1, y1, x2, y2)
                }

            }
            figuresFile.push(figure);
        }


        function WUCircle(xCenter, yCenter, radius) {
            let figure = { xCenter: xCenter, yCenter: yCenter, radius: radius, color: [166, 208, 221, 255], t: "l", g: 1 };
            let figure2 = { xCenter: xCenter, yCenter: yCenter, radius: radius, color: [108, 155, 207, 255], t: "l", g: 1 };

            // xCenter = Math.round((x_start + x_end) / 2);
            // yCenter = Math.round((y_start + y_start) / 2);
            // radius = Math.round(sqrt((x_start - x_end) ** 2 + (y_start - y_start) ** 2));


            let x = 0
            let y = radius

            putPixel(xCenter, yCenter + y, figure);
            putPixel(xCenter, yCenter - y, figure)
            putPixel(xCenter - y, yCenter, figure)
            putPixel(xCenter + y, yCenter, figure)
            while (y > x) {
                x += 1
                y = Math.ceil(Math.sqrt(radius ** 2 - x ** 2));
                let T = y - Math.sqrt(radius ** 2 - x ** 2);

                putPixel(xCenter + x, yCenter + y, figure)
                putPixel(xCenter + x, yCenter + y - 1, figure2)

                putPixel(xCenter - x, yCenter + y, figure)
                putPixel(xCenter - x, yCenter + y - 1, figure2)

                putPixel(xCenter + x, yCenter - y, figure)
                putPixel(xCenter + x, yCenter - y + 1, figure2)

                putPixel(xCenter - x, yCenter - y, figure)
                putPixel(xCenter - x, yCenter - y + 1, figure2)

                putPixel(xCenter + y, yCenter + x, figure)
                putPixel(xCenter + y - 1, yCenter + x, figure2)
                putPixel(xCenter - y, yCenter + x, figure)
                putPixel(xCenter - y + 1, yCenter + x, figure2)

                putPixel(xCenter + y, yCenter - x, figure)
                putPixel(xCenter + y - 1, yCenter - x, figure2)

                putPixel(xCenter - y, yCenter - x, figure)
                putPixel(xCenter - y + 1, yCenter - x, figure2)

            }
            figuresFile.push(figure);

        }

        function WuLine(x1, y1, x2, y2) {
            let figure = { x1: x1, y1: y1, x2: x2, y2: y2, color: [166, 208, 221, 255], t: "l", g: 1 };
            let figure2 = { x1: x1, y1: y1, x2: x2, y2: y2, color: [108, 155, 207, 255], t: "l", g: 1 };
            //rgb(108, 155, 207)
            console.log(`WUUUU ${x1}, y1, x2, y2}`);


            let ycase = (x1, y1, x2, y2) => {
                let xs = x1
                let ys = y1

                const dx = x2 - x1;
                const dy = y2 - y1;
                let m = 1;
                if (dx != 0) {
                    m = dy / dx;
                }

                while (y1 < y2) {
                    putPixel(Math.floor(x1), y1, figure);
                    putPixel(Math.floor(x1) + 1, y1, figure2);
                    x1 += m;
                    y1 += 1;
                }


            }


            let xcase = (x1, y1, x2, y2) => {
                let xs = x1
                let ys = y1

                const dx = x2 - x1;
                const dy = y2 - y1;
                let m = 1;
                if (dx != 0) {
                    m = dy / dx;
                }

                while (x1 < x2) {
                    putPixel(x1, Math.floor(y1), figure);
                    putPixel(x1, Math.floor(y1) + 1, figure2);
                    y1 += m;
                    x1 += 1;
                }
            }


            if (Math.abs(y2 - y1) < Math.abs(x2 - x1)) {
                if (x1 > x2) {
                    xcase(x2, y2, x1, y1);
                }

                else {
                    xcase(x1, y1, x2, y2);
                }
            } else {
                if (y1 > y2) {
                    ycase(x2, y2, x1, y1)
                }

                else {
                    ycase(x1, y1, x2, y2)
                }

            }
            figuresFile.push(figure);



            // let xs = x1
            // let ys = y1
            // // let xf = x2
            // // let yf = y2


            // const dx = x2 - x1;
            // const dy = y2 - y1;
            // let m = 1;
            // if (dx != 0) {
            //     m = dy / dx;
            // }

            // while (x1 < x2) {
            //     putPixel(x1, Math.floor(y1),figure);
            //     putPixel(x1, Math.floor(y1) + 1,figure);
            //     y1 += m;
            //     x1 += 1;
            // }
            // x1 = xs;
            // y1 = ys;
            // while (y1 < y2) {
            //     putPixel(Math.floor(x1), y1,figure);
            //     putPixel(Math.floor(x1) + 1, y1, figure);
            //     x1 += m;
            //     y1 += 1;
            // }


        }

        function MidpointCircle(xCenter, yCenter, radius, color, g = 5) {
            let figure = color.toString() === [0, 0, 0, 0].toString() ? 0 : { xCenter: xCenter, yCenter: yCenter, radius: radius, color: color, t: "c" };

            let dE = 3
            let dSE = 5 - 2 * radius
            let d = 1 - radius
            let u = 0
            let v = Math.round(radius);
            let thic = g;
            while (v > u) {
                if (d < 0) {
                    d += dE
                    dSE += 2
                }
                else {
                    d += dSE
                    dSE += 4
                    v -= 1
                }
                // putPixel(xf, yf, x1, y1, x2, y2, color, "l");
                putPixel(xCenter + u, yCenter + v, figure)
                putPixel(xCenter - u, yCenter + v, figure)
                putPixel(xCenter + u, yCenter - v, figure)
                putPixel(xCenter - u, yCenter - v, figure)

                putPixel(xCenter + v, yCenter + u, figure)
                putPixel(xCenter - v, yCenter + u, figure)
                putPixel(xCenter + v, yCenter - u, figure)
                putPixel(xCenter - v, yCenter - u, figure)

                g--;
                while (g > 0) {
                    //  putPixel(xf, yf+g, figure);
                    putPixel(xCenter + u, yCenter + v + g, figure)
                    putPixel(xCenter - u, yCenter + v + g, figure)
                    putPixel(xCenter + u, yCenter - v + g, figure)
                    putPixel(xCenter - u, yCenter - v + g, figure)



                    putPixel(xCenter + v, yCenter + u + g, figure)
                    putPixel(xCenter - v, yCenter + u + g, figure)
                    putPixel(xCenter + v, yCenter - u + g, figure)
                    putPixel(xCenter - v, yCenter - u + g, figure)

                    g = g - 2;
                }
                g = thic;


                dE += 2
                u += 1
            }
            figuresFile.push(figure);

        }


        function MidpointCircle2(xCenter, yCenter, radius, color, g = 5, a, b, c) {
            let figure = color.toString() === [0, 0, 0, 0].toString() ? 0 : { xCenter: xCenter, yCenter: yCenter, radius: radius, color: color, t: "c" };

            let dE = 3
            let dSE = 5 - 2 * radius
            let d = 1 - radius
            let u = 0
            let v = Math.round(radius);
            let thic = g;
            while (v > u) {
                if (d < 0) {
                    d += dE
                    dSE += 2
                }
                else {
                    d += dSE
                    dSE += 4
                    v -= 1
                }
                const det = a.x * b.y - a.x * c.y - a.y * b.x + a.y * c.x + b.x * c.y - b.y * c.x
                console.log(det);
                // putPixel(xf, yf, x1, y1, x2, y2, color, "l");

                //    let det2= a.x * b.y - a.x * d.y - a.y * b.x + a.y * d.x + b.x * d.y - b.y * d.x
                //    let det3 = a.x * b.y - a.x * c.y - a.y * b.x + a.y * c.x + b.x * c.y - b.y * c.x
                let cases = 0;
                if (det > 0) {
                    cases = 1;
                }
                else {
                    cases = 2;
                }
                //putPixel(xCenter + u, yCenter + v, figure)
                putPixel2(xCenter + u, yCenter + v, figure, cases, a, b, c, { x: xCenter + u, y: yCenter + v })

                //putPixel(xCenter - u, yCenter + v, figure)
                putPixel2(xCenter - u, yCenter + v, figure, cases, a, b, c, { x: xCenter - u, y: yCenter + v })

                // putPixel(xCenter + u, yCenter - v, figure)
                putPixel2(xCenter + u, yCenter - v, figure, cases, a, b, c, { x: xCenter + u, y: yCenter - v })

                //  putPixel(xCenter - u, yCenter - v, figure)
                putPixel2(xCenter - u, yCenter - v, figure, cases, a, b, c, { x: xCenter - u, y: yCenter - v })

                //   putPixel(xCenter + v, yCenter + u, figure)
                putPixel2(xCenter + v, yCenter + u, figure, cases, a, b, c, { x: xCenter + v, y: yCenter + u })

                // putPixel(xCenter - v, yCenter + u, figure)
                putPixel2(xCenter - v, yCenter + u, figure, cases, a, b, c, { x: xCenter - v, y: yCenter + u })

                //  putPixel(xCenter + v, yCenter - u, figure)
                putPixel2(xCenter + v, yCenter - u, figure, cases, a, b, c, { x: xCenter + v, y: yCenter - u })

                //putPixel(xCenter - v, yCenter - u, figure)
                putPixel2(xCenter - v, yCenter - u, figure, cases, a, b, c, { x: xCenter - v, y: yCenter - u })





                dE += 2
                u += 1
            }
            figuresFile.push(figure);

        }


        function Closefigure2hePolygon(vertices) {
            const init = vertices[0];
            const end = vertices[vertices.length - 1];
            console.log(`${init.x} ${init.y} ${end.x}`);
            let distance = Math.sqrt((init.x - end.x) ** 2 + (init.y - end.y) ** 2);

            console.log(distance);
            console.log(distance < 400 ? true : false);
            return distance < 25 ? true : false;
        }

        function handleMouseMove(event) {
            const rect = canvas.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            //console.log(`Mouse move: (${x}, ${y})`);

        }

        function handleClick(event) {
            const rect = canvas.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;



            if (instrument == "line") {
                vertices.push({ x: Math.round(x), y: Math.round(y) })
                console.log(vertices);
                if (vertices.length >= 2) {


                    if (checked) WuLine(vertices[0].x, vertices[0].y, vertices[1].x, vertices[1].y);
                    SymmetricLine(vertices[0].x, vertices[0].y, vertices[1].x, vertices[1].y, colors.blue, thic);
                    ctx.putImageData(imageData, 0, 0);
                    vertices = [];
                    return;
                }


            }

            if (instrument == "pizza") {
                vertices.push({ x: Math.round(x), y: Math.round(y) })
                console.log(vertices);
                if (vertices.length >= 3) {

                    SymmetricLine(vertices[0].x, vertices[0].y, vertices[1].x, vertices[1].y, colors.blue, thic);
                    const distanceab = Math.sqrt((vertices[0].x - vertices[1].x) ** 2 + (vertices[0].y - vertices[1].y) ** 2);
                    let distanceac = Math.sqrt((vertices[0].x - vertices[2].x) ** 2 + (vertices[0].y - vertices[2].y) ** 2);
                    console.log(vertices[2])
                    console.log(distanceab)
                    console.log(distanceac)
                    vertices[2] = {
                        x: Math.round(
                            // vertices[2].x * (distanceab / distanceac)
                            vertices[0].x + vertices[2].x * (distanceab / distanceac)
                        ),
                        y: Math.round(
                            // vertices[2].y * (distanceab / distanceac)
                            vertices[0].y + vertices[2].y * (distanceab / distanceac)
                        ),
                    }
                    console.log(vertices[2])
                    distanceac = Math.sqrt((vertices[0].x - vertices[2].y) ** 2 + (vertices[0].y - vertices[2].y) ** 2);
                    console.log(distanceac);
                    SymmetricLine(vertices[0].x, vertices[0].y, vertices[2].x, vertices[2].y, colors.blue, thic);
                    MidpointCircle2(vertices[0].x, vertices[0].y, distanceab, colors.green, 1, vertices[0], vertices[1], vertices[2])

                    //SymmetricLine(vertices[0].x, vertices[0].y, vertices[2].x, vertices[2].y, colors.red, thic);
                    // SymmetricLine(vertices[0].x, vertices[0].y, vertices[1].x, vertices[1].y, colors.blue, thic);
                    ctx.putImageData(imageData, 0, 0);
                    vertices = [];
                    return;
                }
            }


            else if (instrument == "circunference") {
                vertices.push({ x: Math.round(x), y: Math.round(y) })
                if (vertices.length >= 2) {
                    const dx = vertices[1].x - vertices[0].x;
                    const dy = vertices[1].y - vertices[0].y;
                    let radius = Math.sqrt(dx * dx + dy * dy);

                    if (checked) WUCircle(vertices[0].x, vertices[0].y, radius)
                    MidpointCircle(vertices[0].x, vertices[0].y, radius, colors.green, thic)

                    //MidpointCircle(0, 100, colors.green)
                    ctx.putImageData(imageData, 0, 0);
                    vertices = [];
                    return;
                }
            }

            else if (instrument == "radius") {
                vertices.push({ x: Math.round(x), y: Math.round(y) })
                const there = getObject(Math.round(x), Math.round(y))
                console.log(vertices);
                if (vertices.length >= 2) {

                    const dxx = vertices[1].x - vertices[0].x;
                    const dyy = vertices[1].y - vertices[0].y;
                    let radiuss = Math.sqrt(dxx * dxx + dyy * dyy);

                    if (there != 0) {
                        MidpointCircle(there.xCenter, there.yCenter, there.radius, colors.clear ,there.g);

                        MidpointCircle(there.xCenter, there.yCenter, radiuss, colors.red, there.g)
                    }

                    //MidpointCircle(0, 100, colors.green)
                    ctx.putImageData(imageData, 0, 0);
                    vertices = [];
                }
            }


            else if (instrument == "delete") {
                const there = getObject(Math.round(x), Math.round(y))
                console.log(there);
                if (there != 0) {


                    switch (there.t) {
                        case "l":
                            SymmetricLine(there.x1, there.y1, there.x2, there.y2, colors.clear, there.g);
                            break;
                        case "c":
                            MidpointCircle(there.xCenter, there.yCenter, there.radius, colors.clear,there.g);
                            break;

                        case "p":
                            while (there.v.length > 1) {
                                console.log(there);
                                SymmetricLine(there.v[0].x, there.v[0].y, there.v[1].x, there.v[1].y, colors.clear, there.g);
                                there.v.splice(0, 1);
                            }



                            break;
                        default:
                            console.log("NO figure2YPE");
                    }

                    ctx.putImageData(imageData, 0, 0);
                } else {
                    console.log("figure2here is nothing there")
                }

            }
            else if (instrument == "move") {
                const there = getObject(Math.round(x), Math.round(y))
                console.log(there);
                vertices.push({ x: Math.round(x), y: Math.round(y) })
                console.log(vertices);

                if (there != 0) {



                    switch (there.t) {
                        case "l":
                            const distance1 = Math.sqrt((there.x1 - vertices[0].x) ** 2 + (there.y1 - vertices[0].y) ** 2);
                            const distance2 = Math.sqrt((there.x2 - vertices[0].x) ** 2 + (there.y2 - vertices[0].y) ** 2);
                            console.log(`move ${distance1} ${distance2}`)
                            SymmetricLine(there.x1, there.y1, there.x2, there.y2, colors.clear);
                            if (distance2 <= distance1) {
                                SymmetricLine(there.x1, there.y1, vertices[0].x, vertices[0].y, colors.green, there.g);
                            }
                            else {
                                SymmetricLine(vertices[0].x, vertices[0].y, there.x2, there.y2, colors.green, there.g);
                            }

                            break;
                        case "c":
                            if (vertices.length >= 2) {
                                MidpointCircle(there.xCenter, there.yCenter, there.radius, colors.clear);
                                MidpointCircle(vertices[0].x, vertices[0].y, there.radius, colors.blue);
                                vertices = [];
                            }

                            break;
                        default:
                            console.log("NO figure2YPE");
                    }


                    // vertices.push({ x: Math.round(x), y: Math.round(y) })
                    // SymmetricLine(0, 0, vertices[1].x, vertices[1].y, colors.blue);
                    // SymmetricLine(there.x1, there.y1, there.x2, there.y2, colors.clear);

                    ctx.putImageData(imageData, 0, 0);
                    vertices = [];
                } else {
                    console.log("figure2here is nothing there");
                }


            }
            else if (instrument == "poly") {
                vertices.push({ x: Math.round(x), y: Math.round(y) })
                console.log(vertices);

                if (vertices.length >= 2) {
                    let V = vertices.length;
                    if (!Closefigure2hePolygon(vertices)) {
                        SymmetricLine(vertices[V - 2].x, vertices[V - 2].y, vertices[V - 1].x, vertices[V - 1].y, colors.red, thic, "p", vertices);
                    } else {
                        SymmetricLine(vertices[V - 2].x, vertices[V - 2].y, vertices[0].x, vertices[0].y, colors.blue, thic, "p", vertices);
                        vertices = [];
                    }

                    ctx.putImageData(imageData, 0, 0);
                }
            } else if (instrument == "draw") {

                console.log(figuresFile);
                figuresFile.forEach((f) => {
                    console.log(f);
                    switch (f.t) {
                        case "l":
                            SymmetricLine(f.x1, f.y1, f.x2, f.y2, f.color, f.g);
                            break;
                        case "c":
                            MidpointCircle(f.xCenter, f.yCenter, f.radius, f.color);
                            break;
                        default:
                            console.log("NO figure2YPE");
                    }
                })

                ctx.putImageData(imageData, 0, 0);
            }

            // else if(checked&& instrument=="mouse"){
            //     console.log("Wu");
            //     figuresFile.forEach(f=>{
            //         if(f.t=="l"){
            //             console.log(f.t);
            //             WuLine(f.x1,f.y1,f.x2,f.y2);
            //         }

            //     }
            //     );
            //     ctx.putImageData(imageData, 0, 0);
            // }

        }
        //canvas.addEventListener('mousemove', handleMouseMove);
        canvas.addEventListener('mousedown', handleClick);

        return () => {
            //   canvas.removeEventListener('mousemove', handleMouseMove);
            canvas.removeEventListener('mousedown', handleClick);
        };




    }, [instrument, thic, checked]);

    return <div >
        <Vectors downloadImage={downloadImage}
            setInstrument={changeInstrument}
            SaveFigures={SaveFigures}
            handleFileUpload={handleFileUpload}
            setfigure2ip={setfigure2ip}
            setOpen={setOpen}
            checked={checked}
            handleChecked={handleChecked}

            thic={thic}
            setThic={setThic}


        ></Vectors>
        <canvas ref={canvasRef}
            width="1000"
            height="600"

            style={{
                borderStyle: "dashed",
                borderColor: "grey"
            }} />
    </div>;
}



function SimpleSnackbar({ open, setOpen, tip }) {


    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };

    const action = (
        <React.Fragment>
            <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={handleClose}
            >
                <CloseIcon fontSize="small" />
            </IconButton>
        </React.Fragment>
    );

    return (
        <div>
            <Snackbar
                open={open}
                autoHideDuration={6000}
                onClose={handleClose}
                message={tip}
                action={action}
            />
        </div>
    );
}


export default function Liezno() {

    const [open, setOpen] = useState(false);
    const [tip, setfigure2ip] = useState("No figure2ips");

    return (<div>
        <SimpleSnackbar setOpen={setOpen} open={open} tip={tip}> </SimpleSnackbar>
        <Canvas setOpen={setOpen} setfigure2ip={setfigure2ip} />
    </div>);
}
