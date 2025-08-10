import { Point } from "pixi.js";

export const distBetween = (pointA: Point, pointB: Point) => {
    return Math.hypot(pointB.x - pointA.x, pointB.y - pointA.y);
}

export const randomColor = () => {
    return "#" + ((Math.random() * 0xffffff) << 0).toString(16).padStart(6, "0");
}

export const randomFloatBetween = (min: number, max: number) => {
    return Math.random() * (max - min + 1) + min;
};

export const randomIntBetween = (min: number, max: number) => {
    return Math.floor(randomFloatBetween(min, max));
};

export const randomBool = () => {
    return Math.random() > 0.5;
}
