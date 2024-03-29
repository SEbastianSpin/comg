#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]
use image::{
    open, DynamicImage, GenericImage, GenericImageView, ImageBuffer, Pixel, Rgb, RgbImage,
};
use std::thread;

use rand::Rng;
use serde_json;
use std::fs::File;
use std::io::Write;

// Learn more about Tauri commands at htrps://tauri.app/v1/guides/features/command
// #[tauri::command]
// fn import() {
//     println!("dimensions {:?}", pic.dimensions());
// }

#[tauri::command]
fn send_array_to_rust(filename: String, grid: Vec<Vec<i32>>) -> bool {
    println!("{:?}", grid);
    println!("file name {}", filename);

    let json = serde_json::to_string(&grid).unwrap();
    let filterName = format!("{}{}", "C:\\Users\\Sebastian\\Pictures\\", filename);
    let mut file = File::create(filterName + ".json").unwrap();
    file.write_all(json.as_bytes()).unwrap();

    let toFronted = format!(
        "{}{}{}",
        "C:\\Users\\Sebastian\\Documents\\SebasLab\\comg\\src\\assets\\plant\\", filename, ".json"
    );
    let mut file2 = File::create(toFronted).unwrap();
    file2.write_all(json.as_bytes()).unwrap();

    true.into()
}

#[tauri::command]
fn apply_in_rust(filename: String, grid: Vec<Vec<i32>>, div: u8, o: i32) -> bool {
    println!("{:?}", grid);

    let original = format!("{}{}", "C:\\Users\\Sebastian\\Pictures\\", filename);
    let original2 = format!("{}{}", "C:\\Users\\Sebastian\\Pictures\\", filename);
    let mut rgba = open(original).unwrap().into_rgba8();
    let mut rgba2 = open(original2).unwrap().into_rgba8();
    let (width, height) = rgba.dimensions();
    let coloff = ((-0.5) * (grid.len() as f32) + 0.5) as i32;
    let rowoff = ((-0.5) * (grid[0].len() as f32) + 0.5) as i32;

    println!(
        "file name {} size {} {} divisor {} filter size {} x {} offset {}",
        filename,
        width,
        height,
        div,
        grid.len(),
        grid[0].len(),
        o
    );
    println!("offset c {} offset r {}", coloff, rowoff);
    for x in 0..width {
        for y in 0..height {
            let p = *rgba2.get_pixel(x, y);
            let rgba_val = p.channels();

            let mut red: i32 = 0;
            let mut green: i32 = 0;
            let mut blue: i32 = 0;
            let mut divisor: i32 = 0;

            for xoff in coloff..-coloff + 1 {
                for yoff in rowoff..-rowoff + 1 {
                    let xin = x as i32 + xoff;
                    let yin = y as i32 + yoff;
                    let xgrid: usize = (xoff - coloff) as usize;
                    let ygrid: usize = (yoff - rowoff) as usize;

                    if xin < 0 || xin >= width as i32 || yin < 0 || yin >= height as i32 {
                        continue;
                    } else {
                        let pp = *rgba2.get_pixel(xin as u32, yin as u32);
                        let rgba_val2 = pp.channels();
                        divisor += grid[xgrid][ygrid];
                        red += (rgba_val2[0] as i32) * grid[xgrid][ygrid];
                        green += (rgba_val2[1] as i32) * grid[xgrid][ygrid];
                        blue += (rgba_val2[2] as i32) * grid[xgrid][ygrid];
                    }
                }
            }
            if divisor == 0 {
                divisor = 1;
            }
            let mut nred: u8 = (o + (red / divisor)) as u8;
            let mut ngreen: u8 = (o + (green / divisor)) as u8;
            let mut nblue: u8 = (o + (blue / divisor)) as u8;
            let np = image::Rgba([nred, ngreen, nblue, rgba_val[3]]);
            rgba.put_pixel(x, y, np);
        }
    }

    let modified =
        "C:\\Users\\Sebastian\\Documents\\SebasLab\\comg\\src\\assets\\plant\\modified.png";

    let modified2 = "C:\\Users\\Sebastian\\Pictures\\modified.png";
    rgba.save(modified2).unwrap();
    rgba.save(modified).unwrap();
    println!("DONE");

    true.into()
}

#[tauri::command]
fn inverse(filename: String) -> bool {
    use image::Pixel;
    let original = format!("{}{}", "C:\\Users\\Sebastian\\Pictures\\", filename);
    let mut rgba = open(original).unwrap().into_rgba8();
    let (width, height) = rgba.dimensions();
    println!("{} {}", width, height);
    for x in 0..width {
        for y in 0..height {
            let mut p = *rgba.get_pixel(x, y);
            //  p.invert();
            let mut inverted_pixel = p.channels();
            // inverted_pixel[0]=255-inverted_pixel[0];
            // inverted_pixel[1]=255-inverted_pixel[1];
            // inverted_pixel[2]=255-inverted_pixel[2];
            let np = image::Rgba([
                255 - inverted_pixel[0],
                255 - inverted_pixel[1],
                255 - inverted_pixel[2],
                inverted_pixel[3],
            ]);

            // println!("{:?}", p.channels());
            rgba.put_pixel(x, y, np);
        }
    }
    let modified =
        "C:\\Users\\Sebastian\\Documents\\SebasLab\\comg\\src\\assets\\plant\\modified.png";
    let modified2 = "C:\\Users\\Sebastian\\Pictures\\modified.png";
    rgba.save(modified2).unwrap();
    rgba.save(modified).unwrap();
    true.into()
}

