
const STATE = {
    TEMP: "temp",
    DRAWABLE: "drawable"
};

export { STATE };

export default class Node {

    constructor(id, position) {
        this.id = id;
        this.position = position;
        this.prev = undefined;
        this.next = undefined;
        this.color= "black";
        this.radius= 4;
        this.state= STATE.TEMP;
        this.controlPosition = undefined;
    }

    getId() { return this.id; }
    getPosition() { return this.position; }
    getPrev() { return this.prev; }
    setPrev(prev) { this.prev = prev; }
    getNext() { return this.next; }
    setNext(next) { this.next = next; }
    getColor() { return this.color; }
    setColor(color) { this.color=color; }
    getRadius() { return this.radius; }
    setRadius(radius) { this.radius = radius; }
    getState() { return this.state; }
    setState(state) { this.state=state; }
    getControlPosition() { return this.controlPosition; }
    setControlPosition(controlPosition) { this.controlPosition=controlPosition; }

    append(newNode) {
        if(this.next === undefined) {
            this.next = newNode;
            newNode.prev = this;
            return;
        }
        this.next.append(newNode);
    }

    insert(newNode) {
        this.next.prev = newNode;
        newNode.next = this.next;
        this.next = newNode;
        newNode.prev = this;
    }

    delete(nodeId) {
        if(nodeId === this.id) {
            if(this.prev !== undefined) this.prev.next = this.next;
            if(this.next !== undefined) this.next.prev = this.prev;
            delete this;
            return;
        } 
        this.next.delete(nodeId);
    }

    update (id, position, state) {
        if(id === this.id) {
            this.position = position;
            // if(color) this.color = color;
            return;
        }

        this.next.update(id, position, color);
    }

    find(id) {
        if(id === this.id) return this;
        if(this.next === undefined || this.next === null) return undefined;
        return this.next.find(id);
    }

    print() {
        console.log(this.id);
        if(this.next !== undefined) this.next.print();
    }
}
