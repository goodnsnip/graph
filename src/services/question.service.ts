import { GraphNode } from "../classes/graphNode";
import { Question } from "../classes/question";
import { Answer } from "../interfaces/answer";
import { PotentialPath } from "../interfaces/potentialPath";
import { QuestionType } from "../enums/questionType";

export class QuestionService {
    constructor() {}

    public findDinstance(graphNodes: GraphNode[], question: Question): Answer [] {

        let resultPaths: Answer[] = [];

        let path = [...question.nodeArray];
        let previousNode = graphNodes.find(f => f.name === path[0]);
        path.shift();

        let totalDisance = 0;
        let linkBroken = false;

        for (let node of path) {
            const foundLink = previousNode?.neighbours.find(f => f.name === node);
            if (foundLink)
                totalDisance = totalDisance + foundLink.distance;
            else {
                // if node doesn't exist then nodes do not link, stop processing and return no answer
                linkBroken = true;
                break;
            }
            previousNode = graphNodes.find(f => f.name === node);
        }
    
        if (!linkBroken) {
            resultPaths.push({path: question.nodeArray, total: totalDisance});
        }

        return resultPaths;
    }


    public findPaths(graphNodes: GraphNode[], question: Question): Answer [] {

        const startNode =  question.nodeArray[0];
        const endNode =  question.nodeArray[1];
        let newPotentialPaths: PotentialPath[] = [];  
        let resultPaths: Answer[] = [];

        // first path will always be start node with no distance
        let potentialPaths = [{path: [startNode], totalDistance: 0}];

        // while there are potential paths, continue to process
        while(potentialPaths?.length > 0) {

            // process potential paths while there are some to process
            potentialPaths?.forEach(poppedPath => {
                // record results
                if (poppedPath.path[poppedPath.path.length-1] === endNode){ 
                    resultPaths = this.returnResult(poppedPath,question,resultPaths);
                }
                // find next path
                newPotentialPaths = this.findNextPath(graphNodes,poppedPath,question, newPotentialPaths);
            });

            // reset the potential path array and copy in new paths
            potentialPaths = [];
            potentialPaths = [...newPotentialPaths];

            // reset the temporary path array
            newPotentialPaths = [];
        } // end while
        return resultPaths;
    }

    public returnResult(poppedPath: PotentialPath, question: Question, result: Answer[]): Answer[] {

        if (question.qFunction === QuestionType.SHORTEST) {
            // if there are no results recorded yet then push first one
            if (result && result.length === 0) {
                result.push({path: poppedPath.path, total: poppedPath.totalDistance});
            }
            // as only results with the same total distance can be recorded, fine checking
            // first element, and push results that have same total distance
            else if (result[0].total === poppedPath.totalDistance) {
                result.push({path: poppedPath.path, total: poppedPath.totalDistance});
            }
            // if new path created has lower distance, clear our array and start again with new path
            else if (result[0].total > poppedPath.totalDistance) {
                result = [];
                result.push({path: poppedPath.path, total: poppedPath.totalDistance});
            }
        }          
        else if (question.qFunction === QuestionType.POSSIBLE && poppedPath.totalDistance <= question.limit){
            // for possible paths, record all paths that are within limit
            result.push({path: poppedPath.path, total: poppedPath.totalDistance});
        }
        return result;

    }

    public findNextPath(graphNodes: GraphNode[], poppedPath: PotentialPath, question: Question, newPaths: PotentialPath[]): PotentialPath[] {

        if ((question.qFunction === QuestionType.POSSIBLE && poppedPath.totalDistance <= question.limit) || 
            (question.qFunction === QuestionType.SHORTEST)) {

            let foundNode = graphNodes.find(f=> f.name === poppedPath.path[poppedPath.path.length-1]);

            foundNode?.neighbours.forEach(n => {
                let repeatedNode;
                // find repeating node for shortest path
                if (question.qFunction === QuestionType.SHORTEST) {
                    repeatedNode = poppedPath.path.find(f => f === n.name);
                }

                // will not repeat nodes for shortest path as no shortest path could
                // ever repeat a node

                if (!(question.qFunction === QuestionType.SHORTEST && repeatedNode)) {     
                    //create new object to push to array
                    let path = [...poppedPath.path];
                    path.push(n.name);
                    let total = poppedPath.totalDistance + n.distance;
                    newPaths.push({path: path, totalDistance: total});
                }
            });
        }
        return newPaths;
    }

}
