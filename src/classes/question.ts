import { Answer } from '../interfaces/answer';

export class Question {
    constructor(qFunction: string, nodeArray: string[], limit: number) {

        this.qFunction = qFunction;
        this.nodeArray = nodeArray;
        this.limit = limit;
        this.answer = [];

    }

    public qFunction: string;
    public nodeArray: string[];
    public limit: number;
    public answer?: Answer[];


    public setAnswer(answer: Answer[]) {
        this.answer = answer;
    }

    public getAnswer(): string {          
        // format return answer into required format i.e. POSSIBLE CA = CBA8 CEA12...
        return this.qFunction + ' ' +
               this.nodeArray.join("") + ' = ' + 
               this.answer?.map(m => {return m.path.join("") + m.total;}).join(" ");
       
          
    }

}