import 'jest';
import { Test, TestingModule } from '@nestjs/testing'
import { Question } from '../src/classes/question';
import { GraphNode } from '../src/classes/graphNode';
import { QuestionService } from '../src/services/question.service';


// As taken from email, just included one more possible path :)

const mockPossibleAnswer = 
     [{"path": ["C", "B", "A"], "total": 8}, 
      {"path": ["C", "E", "A"], "total": 12},
      {"path": ["C", "B", "D", "A"], "total": 11},
      {"path": ["C", "B", "E", "A"], "total": 15},
      {"path": ["C", "B", "A", "D", "A"], "total": 12},  
      {"path": ["C", "B", "C", "B", "A"], "total": 14},        
      {"path": ["C", "B", "D", "A", "D", "A"], "total": 15}];

const mockShortestAnswer = [ {"path": ["C", "B", "A"], total: 8 }];

const mockDirectionAnswer = [ {"path": ["C", "B", "A", "E"], total: 12 }];


const mockGraphNode: GraphNode[] = [
    {
        name: "A",
        neighbours: [{ name: 'B', distance: 5 }, { name: 'D', distance: 2 }, { name: 'E', distance: 4 }],
        updateNeighbours(){return true}
    },
        {
        name: "B",
        neighbours: [{ name: 'A', distance: 5 }, { name: 'C', distance: 3 }, { name: 'D', distance: 6 }, { name: 'E', distance: 8 }],
        updateNeighbours(){return true}
    },
    {
        name: "C",
        neighbours: [{ name: 'B', distance: 3 }, { name: 'E', distance: 8 } ],
        updateNeighbours(){return true}
    },
    {
        name: "D",
        neighbours: [{ name: 'A', distance: 2 }, { name: 'B', distance: 6 }, { name: 'E', distance: 6 }],
        updateNeighbours(){return true}
    },
    {
        name: "E",
        neighbours: [{ name: 'A', distance: 4 }, { name: 'B', distance: 8 }, { name: 'C', distance: 8 }, { name: 'D', distance: 26}],
        updateNeighbours(){return true}
    }

];


const possibleQuestion: Question = {

    qFunction: 'POSSIBLE',
    nodeArray: ['C','A'],
    limit: 15,
    setAnswer() {
    },
    getAnswer(){
        return "";
    }
};

const shortestQuestion: Question = {

    qFunction: 'SHORTEST',
    nodeArray: ['C','A'],
    limit: 0,
    setAnswer() {
    },
    getAnswer(){
        return "";
    }
};

const distanceQuestion: Question = {

    qFunction: 'DISTANCE',
    nodeArray: ['C','B','A','E'],
    limit: 0,
    setAnswer() {
    },
    getAnswer(){
        return "";
    }
};

describe( 'QuestionService', () => {

    let service: QuestionService;

    beforeEach(async () => {
        jest.clearAllMocks();
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                QuestionService
            ],
        }).compile();
        service = module.get<QuestionService>(QuestionService);
    });

    it ('Possible Question returns all possible paths under a limit', async () => {
    
        expect.assertions(1);

        try {
            const response =  service.findPaths(mockGraphNode,possibleQuestion);
            expect(response).toEqual(mockPossibleAnswer);
        }
        catch (e){
            throw e;
        }
    });


    it ('Shortest Question returns all possible shortest paths', async () => {
    
        expect.assertions(1);

        try {
            const response =  service.findPaths(mockGraphNode,shortestQuestion);
            expect(response).toEqual(mockShortestAnswer);
        }
        catch (e){
            throw e;
        }
    });


    it ('Distance return total distance between supplied nodes', async () => {

        expect.assertions(1);

        try {
            const response =  service.findDinstance(mockGraphNode,distanceQuestion);
            expect(response).toEqual(mockDirectionAnswer);
        }
        catch (e){
            throw e;
        }
    });


});