#[tauri::command]
fn contrast(filename: String, val: u8) -> bool {
    use image::Pixel;
    let original = format!("{}{}", "C:\\Users\\Sebastian\\Pictures\\", filename);
    let mut rgba = open(original).unwrap().into_rgba8();
    let (width, height) = rgba.dimensions();
    println!("{} {}", width, height);
    for x in 0..width {
        for y in 0..height {
            let mut p = *rgba.get_pixel(x, y);
            let rgba_val = p.channels();
            let mut bri0: u8 = rgba_val[0];
            let mut bri1: u8 = rgba_val[1];
            let mut bri2: u8 = rgba_val[2];

            if rgba_val[0] < 127 {
                bri0 = (bri0 as f32 * 1.19) as u8;
            }
            if (rgba_val[1] < 127) {
                bri1 = (bri1 as f32 * 1.19) as u8;
            }

            if (rgba_val[2] < 127) {
                bri2 = (bri2 as f32 * 1.19) as u8;
            }
            if (rgba_val[0] > 127) {
                bri0 = (bri0 as f32 * 0.84) as u8;
            }
            if (rgba_val[1] > 127) {
                bri1 = (bri1 as f32 * 0.84) as u8;
            }

            if (rgba_val[2] > 127) {
                bri2 = (bri2 as f32 * 0.84) as u8;
            }

            if (rgba_val[0] < 40) {
                bri0 = 0;
            }
            if (rgba_val[1] < 40) {
                bri1 = 0;
            }
            if (rgba_val[2] < 40) {
                bri2 = 0;
            }

            if rgba_val[0] > 215 {
                bri0 = 215;
            }
            if rgba_val[1] > 215 {
                bri1 = 215;
            }
            if rgba_val[2] > 215 {
                bri2 = 215;
            }

            let np = image::Rgba([bri0, bri1, bri2, rgba_val[3]]);

            // println!("{:?}", p.channels());
            rgba.put_pixel(x, y, np);
        }
    }
    let modified =
        "C:\\Users\\Sebastian\\Documents\\SebasLab\\comg\\src\\assets\\plant\\modified.png";
    let modified2 = "C:\\Users\\Sebastian\\Pictures\\modified.png";
    rgba.save(modified2).unwrap();
    rgba.save(modified).unwrap();
    true.into()
}

#[tauri::command]
fn bright1(filename: String, val: u8) -> bool {
    use image::Pixel;
    let original = format!("{}{}", "C:\\Users\\Sebastian\\Pictures\\", filename);
    let mut rgba = open(original).unwrap().into_rgba8();
    let (width, height) = rgba.dimensions();
    println!("{} {}", width, height);
    for x in 0..width {
        for y in 0..height {
            let mut p = *rgba.get_pixel(x, y);
            let rgba_val = p.channels();
            let mut bri0: u8 = rgba_val[0];
            let mut bri1: u8 = rgba_val[1];
            let mut bri2: u8 = rgba_val[2];

            if (rgba_val[0] > 39 && rgba_val[0] < 216) {
                bri0 = (bri0 as f32 * 0.95) as u8;
            }
            if (rgba_val[1] > 39 && rgba_val[1] < 216) {
                bri1 = (bri1 as f32 * 0.95) as u8;
            }
            if (rgba_val[2] > 39 && rgba_val[2] < 216) {
                bri2 = (bri2 as f32 * 0.95) as u8;
            }

            bri0 = rgba_val[0] - std::cmp::min(rgba_val[0], val);
            bri1 = rgba_val[1] - std::cmp::min(rgba_val[1], val);
            bri2 = rgba_val[2] - std::cmp::min(rgba_val[2], val);

            if (rgba_val[0] < 40) {
                bri0 = 0;
            }
            if (rgba_val[1] < 40) {
                bri1 = 0;
            }
            if (rgba_val[2] < 40) {
                bri2 = 0;
            }

            if rgba_val[0] > 215 {
                bri0 = 255;
            }
            if rgba_val[1] > 215 {
                bri1 = 255;
            }
            if rgba_val[2] > 215 {
                bri2 = 255;
            }

            let np = image::Rgba([bri0, bri1, bri2, rgba_val[3]]);

            // println!("{:?}", p.channels());
            rgba.put_pixel(x, y, np);
        }
    }
    let modified =
        "C:\\Users\\Sebastian\\Documents\\SebasLab\\comg\\src\\assets\\plant\\modified.png";
    let modified2 = "C:\\Users\\Sebastian\\Pictures\\modified.png";
    rgba.save(modified2).unwrap();
    rgba.save(modified).unwrap();
    true.into()
}

#[tauri::command]
fn gamma(filename: String, val: u8) -> bool {
    use image::Pixel;
    let original = format!("{}{}", "C:\\Users\\Sebastian\\Pictures\\", filename);
    let mut rgba = open(original).unwrap().into_rgba8();
    let (width, height) = rgba.dimensions();
    println!("{} {}", width, height);
    for x in 0..width {
        for y in 0..height {
            let mut p = *rgba.get_pixel(x, y);
            let rgba_val = p.channels();
            let mut bri0: u8 = ((rgba_val[0] as f32).powf(0.98)) as u8;
            let mut bri1: u8 = ((rgba_val[1] as f32).powf(0.98)) as u8;
            let mut bri2: u8 = ((rgba_val[2] as f32).powf(0.98)) as u8;
            // println!("{} {}", bri0, rgba_val[0]);
            let np = image::Rgba([bri0, bri1, bri2, rgba_val[3]]);

            rgba.put_pixel(x, y, np);
        }
    }
    let modified =
        "C:\\Users\\Sebastian\\Documents\\SebasLab\\comg\\src\\assets\\plant\\modified.png";
    let modified2 = "C:\\Users\\Sebastian\\Pictures\\modified.png";
    rgba.save(modified2).unwrap();
    rgba.save(modified).unwrap();
    true.into()
}

