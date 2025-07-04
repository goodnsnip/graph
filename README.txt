--------------------
SOLUTION DESCRIPTION
--------------------
Loading Graph Definition into a an Array, and referring to all Links to the Nodes in the Graph as a Neighbour. 

The DISTANCE question is worked out by plotting each node with its neighbour and totalling up the distance between them

The POSSIBLE question is worked out by attemping to create a path for every neighbouring node until the Limit is reached,
while returning any path that reaches the End Node as an answer.

The SHORTEST question is worked out similiary to the POSIIBLE question, however instead of using a limit, nodes will not be 
repeated more than once in a path.

All the questions are run asyncronously and written to an output.txt file sorted by Question type after they have all been answered.

-----------
ASSUMPTIONS
-----------

That the Graph coordinates (nodes) are A...Z followed by a number, same applies for questions.
If a broken link between nodes is encountered for any Question, answer to that question will be blank.
The Possible Question, any node can be repeated in finding a route (including start and end nodes).
The Shortest Question, can potentially have multiple routes with the same total distance.


-------------------
INSTRUCTIONS TO RUN
-------------------

// ensure typescript is installed
npm install -g typescript

install node

// compile program
npm run build

// run program
npm start <inputfile>

// view output
cat output.txt 


