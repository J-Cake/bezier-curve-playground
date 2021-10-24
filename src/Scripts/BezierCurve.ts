import type p5 from 'p5';

import {Coordinate, GameObject} from "../sys/GameObject";
import {GlobalState} from "../main";

// U combinator
export const U = <T>(f: typeof U, ...args: T[]) => f(f, ...args);
// Takes two points and returns an interpolated point, given `alpha` as the offset.
export const inter = (a: Coordinate, b: Coordinate, alpha: number): Coordinate => ({
    x: a.x + (b.x - a.x) * alpha,
    y: a.y + (b.y - a.y) * alpha
});

export default class BezierCurve extends GameObject {

    constructor(public readonly resolution: number, public readonly usePoints: number) {
        super({x: 0, y: 0, width: 0, height: 0});
    }

    render(ctx: p5, state: GlobalState) {
        const points = state.handles.map(i => i.pos).slice(0, Math.min(state.handles.length, this.usePoints));
        const paint = (c: Coordinate) => ctx.vertex(c.x, c.y);

        ctx.stroke(0);
        ctx.noFill();

        ctx.beginShape();
        for (let alpha = 0; alpha <= 1; alpha += 1 / this.resolution)
            paint(U((f, points: Coordinate[]) => points.length > 1 ? f(f, points.slice(1).map((i, a) => inter(i, points[a], alpha))) : points, points)[0]);
        ctx.endShape();

        // I'm sorry to anyone who tries to understand this line here. See [README.md](/README.md) for explanation.
    }

    tick(ctx: p5, state: GlobalState) {
    }

}