#[tauri::command]
fn blur(filename: String, val: u8) -> bool {
    use image::Pixel;
    let original = format!("{}{}", "C:\\Users\\Sebastian\\Pictures\\", filename);
    let original2 = format!("{}{}", "C:\\Users\\Sebastian\\Pictures\\", filename);
    let mut rgba = open(original).unwrap().into_rgba8();
    let mut rgba2 = open(original2).unwrap().into_rgba8();
    let (width, height) = rgba.dimensions();
    println!("IMG SIZE: {} {}", width, height);

    for x in 0..width {
        for y in 0..height {
            let p = *rgba2.get_pixel(x, y);
            let rgba_val = p.channels();

            let mut red: u8 = 0;
            let mut green: u8 = 0;
            let mut blue: u8 = 0;
            for xoff in -1..2 {
                for yoff in -1..2 {
                    let xin = x as i32 + xoff;
                    let yin = y as i32 + yoff;

                    if xin < 0 || xin >= width as i32 || yin < 0 || yin >= height as i32 {
                        continue;
                    } else {
                        let pp = *rgba2.get_pixel(xin as u32, yin as u32);
                        let rgba_val2 = pp.channels();

                        if (x == 0 && y == 0)
                            || x == width - 1 && y == height - 1
                            || x == width - 1 && y == 0
                            || x == 0 && y == height - 1
                        {
                            red += (rgba_val2[0] as f32 / 4.0) as u8;
                            green += (rgba_val2[1] as f32 / 4.0) as u8;
                            blue += (rgba_val2[2] as f32 / 4.0) as u8;
                        } else if x == 0 || y == 0 || x == width - 1 || y == height - 1 {
                            red += (rgba_val2[0] as f32 / 6.0) as u8;
                            green += (rgba_val2[1] as f32 / 6.0) as u8;
                            blue += (rgba_val2[2] as f32 / 6.0) as u8;
                        } else {
                            red += (rgba_val2[0] as f32 / 9.0) as u8;
                            green += (rgba_val2[1] as f32 / 9.0) as u8;
                            blue += (rgba_val2[2] as f32 / 9.0) as u8;
                        }
                    }
                }
            }

            let np = image::Rgba([red, green, blue, rgba_val[3]]);
            rgba.put_pixel(x, y, np);
        }
    }

    let modified =
        "C:\\Users\\Sebastian\\Documents\\SebasLab\\comg\\src\\assets\\plant\\modified.png";
    let modified2 = "C:\\Users\\Sebastian\\Pictures\\modified.png";
    rgba.save(modified2).unwrap();
    rgba.save(modified).unwrap();
    println!("DONE");
    true.into()
}

#[tauri::command]
fn gblur2(filename: String, val: u8) -> bool {
    use image::Pixel;
    let original = format!("{}{}", "C:\\Users\\Sebastian\\Pictures\\", filename);
    let original2 = format!("{}{}", "C:\\Users\\Sebastian\\Pictures\\", filename);
    let mut rgba = open(original).unwrap().into_rgba8();
    let mut rgba2 = open(original2).unwrap().into_rgba8();
    let (width, height) = rgba.dimensions();
    println!("IMG SIZE: {} {}", width, height);

    for x in 0..width {
        for y in 0..height {
            let p = *rgba2.get_pixel(x, y);
            let rgba_val = p.channels();

            let mut red: u32 = 0;
            let mut green: u32 = 0;
            let mut blue: u32 = 0;
            for xoff in -1..2 {
                for yoff in -1..2 {
                    let xin = x as i32 + xoff;
                    let yin = y as i32 + yoff;

                    if xin < 0 || xin >= width as i32 || yin < 0 || yin >= height as i32 {
                        continue;
                    } else {
                        let pp = *rgba2.get_pixel(xin as u32, yin as u32);
                        let rgba_val2 = pp.channels();

                        if xin == x as i32 && yin == y as i32 {
                            red += ((rgba_val2[0] as u32) * 4);
                            green += ((rgba_val2[1] as u32) * 4);
                            blue += ((rgba_val2[2] as u32) * 4);
                        } else if xin == x as i32
                            || yin == y as i32 && !(xin == x as i32 && yin == y as i32)
                        {
                            red += (rgba_val2[0] as u32) * 2;
                            green += (rgba_val2[1] as u32) * 2;
                            blue += (rgba_val2[2] as u32) * 2;
                        } else {
                            red += (rgba_val2[0] as u32);
                            green += (rgba_val2[1] as u32);
                            blue += (rgba_val2[2] as u32);
                        }
                    }
                }
            }

            if (x == 0 && y == 0)
                || x == width - 1 && y == height - 1
                || x == width - 1 && y == 0
                || x == 0 && y == height - 1
            {
                let mut nred: u8 = (red / 9) as u8;
                let mut ngreen: u8 = (green / 9) as u8;
                let mut nblue: u8 = (blue / 9) as u8;
                let np = image::Rgba([nred, ngreen, nblue, rgba_val[3]]);
                rgba.put_pixel(x, y, np);
            } else if x == 0 || y == 0 || x == width - 1 || y == height - 1 {
                let mut nred: u8 = (red / 12) as u8;
                let mut ngreen: u8 = (green / 12) as u8;
                let mut nblue: u8 = (blue / 12) as u8;
                let np = image::Rgba([nred, ngreen, nblue, rgba_val[3]]);
                rgba.put_pixel(x, y, np);
            } else {
                let mut nred: u8 = (red / 16) as u8;
                let mut ngreen: u8 = (green / 16) as u8;
                let mut nblue: u8 = (blue / 16) as u8;
                let np = image::Rgba([nred, ngreen, nblue, rgba_val[3]]);
                rgba.put_pixel(x, y, np);
            }
        }
    }

    let modified =
        "C:\\Users\\Sebastian\\Documents\\SebasLab\\comg\\src\\assets\\plant\\modified.png";
    let modified2 = "C:\\Users\\Sebastian\\Pictures\\modified.png";
    rgba.save(modified2).unwrap();
    rgba.save(modified).unwrap();
    println!("DONE");
    true.into()
}

