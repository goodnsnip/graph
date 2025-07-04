import { Neighbour } from "../interfaces/neighbour";

export class GraphNode {

    constructor(name: string) {
        this.name = name;
        this.neighbours = [];
    }

    public updateNeighbours(name: string, distance: number): boolean{

        // only add new nodes to the neighbours list, if neighbour already exists
        // return false value
        const foundNeighbour = this?.neighbours?.find(f => name === f.name);

        if (!foundNeighbour) {
            this.neighbours.push({name: name, distance: distance});
            return true;
        }
        else { 
            return false;
        }
    }
    

    public name: string;
    public neighbours: Neighbour[];

}
