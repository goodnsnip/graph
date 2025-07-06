import * as fs from 'fs';
import { QuestionType } from './enums/questionType';
import { Question } from './classes/question';
import { GraphNode } from './classes/graphNode';
import { QuestionService } from './services/question.service';

const messages = {
    DUPLICATE_COORDINATES: "Coordinates and have already been supplied: "
};

export class GraphProgram {

    public inputFileName: string = "";
    public questions: Question[] = [];
    public graphNodes: GraphNode[] = [];

    constructor(
        private readonly questionService: QuestionService
        ) {
            // grab the file name from command line input
            this.acceptParameter();
            // read in input file, and load graphnodes and questions
            this.getInput();
            // execute the questions
            this.questions?.forEach((question: Question) => {
                    this.executeQuestions(question); 
            });
            // output answers to file
            this.outputAnswers();
    }

    public acceptParameter(){
        // you must enter an input file as a parameter to continue
        if (process.argv.slice(2).length === 0) {
            console.log("You must enter an input file as a parameter");
            console.log("Process exiting....");
            process.exit();
        }
        this.inputFileName = process.argv.slice(2)[0];
        // check if input file provided exists
        if (!fs.existsSync(this.inputFileName)) {
            console.log("Input file does not exist: " + this.inputFileName);
            console.log("Process exiting....");
            process.exit();
        }
    }

    public executeQuestions(question: Question) {

        switch (question.qFunction) {

            case QuestionType.POSSIBLE:
                question.setAnswer(this.questionService.findPaths(this.graphNodes, question));
                break;

            case QuestionType.SHORTEST:
                question.setAnswer(this.questionService.findPaths(this.graphNodes, question));
                break;

            case QuestionType.DISTANCE:
                question.setAnswer(this.questionService.findDinstance(this.graphNodes, question));
                break;

            default: 
                break;
        }
    }

    public outputAnswers() {

        try {
            // create an output file
            fs.writeFile('output.txt',"", (err) => {if (err )throw err;});
            this.questions?.sort((a, b) => a.qFunction.localeCompare(b.qFunction)).forEach((question:Question) => {
                fs.appendFile('output.txt', question.getAnswer() + '\n\n', (err) => {
                    if (err) throw err;
                });
            });
        }
        catch (err){
            throw "Error in creating output"
        }
    }

    public getInput(): void {

        try {
            const fileContent: string = fs.readFileSync(this.inputFileName, 'utf-8');
            const lines: string[] = fileContent.split(/\r?\n/); // Split by newline character(s)

            const processedLines: string[] = [];
            for (const line of lines) {
                // Trim whitespace from the line and check if it's not empty
                if (line.trim() !== '') {
                processedLines.push(line);
                }
            }
            // remove first line from processed lines as it will be used to load the graph
            // all subesquent lines will be for questions
            this.loadGraph(processedLines.shift());

            processedLines?.forEach((line,index) => {
            // first create our parameters
                const qObj = this.createQuestion(line);
                this.questions[index] = new Question(qObj.qFunction, qObj.qNodeArray, qObj?.qLimit);
            });
   
        } catch (error) {
            console.error('Error reading the input file: ', error);
        }
    }

    public loadGraph(input: any) {

        // create each graph node for every new node we encounter
        // for example AB5 will create two nodes A and B, and also include each other 
        // in their corresponding neighbour arrays, so we can cyclically create paths

        let i = 0;
        input?.split(' ')?.forEach((coord: string) => {

            try {
                const firstNode = coord.substring(0,1);
                const secondNode = coord.substring(1,2);

                const distance = parseInt(coord.substring(2,coord.length));
                if (isNaN(distance)) throw "Distance " + coord.substring(2,coord.length) + " is not a valid number";

                // load graph, first check if particaular node has already been created
                const foundFirstNode = this?.graphNodes?.find(f => f?.name === firstNode);
                const foundSecondNode = this?.graphNodes?.find(f => f?.name === secondNode);

                if (foundFirstNode) {
                    if (!foundFirstNode.updateNeighbours(secondNode,distance)) throw messages.DUPLICATE_COORDINATES + firstNode + secondNode ;

                }
                else {
                    this.graphNodes[i] = new GraphNode(firstNode);
                    this.graphNodes[i].updateNeighbours(secondNode,distance);  
                    i++;
                }

                if (foundSecondNode) {
                    if (!foundSecondNode.updateNeighbours(firstNode,distance)) throw messages.DUPLICATE_COORDINATES + firstNode + secondNode ;
                }
                else {
                    this.graphNodes[i] = new GraphNode(secondNode);
                    this.graphNodes[i].updateNeighbours(firstNode,distance);    
                    i++;    
                }
            }
            catch (err){
                throw err;
            }
        });
    

    }


    public createQuestion(input: string): any {

        const inputSplit = input.split(' ');
        let qFunction = inputSplit[0];
        let parameter = inputSplit[1];
        let qNodeArray: string[] = [];
        let qLimit = 0;

        if (qFunction === QuestionType.SHORTEST || qFunction === QuestionType.POSSIBLE) {
            qNodeArray.push(parameter.substring(0, 1));
            qNodeArray.push(parameter.substring(1, 2));

            if (qFunction === QuestionType.POSSIBLE) {
                try {
                    qLimit = parseInt(parameter.substring(2), 10);
                    if (isNaN(qLimit)) throw "Limit " + parameter.substring(2) + " is not a valid number";
                }
                catch (err){
                    throw err;
                }
            }
        }
        else if (qFunction === QuestionType.DISTANCE) {
            for (const char of parameter) {
                qNodeArray.push(char);
            }
        }

        return {qFunction: qFunction, 
                qNodeArray: qNodeArray,
                qLimit: qLimit
                };
    }

}