#[tauri::command]
fn sharp(filename: String, val: u8) -> bool {
    use image::Pixel;
    let original = format!("{}{}", "C:\\Users\\Sebastian\\Pictures\\", filename);
    let original2 = format!("{}{}", "C:\\Users\\Sebastian\\Pictures\\", filename);
    let mut rgba = open(original).unwrap().into_rgba8();
    let mut rgba2 = open(original2).unwrap().into_rgba8();
    let (width, height) = rgba.dimensions();
    println!("IMG SIZE: {} {}", width, height);

    for x in 0..width {
        for y in 0..height {
            let p = *rgba2.get_pixel(x, y);
            let rgba_val = p.channels();

            let mut red: i32 = 0;
            let mut green: i32 = 0;
            let mut blue: i32 = 0;
            for xoff in -1..2 {
                for yoff in -1..2 {
                    let xin = x as i32 + xoff;
                    let yin = y as i32 + yoff;

                    if xin < 0 || xin >= width as i32 || yin < 0 || yin >= height as i32 {
                        continue;
                    } else {
                        let pp = *rgba2.get_pixel(xin as u32, yin as u32);
                        let rgba_val2 = pp.channels();

                        if xin == x as i32 && yin == y as i32 {
                            red += ((rgba_val2[0] as i32) * 9);
                            green += ((rgba_val2[1] as i32) * 9);
                            blue += ((rgba_val2[2] as i32) * 9);
                        } else if xin == x as i32
                            || yin == y as i32 && !(xin == x as i32 && yin == y as i32)
                        {
                            red += (rgba_val2[0] as i32) * -1;
                            green += (rgba_val2[1] as i32) * -1;
                            blue += (rgba_val2[2] as i32) * -1;
                        } else {
                            red += (rgba_val2[0] as i32) * -1;
                            green += (rgba_val2[1] as i32) * -1;
                            blue += (rgba_val2[2] as i32) * -1;
                        }
                    }
                }
            }

            if (x == 0 && y == 0)
                || x == width - 1 && y == height - 1
                || x == width - 1 && y == 0
                || x == 0 && y == height - 1
            {
                let mut nred: u8 = (red / 6) as u8;
                let mut ngreen: u8 = (green / 6) as u8;
                let mut nblue: u8 = (blue / 6) as u8;
                let np = image::Rgba([nred, ngreen, nblue, rgba_val[3]]);
                rgba.put_pixel(x, y, np);
            } else if x == 0 || y == 0 || x == width - 1 || y == height - 1 {
                let mut nred: u8 = (red / 3) as u8;
                let mut ngreen: u8 = (green / 3) as u8;
                let mut nblue: u8 = (blue / 3) as u8;
                let np = image::Rgba([nred, ngreen, nblue, rgba_val[3]]);
                rgba.put_pixel(x, y, np);
            } else {
                let mut nred: u8 = (red) as u8;
                let mut ngreen: u8 = (green) as u8;
                let mut nblue: u8 = (blue) as u8;
                let np = image::Rgba([nred, ngreen, nblue, rgba_val[3]]);
                rgba.put_pixel(x, y, np);
            }
        }
    }

    let modified =
        "C:\\Users\\Sebastian\\Documents\\SebasLab\\comg\\src\\assets\\plant\\modified.png";
    let modified2 = "C:\\Users\\Sebastian\\Pictures\\modified.png";
    rgba.save(modified2).unwrap();
    rgba.save(modified).unwrap();
    println!("DONE");
    true.into()
}

#[tauri::command]
fn edge_horizontal(filename: String, val: u8) -> bool {
    use image::Pixel;
    let original = format!("{}{}", "C:\\Users\\Sebastian\\Pictures\\", filename);
    let original2 = format!("{}{}", "C:\\Users\\Sebastian\\Pictures\\", filename);
    let mut rgba = open(original).unwrap().into_rgba8();
    let mut rgba2 = open(original2).unwrap().into_rgba8();
    let (width, height) = rgba.dimensions();
    println!("{} {}", width, height);
    for x in 2..width - 1 {
        for y in 2..height - 1 {
            let p = *rgba.get_pixel(x, y);
            let pabove = *rgba2.get_pixel(x, y - 1);
            let rgba_val = p.channels();
            let rgba_val2 = pabove.channels();

            let mut red: i16 = (rgba_val[0] as i16) - (rgba_val2[0] as i16);
            let mut green: i16 = (rgba_val[1] as i16) - (rgba_val2[1] as i16);
            let mut blue: i16 = (rgba_val[2] as i16) - (rgba_val2[2] as i16);

            let mut nred: u8 = (red) as u8;
            let mut ngreen: u8 = (green) as u8;
            let mut nblue: u8 = (blue) as u8;

            let np = image::Rgba([nred, ngreen, nblue, rgba_val[3]]);

            rgba.put_pixel(x, y, np);
        }
    }
    let modified =
        "C:\\Users\\Sebastian\\Documents\\SebasLab\\comg\\src\\assets\\plant\\modified.png";
    let modified2 = "C:\\Users\\Sebastian\\Pictures\\modified.png";
    rgba.save(modified2).unwrap();
    rgba.save(modified).unwrap();
    println!("DONE");
    true.into()
}

