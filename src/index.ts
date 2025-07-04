import { GraphProgram } from "./graphProgram";
import { QuestionService } from "./services/question.service";

const startTime = performance.now();

// execute the graph service
const graphService = new GraphProgram(new QuestionService);


const endTime = performance.now();
console.log(`Process completed - took ${Math.round(endTime - startTime)} milliseconds`);
