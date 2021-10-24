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
        for (let alpha = 0; alpha <= 1; alpha += 1 / (this.resolution - this.resolution % 2))
            paint(U((f, points: Coordinate[]) => points.length > 1 ? f(f, points.slice(1).map((i, a) => inter(i, points[a], alpha))) : points, points)[0]);
        ctx.endShape();

        // I'm sorry to anyone who tries to understand this line here. Let me explain:
        /**
         * # The *U* combinator
         * > In mathematics and computer science in general, a fixed point of a function is a value that is mapped to itself by the function. (Wikipedia)
         * **The fuck?**
         *
         * Okay, basically, it's a function which takes itself as an argument. Yea.
         * This allows us to make a function recursive. Instead of referring to the function to recurse by name, it is passed to the function as a parameter.
         *
         * This allows us to make inline-recursive functions. This is useful for scenarios where a recursive function simply represents a conditional statement,
         * making a recursive call. This allows the function to be simplified (well, *simplified*) and be squeezed into a single line. It's actually very elegant.
         *
         * Thanks FP!
         *
         * # Bezier Curves
         * > The first *e* is actually accented, but I'll be using the word a lot, and typing it quickly becomes annoying.
         * > So I'll omit it for convenience sake. just pretend it's there.
         *
         * A Bezier curve is curve which uses 1 or more *control* points to define the trajectory of the curve.
         * These points act as pulling forces, bending a line towards them. This effect is achieved by interpolating between all pairs of adjacent control nodes,
         * using the resultant set of coordinates as control points, until the list is reduced to a single point. This is the value of the curve at point `x`.
         *
         * Typically, this is not solved recursively, as recursion can become intensive on resources, however, the simplicity of the layers (interpolation),
         * combined with the most common use-case for bezier curves with very few control points, allows this to become feasible.
         * The snippet above uses the base function `inter`, which takes two points, and an interpolation value, `alpha`.
         * The use of the *U* combinator, allows the snippet to create a list of interpolated points, essentially reducing the list by one.
         * (Consider a list of points, and returning a list of gaps between them). This can be repeated until a single point remains.
         * This is painted at `resolution` intervals between the root points, to produce the curve.
         */
    }

    tick(ctx: p5, state: GlobalState) {
    }

}