#[tauri::command]
fn median(filename: String, val: u8) -> bool {
    use image::Pixel;
    let original = format!("{}{}", "C:\\Users\\Sebastian\\Pictures\\", filename);
    let original2 = format!("{}{}", "C:\\Users\\Sebastian\\Pictures\\", filename);
    let mut rgba = open(original).unwrap().into_rgba8();
    let mut rgba2 = open(original2).unwrap().into_rgba8();
    let (width, height) = rgba.dimensions();
    println!("IMG SIZE: {} {}", width, height);

    for x in 0..width {
        for y in 0..height {
            let p = *rgba2.get_pixel(x, y);
            let rgba_val = p.channels();

            let mut red: u32 = 0;
            let mut green: u32 = 0;
            let mut blue: u32 = 0;

            let mut redvec = Vec::new();
            let mut greenvec = Vec::new();
            let mut bluevec = Vec::new();

            for xoff in -1..2 {
                for yoff in -1..2 {
                    let xin = x as i32 + xoff;
                    let yin = y as i32 + yoff;

                    if xin < 0 || xin >= width as i32 || yin < 0 || yin >= height as i32 {
                        continue;
                    } else {
                        let pp = *rgba2.get_pixel(xin as u32, yin as u32);
                        let rgba_val2 = pp.channels();
                        redvec.push(rgba_val2[0]);
                        greenvec.push(rgba_val2[1]);
                        bluevec.push(rgba_val2[2]);
                    }
                }
            }

            redvec.sort();
            let midr = redvec.len() / 2;

            bluevec.sort();
            let midb = bluevec.len() / 2;

            greenvec.sort();
            let midg = bluevec.len() / 2;

            let mut nred: u8 = (red / 16) as u8;
            let mut ngreen: u8 = (green / 16) as u8;
            let mut nblue: u8 = (blue / 16) as u8;
            let np = image::Rgba([redvec[midr], bluevec[midb], greenvec[midg], rgba_val[3]]);
            rgba.put_pixel(x, y, np);
        }
    }

    let modified =
        "C:\\Users\\Sebastian\\Documents\\SebasLab\\comg\\src\\assets\\plant\\modified.png";
    let modified2 = "C:\\Users\\Sebastian\\Pictures\\modified.png";
    rgba.save(modified2).unwrap();
    rgba.save(modified).unwrap();
    println!("DONE");
    true.into()
}

#[tauri::command]
fn eemboss(filename: String, val: u8) -> bool {
    use image::Pixel;
    let original = format!("{}{}", "C:\\Users\\Sebastian\\Pictures\\", filename);
    let original2 = format!("{}{}", "C:\\Users\\Sebastian\\Pictures\\", filename);
    let mut rgba = open(original).unwrap().into_rgba8();
    let mut rgba2 = open(original2).unwrap().into_rgba8();
    let (width, height) = rgba.dimensions();
    println!("{} {}", width, height);
    for x in 2..width - 1 {
        for y in 2..height - 1 {
            let p = *rgba.get_pixel(x, y);
            let rgba_val = p.channels();

            let mut red: i32 = 0;
            let mut green: i32 = 0;
            let mut blue: i32 = 0;

            for xin in x - 1..x + 2 {
                for yin in y - 1..y + 2 {
                    let mut pp = *rgba2.get_pixel(xin, yin);
                    let rgba_val2 = pp.channels();
                    if xin == x && yin == y {
                        red += (rgba_val2[0] as i32);
                        green += (rgba_val2[1] as i32);
                        blue += (rgba_val2[2] as i32);
                    } else if xin == x - 1 {
                        red += (rgba_val2[0] as i32) * -1;
                        green += (rgba_val2[1] as i32) * -1;
                        blue += (rgba_val2[2] as i32) * -1;
                    } else if xin == x + 1 {
                        //
                        red += (rgba_val2[0] as i32);
                        green += (rgba_val2[1] as i32);
                        blue += (rgba_val2[2] as i32);
                    }
                }
            }
            //println!("{} {} {} ",red,green,blue);
            let mut nred: u8 = (red) as u8;
            let mut ngreen: u8 = (green) as u8;
            let mut nblue: u8 = (blue) as u8;
            //  println!("{} {} {} ",nred,ngreen,nblue);

            let np = image::Rgba([nred, ngreen, nblue, rgba_val[3]]);

            rgba.put_pixel(x, y, np);
        }
    }
    let modified =
        "C:\\Users\\Sebastian\\Documents\\SebasLab\\comg\\src\\assets\\plant\\modified.png";
    let modified2 = "C:\\Users\\Sebastian\\Pictures\\modified.png";
    rgba.save(modified2).unwrap();
    rgba.save(modified).unwrap();
    println!("DONE");
    true.into()
}

#[tauri::command]
fn thresholding(filename: String, k: u8) -> bool {
    use image::Pixel;
    let original = format!("{}{}", "C:\\Users\\Sebastian\\Pictures\\", filename);
    let original2 = format!("{}{}", "C:\\Users\\Sebastian\\Pictures\\", filename);
    let mut rgba = open(original).unwrap().into_rgba8();
    let mut rgba2 = open(original2).unwrap().into_rgba8();
    let (width, height) = rgba.dimensions();
    println!("{} {}", width, height);

    //let mut levels:Vec<u8 = Vec::new();
    let mut rng = rand::thread_rng();
    // let co = 255 / (k - 1) as u8;
    // for l in 0..k {
    //     levels.push(l * co);
    // }
    let max_level = 255u16;
    let levels = (0..k).map(|i| max_level * i as u16 / (k - 1) as u16).collect::<Vec<_>>();
    
    
    println!("levels of color {:?}    k : {}", levels, k);
    for y in 0..height {
        for x in 0..width {
            let p = *rgba.get_pixel(x, y);
            let mut rgba_val = p.channels();
         
            let mut colors = [rgba_val[0], rgba_val[1], rgba_val[2], rgba_val[3]];

            let randomtreshold = rng.gen_range(0..10);
            for i in 0..3 {
                let tt = ((rgba_val[i] as u16) * (k as u16 - 2u16)) / 255u16;
                let tr = tt as u8;
                if randomtreshold > 4 {
                    colors[i] = levels[(tr + 1) as usize] as u8
                } else {
                    colors[i] = levels[(tr) as usize] as u8
                }
            }

            let np = image::Rgba(colors);

            rgba.put_pixel(x, y, np);
        }
    }
    
    let modified =
        "C:\\Users\\Sebastian\\Documents\\SebasLab\\comg\\src\\assets\\plant\\modified.png";
    let modified2 = "C:\\Users\\Sebastian\\Pictures\\modified.png";
    rgba.save(modified2).unwrap();
    rgba.save(modified).unwrap();
    println!("DONE");
    true.into()
}

struct Color {
    r: u8,
    g: u8,
    b: u8,
}

