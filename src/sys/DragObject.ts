import {Coordinate, GameObject, Rect} from "./GameObject";
import {State} from "../main";

export default abstract class DragObject extends GameObject {
    protected isDragging: boolean = false;

    protected constructor(hitBox: Rect) {
        super(hitBox);

        State.on('mouse-down', ({mouse}) => this.isDragging = this.isInterceptingRadius(mouse, 10));
        State.on('mouse-up', () => this.isDragging = false);

        State.on('mouse-move', ({drawContext}) => {
            if (this.isDragging) {
                this.pos = ({
                    x: drawContext.mouseX,
                    y: drawContext.mouseY,
                });

                if (this.onMove)
                    this.onMove(this.pos);
            }
        });
    }

    /**
     * This function gets called when ever the user begins moves the object by dragging it.
     */
    onMove(pos: Coordinate): void {
    }
}