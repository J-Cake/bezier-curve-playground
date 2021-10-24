import p5 from 'p5';
import {GlobalState, State} from "../main";

export type Coordinate = {
    x: number,
    y: number
};

export type Rect = {
    x: number,
    y: number,
    width: number,
    height: number
};

/**
 * This is the class from which all objects that get used in the src are represented by. It has some base functionality
 * that you can use for simplicity
 */
export abstract class GameObject {
    velocity: p5.Vector;
    private _size: [w: number, h: number];

    protected constructor(hitBox: Rect) {
        State.on('mouse-up', ({mouse}) => {
            if (this.isIntercepting(mouse))
                this.onClick();
        });

        this._pos = [hitBox.x, hitBox.y];
        this._size = [hitBox.width, hitBox.height];

        this.velocity = new p5.Vector();
        this.velocity.x = 0;
        this.velocity.y = 0;
    }

    private _pos: [x: number, y: number];

    get pos(): Coordinate {
        return {
            x: this._pos[0],
            y: this._pos[1]
        };
    }

    set pos(pos: Coordinate) {
        this._pos[0] = pos.x;
        this._pos[1] = pos.y;
    }

    get hitBox(): Rect {
        const pos = this.pos;
        return {
            x: pos.x,
            y: pos.y,
            width: this._size[0],
            height: this._size[1]
        };
    }

    set hitBox(hitBox: Rect) {
        this._pos = [hitBox.x, hitBox.y];
        this._size = [hitBox.width, hitBox.height];
    }

    /**
     *
     * @param ctx The p5 context. You can get this from the render() function.
     * @param texture The texture to draw onto the screen.
     */
    drawTexture(ctx: p5, texture: p5.Image) {
        ctx.image(texture, this.hitBox.x, this.hitBox.y, this.hitBox.width, this.hitBox.height);
    }

    /**
     * Checks if the given coordinates are within the hit-box.
     * @param box If the box is a `Rect`, then, if any points exist in the rect and our hit-box at the same time, the result is yes.
     *  Otherwise, if it's a `Coordinate`, then that point must be within the hit-box.
     */
    isIntercepting(box: Rect | Coordinate): boolean {
        return box.x > this.hitBox.x && box.x < this.hitBox.x + this.hitBox.width
            && box.y > this.hitBox.y && box.y < this.hitBox.y + this.hitBox.height;
    }

    /**
     * Checks if the given coordinates are within a given radius.
     * @param coordinate The coordinate of the object to check.
     * @param radius The radius within which the coordinate yields a positive result
     */
    isInterceptingRadius(coordinate: Coordinate, radius: number): boolean {
        const box = {
            x: this.hitBox.x - this.hitBox.width / 2,
            y: this.hitBox.y - this.hitBox.height / 2
        };

        return Math.sqrt((coordinate.x - box.x) ** 2 + (coordinate.y - box.y) ** 2) <= radius;
    }

    /**
     * Draw the object to the screen
     * @param ctx The p5 context you can use to draw things.
     * @param state The current src state.
     */
    abstract render(ctx: p5, state: GlobalState);

    /**
     * Update the internal variables to make the object do what you need it to.
     * @param ctx The p5 context you can use to calculate things.
     * @param state The current src state.
     */
    abstract tick(ctx: p5, state: GlobalState);

    /**
     * This function gets called when ever something collides with the object
     * @param obj The object that collided
     */
    onCollide(obj: GameObject) {
    };

    /**
     * This function gets called when ever the user clicks on this object.
     */
    onClick() {
    };
}