#[tauri::command]
fn median_cut(filename: String, k: u8) -> bool {
    use image::Pixel;
    let original = format!("{}{}", "C:\\Users\\Sebastian\\Pictures\\", filename);
    let original2 = format!("{}{}", "C:\\Users\\Sebastian\\Pictures\\", filename);
    let mut rgba = open(original).unwrap().into_rgba8();
    let (width, height) = rgba.dimensions();
    println!("{} {}", width, height);

    let mut allpixels = Vec::with_capacity((width * height) as usize);
    println!(" k : {}", k);
    let (mut min_r, mut min_g, mut min_b) = (255, 255, 255);
    let (mut max_r, mut max_g, mut max_b) = (0, 0, 0);

    for x in 0..width {
        for y in 0..height {
            let p = *rgba.get_pixel(x, y);
            allpixels.push([p[0], p[1], p[2]]);

            min_r = min_r.min(p[0]);
            min_g = min_g.min(p[1]);
            min_b = min_b.min(p[2]);
            max_r = max_r.max(p[0]);
            max_g = max_g.max(p[1]);
            max_b = max_b.max(p[2]);
        }
    }

    println!("Minimum RGB values: ({}, {}, {})", min_r, min_g, min_b);
    println!("Maximum RGB values: ({}, {}, {})", max_r, max_g, max_b);

    let range_r = max_r - min_r;
    let range_g = max_g - min_g;
    let range_b = max_b - min_b;


let max_range = range_r.max(range_g).max(range_b);

let max_index = if max_range == range_r {
    0 
} else if max_range == range_g {
    1
} else {
    2
};


    for i in 0..10 {
        print!("{:?} ", allpixels[i][1]);
    }

    let mut cubes = vec![allpixels.to_vec()];

    
        print!(" max_index{:?} " ,max_index);
    
    let mut i = 1;
    //for c in 0..cubes.len() {
    let mut c = 0;
    while cubes.len() < (k - 1) as usize {
        let mut cube = cubes[c].clone();
        
        cube.sort_by(|a, b| b[max_index as usize].cmp(&a[max_index as usize]));
        let median = cube.len() / 2;
        let (mut left, right) = cube.split_at_mut(median);
        let mut median_color = right[0].clone();
        let mut lleft = left.to_vec();
        lleft.push(median_color.clone());
        right[0] = median_color;
        cubes[c] = lleft.to_vec();
        cubes.push(right.to_vec());
        c += 1;
    }

    let palette: Vec<[u8; 3]> = cubes
        .into_iter()
        .map(|cube| {
            let r = cube.iter().map(|c| c[0] as u32).sum::<u32>() / cube.len() as u32;
            let g = cube.iter().map(|c| c[1] as u32).sum::<u32>() / cube.len() as u32;
            let b = cube.iter().map(|c| c[2] as u32).sum::<u32>() / cube.len() as u32;
            [r as u8, g as u8, b as u8]
        })
        .collect();

    // for i in 0..10{
    print!("{:?} ", palette);
    // }

    let mut new_img = ImageBuffer::new(width, height);

    for x in 0..width {
        for y in 0..height {
            let p = *rgba.get_pixel(x, y);
            let pixel = p.channels();

            let closest_color = palette
                .iter()
                .min_by_key(|&c| {
                    let r_diff = c[0] as i32 - pixel[0] as i32;
                    let g_diff = c[1] as i32 - pixel[1] as i32;
                    let b_diff = c[2] as i32 - pixel[2] as i32;
                    r_diff * r_diff + g_diff * g_diff + b_diff * b_diff
                })
                .unwrap();

            // Set the new pixel value to the closest color in the palette
            let new_pixel = Rgb(*closest_color);
            new_img.put_pixel(x, y, new_pixel);
        }
    }

    let modified =
        "C:\\Users\\Sebastian\\Documents\\SebasLab\\comg\\src\\assets\\plant\\modified.png";
    let modified2 = "C:\\Users\\Sebastian\\Pictures\\modified.png";
    new_img.save(modified2).unwrap();
    new_img.save(modified).unwrap();

    println!("DONE");
    true.into()
}

#[tauri::command]
fn grey(filename: String, k: u8) -> bool {
    use image::Pixel;
    let original = format!("{}{}", "C:\\Users\\Sebastian\\Pictures\\", filename);
    let original2 = format!("{}{}", "C:\\Users\\Sebastian\\Pictures\\", filename);
    let mut rgba = open(original).unwrap().into_rgba8();
    let (width, height) = rgba.dimensions();
    println!("{} {}", width, height);

    for x in 0..width {
        for y in 0..height {
            let p = *rgba.get_pixel(x, y);

            let nb = p.to_luma();
            let np = image::Rgba([nb[0], nb[0], nb[0], 255]);

            rgba.put_pixel(x, y, np);
        }
    }

    let modified =
        "C:\\Users\\Sebastian\\Documents\\SebasLab\\comg\\src\\assets\\plant\\modified.png";
    let modified2 = "C:\\Users\\Sebastian\\Pictures\\modified.png";
    rgba.save(modified2).unwrap();
    rgba.save(modified).unwrap();
    println!("DONE");
    true.into()
}


#[tauri::command]
fn  ycb(filename: String, k: u8) -> bool {
    use image::Pixel;
    let original = format!("{}{}", "C:\\Users\\Sebastian\\Pictures\\", filename);
    let original2 = format!("{}{}", "C:\\Users\\Sebastian\\Pictures\\", filename);
    let mut rgba = open(original).unwrap().into_rgba8();
    let mut rgba2 = open(original2).unwrap().into_rgba8();
    let (width, height) = rgba.dimensions();
    println!("{} {}", width, height);

    let mut levels = Vec::new();
    // let mut bars =Vec::new();
    let mut rng = rand::thread_rng();
    let co = (255 / (k - 1));
    for l in 0..k {
        levels.push(l * co);
    }

    println!("levels of color {:?}  ddd {:?}  k : {}", levels, co, k);
    for x in 0..width {
        for y in 0..height {
            let p = *rgba.get_pixel(x, y);
            let mut rgba_val = p.channels();
         
            let mut colors = [rgba_val[0], rgba_val[1], rgba_val[2], rgba_val[3]];


            let yp=0.2999f32 * (rgba_val[0] as f32) + 0.58f32 *  (rgba_val[1] as f32) + 0.114f32 *  (rgba_val[2] as f32);
            let cb:f32 = 128f32-0.168736f32 *  (rgba_val[0] as f32) - 0.331264 * (rgba_val[1] as f32) + 0.5f32 *(rgba_val[2] as f32);
            let cr:f32 = 128f32+0.5f32 *  (rgba_val[0] as f32) - 0.418688f32 * (rgba_val[1] as f32) + 0.0813112* (rgba_val[2] as f32);
           // println!("{:?}  {:?}  {}", yp, cb, cr);
            let np = image::Rgba([(yp as u8) ,(cb as u8) , (cr as u8),255]);

            rgba.put_pixel(x, y, np);
        }
    }


    for x in 0..width {
        for y in 0..height {
            let p = *rgba.get_pixel(x, y);
            let mut rgba_val = p.channels();
         
            let mut colors = [rgba_val[0], rgba_val[1], rgba_val[2], rgba_val[3]];

            let randomtreshold = rng.gen_range(0..10);
            for i in 0..3 {
                let tt = ((rgba_val[i] as u16) * (k as u16 - 2u16)) / 255u16;
                let tr = tt as u8;
                if randomtreshold > 4 {
                    colors[i] = levels[(tr + 1) as usize]
                } else {
                    colors[i] = levels[(tr) as usize]
                }
            }

            let np = image::Rgba(colors);

            rgba.put_pixel(x, y, np);
        }
    }



    for x in 0..width {
        for y in 0..height {
            let p = *rgba.get_pixel(x, y);
            let mut rgba_val = p.channels();
         
            let mut colors = [rgba_val[0], rgba_val[1], rgba_val[2], rgba_val[3]];


            let r= (rgba_val[0] as f32) + 1.402f32 * ((rgba_val[2] as f32) - 128f32);
            let b:f32 = (rgba_val[0] as f32) - 0.344136f32 * ((rgba_val[1] as f32) - 128f32) - 0.714136f32 *((rgba_val[2] as f32 )-128f32);
            let g:f32 = (rgba_val[0] as f32) + 1.772f32 * ((rgba_val[1] as f32) - 128f32);
           
            let np = image::Rgba([(r as u8) ,(g as u8) , (b as u8),255]);

            rgba.put_pixel(x, y, np);
        }
    }


    let modified =
        "C:\\Users\\Sebastian\\Documents\\SebasLab\\comg\\src\\assets\\plant\\modified.png";
    let modified2 = "C:\\Users\\Sebastian\\Pictures\\modified.png";
    rgba.save(modified2).unwrap();
    rgba.save(modified).unwrap();
    println!("DONE");
    true.into()
}


fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            send_array_to_rust,
            inverse,
            bright1,
            contrast,
            gamma,
            blur,
            gblur2,
            sharp,
            edge_horizontal,
            median,
            eemboss,
            apply_in_rust,
            thresholding,
            median_cut,
            grey,
            ycb
           
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

// #[tauri::command]
// fn gblur2(filename: String, val: u8) -> bool {
//     use image::Pixel;
//     let original = format!("{}{}", "C:\\Users\\Sebastian\\Pictures\\", filename);
//      let original2 = format!("{}{}", "C:\\Users\\Sebastian\\Pictures\\", filename);
//     let mut rgba = open(original).unwrap().into_rgba8();
//     let mut rgba2 = open(original2).unwrap().into_rgba8();
//     let (width, height) = rgba.dimensions();
//     println!("{} {}", width, height);
//     for x in 2..width - 1 {
//         for y in 2..height - 1 {
//             let p = *rgba.get_pixel(x, y);
//             let rgba_val = p.channels();

//             let mut red: u32 = 0;
//             let mut green: u32 = 0;
//             let mut blue: u32 = 0;

//             for xin in x - 1..x + 2 {
//                 for yin in y - 1..y + 2 {
//                     let mut pp = *rgba2.get_pixel(xin, yin);
//                     let rgba_val2 = pp.channels();
//                     if xin == x && yin == y {
//                         red += ((rgba_val2[0] as u32) * 4);
//                         green += ((rgba_val2[1] as u32) * 4);
//                         blue += ((rgba_val2[2] as u32) * 4);
//                     } else if xin == x || yin == y && !(xin == x && yin == y) {
//                         red += (rgba_val2[0] as u32) * 2;
//                         green += (rgba_val2[1] as u32) * 2;
//                         blue += (rgba_val2[2] as u32) * 2;
//                     } else {
//                         red += (rgba_val2[0] as u32);
//                         green += (rgba_val2[1] as u32);
//                         blue += (rgba_val2[2] as u32);
//                     }
//                 }
//             }
//             // println!("{} {} {} ",red,green,blue);
//             let mut nred: u8 = (red / 16) as u8;
//             let mut ngreen: u8 = (green / 16) as u8;
//             let mut nblue: u8 = (blue / 16) as u8;

//             let np = image::Rgba([nred, ngreen, nblue, rgba_val[3]]);

//             rgba.put_pixel(x, y, np);
//         }
//     }
//     let modified =
//         "C:\\Users\\Patryk\\Documents\\SebasLab\\comg\\src\\assets\\plant\\modified.png";

//     let modified2 = "C:\\Users\\Sebastian\\Pictures\\modified.png";
//     rgba.save(modified2).unwrap();
//     rgba.save(modified).unwrap();
//     println!("DONE");
//     true.into()
// }

// #[tauri::command]
// fn bright1(filename: String, val: u8) -> bool {
//     println!("{}", val);
//     use image::Pixel;
//     let original = format!("{}{}", "C:\\Users\\Sebastian\\Pictures\\", filename);
//     let mut rgba = open(original).unwrap().into_rgba8();
//     let (width, height) = rgba.dimensions();
//     println!("{} {}", width, height);
//     for x in 0..width {
//         for y in 0..height {
//             let mut p = *rgba.get_pixel(x, y);
//             let rgba_val = p.channels();
//             let bri0 = rgba_val[0] + std::cmp::min(255 - rgba_val[0], val);
//             let bri1 = rgba_val[1] + std::cmp::min(255 - rgba_val[1], val);
//             let bri2 = rgba_val[2] + std::cmp::min(255 - rgba_val[2], val);
//             let np = image::Rgba([bri0, bri1, bri2, rgba_val[3]]);

//             // println!("{:?}", p.channels());
//             rgba.put_pixel(x, y, np);
//         }
//     }
//     let modified =
//         "C:\\Users\\Patryk\\Documents\\SebasLab\\comg\\src\\assets\\plant\\modified.png";
//     let modified2 = "C:\\Users\\Sebastian\\Pictures\\modified.png";
//     rgba.save(modified2).unwrap();
//     rgba.save(modified).unwrap();
//     true.into()
// }

// #[tauri::command]
// fn sharp(filename: String, val: u8) -> bool {
//     use image::Pixel;
//     let original = format!("{}{}", "C:\\Users\\Sebastian\\Pictures\\", filename);
//      let original2 = format!("{}{}", "C:\\Users\\Sebastian\\Pictures\\", filename);
//     let mut rgba = open(original).unwrap().into_rgba8();
//     let mut rgba2 = open(original2).unwrap().into_rgba8();
//     let (width, height) = rgba.dimensions();
//     println!("{} {}", width, height);
//     for x in 2..width - 1 {
//         for y in 2..height - 1 {
//             let p = *rgba.get_pixel(x, y);
//             let rgba_val = p.channels();

//             let mut red: i32 = 0;
//             let mut green: i32 = 0;
//             let mut blue: i32 = 0;

//             for xin in x - 1..x + 2 {
//                 for yin in y - 1..y + 2 {
//                     let mut pp = *rgba2.get_pixel(xin, yin);
//                     let rgba_val2 = pp.channels();
//                     if xin == x && yin == y {
//                         red += ((rgba_val2[0] as i32) * 5);
//                         green += ((rgba_val2[1] as i32) * 5);
//                         blue += ((rgba_val2[2] as i32) * 5);
//                     } else if xin == x || yin == y && !(xin == x && yin == y) {
//                         red += (rgba_val2[0] as i32) * -1;
//                         green += (rgba_val2[1] as i32) * -1;
//                         blue += (rgba_val2[2] as i32) * -1;
//                     } else {
//                     }

//                     //     red+=((rgba_val2[0]as i32)/9) as u8;
//                     //   //  println!("inside {}", red);
//                     //     green+=((rgba_val2[1]as i32)/9) as u8;
//                     //     blue+=((rgba_val2[2]as i32)/9) as u8;
//                 }
//             }
//             // println!("{} {} {} ",red,green,blue);
//             let mut nred: u8 = (red) as u8;
//             let mut ngreen: u8 = (green) as u8;
//             let mut nblue: u8 = (blue) as u8;
//             // println!("{} {} {} ",nred,ngreen,nblue);

//             let np = image::Rgba([nred, ngreen, nblue, rgba_val[3]]);

//             rgba.put_pixel(x, y, np);
//         }
//     }
//     let modified =
//         "C:\\Users\\Patryk\\Documents\\SebasLab\\comg\\src\\assets\\plant\\modified.png";

//     let modified2 = "C:\\Users\\Sebastian\\Pictures\\modified.png";
//     rgba.save(modified2).unwrap();
//     rgba.save(modified).unwrap();
//     println!("DONE");
//     true.into()
// }

/*

#[tauri::command]
fn eemboss(filename: String, val: u8) -> bool {
    use image::Pixel;
    let original = format!("{}{}", "C:\\Users\\Sebastian\\Pictures\\", filename);
     let original2 = format!("{}{}", "C:\\Users\\Sebastian\\Pictures\\", filename);
    let mut rgba = open(original).unwrap().into_rgba8();
    let mut rgba2 = open(original2).unwrap().into_rgba8();
    let (width, height) = rgba.dimensions();
    println!("{} {}", width, height);
    for x in 2..width - 1 {
        for y in 2..height - 1 {
            let p = *rgba.get_pixel(x, y);
            let rgba_val = p.channels();

            let mut red: i32 = 0;
            let mut green: i32 = 0;
            let mut blue: i32 = 0;

            for xin in x - 1..x + 2 {
                for yin in y - 1..y + 2 {
                    let mut pp = *rgba2.get_pixel(xin, yin);
                    let rgba_val2 = pp.channels();
                    if xin == x && yin == y {
                        red += (rgba_val2[0] as i32);
                        green += (rgba_val2[1] as i32);
                        blue += (rgba_val2[2] as i32);
                    } else if xin == x - 1 {
                        red += (rgba_val2[0] as i32) * -1;
                        green += (rgba_val2[1] as i32) * -1;
                        blue += (rgba_val2[2] as i32) * -1;
                    } else if xin == x + 1 {
                        //
                        red += (rgba_val2[0] as i32);
                        green += (rgba_val2[1] as i32);
                        blue += (rgba_val2[2] as i32);
                    }
                }
            }
            //  println!("{} {} {} ",red,green,blue);
            let mut nred: u8 = (red) as u8;
            let mut ngreen: u8 = (green) as u8;
            let mut nblue: u8 = (blue) as u8;
            //  println!("{} {} {} ",nred,ngreen,nblue);

            let np = image::Rgba([nred, ngreen, nblue, rgba_val[3]]);

            rgba.put_pixel(x, y, np);
        }
    }
    let modified =
        "C:\\Users\\Patryk\\Documents\\SebasLab\\comg\\src\\assets\\plant\\modified.png";

    let modified2 = "C:\\Users\\Sebastian\\Pictures\\modified.png";
    rgba.save(modified2).unwrap();
    rgba.save(modified).unwrap();
    println!("DONE");
    true.into()
}

*/
