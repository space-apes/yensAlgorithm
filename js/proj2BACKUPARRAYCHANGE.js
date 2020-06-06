
/*
   DATA SECTION: here we will put all graphs in simplified form before any transformations are done. 
   
   universal datatype for graphs: 'object' (dict in python), where key is id of node, 
  value is array of arrays. each subarray contains the target of an edge with key as source and a weight. 
   {
    srcKey: {dstKey: weight, dstKey: weight, dstKey: weight},
    srcKey: {dstKey: weight, dstKey: weight, dstKey: weight},
    srcKey: {dstKey: weight, dstKey: weight, dstKey: weight}
   }
*/

fig1a = 
{
    'a': {'g':0, 'b':0, 'd':0, 'c':0},
    'b': {'a':0, 'e':0, 'h':0},
    'c': {'a':0, 'd':0},
    'd': {'c':0, 'a':0, 'e':0},
    'e': {'d':0, 'h':0, 'b':0},
    'f': {'h':0},
    'g': {'a':0},
    'h': {'f':0, 'e':0, 'b':0}

}

fig1b =
{
    'a': {'b':6, 'f':3, 'g':6, 'c':10},
    'b': {'a': 6, 'f':2},
    'c': {'a':10, 'd':7, 'g': 1},
    'd': {'c': 7, 'g':5, 'h': 4, 'e':3},
    'e': {'d':3, 'h':4},
    'f': {'b':2, 'a':3, 'g':1},
    'g': {'f':1, 'a':6, 'c':1, 'd':5, 'h':9},
    'h': {'g':9, 'd':4, 'e':4}
}

//out of 3000 characters, this is percentage of each
charFrequencyArrayOrig= [
    {'name':'a', 'freq': 10},
    {'name':'b', 'freq': 15},
    {'name':'c', 'freq': 20},
    {'name':'d', 'freq': 5},
    {'name':'e', 'freq': 22},
    {'name':'f', 'freq': 28},

]
charFrequencyArray= [
    {'name':'a', 'freq': 5},
    {'name':'b', 'freq': 12},
    {'name':'c', 'freq': 15},
    {'name':'d', 'freq': 8},
    {'name':'e', 'freq': 17},
    {'name':'f', 'freq': 14},
    {'name':'g', 'freq': 29},


]

//simple graphs to test cycle finder
simpleGraphNoCycle = 
{
    'a': {'b': 0, 'c': 0},
    'b': {'a': 0, 'd': 0},
    'c': {'a': 0, 'e': 0},
    'd': {'b':0 },
    'e': {'c':0}
}



simpleGraphCycle = 
{
    'a': {'b': 0, 'c': 0},
    'b': {'a': 0, 'c':0, 'd': 0},
    'c': {'a': 0, 'b': 0, 'e': 0},
    'd': {'b':0},
    'e': {'c':0}
}


//converts simplified graph to something cytoscape can display
//(simpGraph) => elementsGraph
function simpGraphToCytoElements(g)
{
    e = []
    for(src in g)
    {
        e.push({data:{id:src}});
        for(dst in g[src])
        {
            e.push({data: { id:src+dst, source: src, target:dst, label:g[src][dst]}})            
        }
    }
    return e
}



/*
    NAME: generateRandomWeightedGraph
    INPUTS: int v (for number of vertexes desired in graph), real p, int maxWeight)
    OUTPUTDATATYPE: weighted 'simple graph' object with p probability of edge between vertexes
    DESCRIPTION:
    PSEUDOCODE:


*/

function generateRandomWeightedGraph(v, p, maxWeight)
{
    randomGraph = {}
    for (i = 0; i<v; i++)
    {
        randomGraph[String.fromCharCode(97+i)] = {}
    }
    for (sKey in randomGraph)
    {
        for (dKey in randomGraph)
        {
            if (sKey != dKey && Math.random() <= p)
            {
                weight = Math.ceil(Math.random()*maxWeight)
                randomGraph[sKey][dKey] = weight
                randomGraph[dKey][sKey] = weight
            }
        }
    }
    return randomGraph
}

/*
    NAME: yensKShortestPaths
    INPUTS: int k, simpleGraphObject g, String src, String dst, 
    OUTPUT DATATYPE: k sized array of paths. each path is an array of edges in the form {s:'a', d:'b', w:10} 
    DESCRIPTION: this function takes in a given undirected connected graph 
    with positive weights, a source node,  a destination node and a number representing how 
    many paths you want, and outputs the k shortest loopless paths between source and destination using Yen's algorithm
    and Dijkstra's shortest path algorithm to find individual shortest paths.  



    Each subsequent shortest path is based on the previous shortest path and each of the K shortest paths is formed by doing 
    size(previousShortest) - 1 iterations.   
    
    each iteration Yen's takes the previous shortest path and uses a modified version of the graph 
    with the next shortest path edge removed, then calculate
    the shortest path from the new 'last node' to the destination. then it will concatenate the root path with this new
    'spur path', add it to a collection of candidates, then after completing, pick the smallest of those to add to the 
    permanent 'committed to' shortest paths. 

    Finally it wil lreturn the list of permanent committed to paths. 

    PSEUDOCODE:

    Function yensKShortestPaths(int K, simpleGraphObject g, String src, String dst)
        Declare SP = []
        Declare candidateMinHeap = {}
        Declare gLocal = {}
        SP[0] = dijkstrasSP(src, dst, g)
        For k = 1 To K
            candidateMinHeap = {}
            For i = 0 To size(SP[k-1])-2
                spurNode = SP[k-1][i]
                rootPath = SP.subArray(0,spurNode)
                deepCopy(g, gLocal)
                for each previous committed shortest path in SP
                    if the current rootpath matches the rootpath of SP[x]
                        removeEdge(gLocal, prevSpur, prevSpur+1)
                spurPath = dijkStras(gLocal, spurNode, dst)
                totalPath = rootPath+spurPath
                candidateMinHeap.insert(totalPath)
            End For
        SP[k] = candidateMinHeap.getRootNode()
        End For
    Return SP


    End Function
*/

function yensKShortestPaths(K, g, src, dst)
{
    
    gLocal = {}
    SP =[]
    dArray = arrayDijkstra(g,src,dst).slice()
    SP[0] = dArray
    displayPath(SP[0])
    console.log("SP[0] is")
    console.log(SP[0])
    console.log("SP[0][0] is")
    console.log(SP[0][0])
    for(k = 1; k<K; k++)
    {
        console.log("k: "+k)
        //heap used for finding kth shortest path from candidates.
        //using sum of weights as key for comparison within heap. 
        candidateHeap = new GenHeap('min', (x)=>{
                total = 0
                for(i=0; i<x.length; i++)
                {
                    total += x[i].w
                }
                return total
                })
        //each subsequent shortest path after the first found with dijkstra's
        //is found in size(previousShortestPath) - 1 iterations 
        //since 
        for(spurIndex = 0; spurIndex < SP[k-1].length -1; spurIndex++)
        {
            console.log("spurIndex is: "+spurIndex);
            spurNode = SP[k-1][spurIndex].s
            rootPath =  SP[k-1].slice(0, spurIndex+1)
            console.log("SP[k-1] is: ")
            displayPath(SP[k-1])
            console.log("spurNode chosen is: "+spurNode)
            gLocal = deepCopy(g) 
            //TODO: for all committed-to shortest paths so far
            //if current rootpath matches rootpath of other shortest path
            //remove spur links to avoid repeating previous shortest paths
            for (prevPathCount = 0; prevPathCount<SP.length; prevPathCount++)
            {
                prevPath = SP[prevPathCount].slice()
                console.log("prevPath is ")
                displayPath(prevPath)
                console.log("rootPath is ")
                displayPath(rootPath)
                if(subPathsAreEqual(rootPath, prevPath, 0, spurIndex))
                {
                    console.log("removing all links between "+prevPath[spurIndex].s+" and "+prevPath[spurIndex].d)
                    if(gLocal[prevPath[spurIndex].s][prevPath[spurIndex].d])
                    {
                        delete gLocal[prevPath[spurIndex].s][prevPath[spurIndex].d]
                    }   
                    if(gLocal[prevPath[spurIndex].d][prevPath[spurIndex].s])
                    {
                        delete gLocal[prevPath[spurIndex].d][prevPath[spurIndex].s]
                    }
                    console.log("gLocal is : ")
                    console.log(gLocal);

                }
            }
            spurPath = arrayDijkstra(gLocal, spurNode.d, dst).slice()
            console.log("spurPath is ")
            displayPath(spurPath)
            total = rootPath(spurPath)
            console.log("total is ")
            displayPath(total)
            candidateHeap.insertNode(total)
        }
        if(candidateHeap.heapsize > 0)
        {
            SP[k] = []
            tempArray = candidateHeap.getRoot().slice()
            SP[k] = tempArray
        }
        //if no shortest path was found this iteration then return, as yen's can not continue. 
        else
        {
            SP[k] = []
        }
    }
    return SP
}

/*
    NAME: subPathsAreEqual
    INPUTS: -two paths in the form of arrays with object elements: {s: 'a', d: 'b', w: 15}
            -int b beginning index (inclusive)
            -int e end index (inclusive)
    OUTPUTDATATYPE: boolean
    DESCRIPTION: this function takes in 2 paths and index ranges and returns true if the contents
                of the two paths are equivalent and false if not
    PSEUDOCODE: 
    
    Function subPathsAreEqual(p1, p2, b, e) 
        pathsAreEqual = false
        for(i = b; i<=e; i++)
            If (p1[i].s == p2[i].s && p1[i].d == p2[i].d && p1[i].w == p2[i].w)
                pathsAreEqual = true
            Else
                pathsAreEqual = false
            End If
        return pathsAreEqual
    End Function
*/

function copyPath(sourci, desti)
{
    for(ci = 0; ci < sourci.length; ci++)
    {
        s = sourci[ci].s
        d = sourci[ci].d
        w = sourci[ci].w
        desti.push({'s': s, 'd': d, 'w': w})
    }
}

function subPathsAreEqual(p1, p2, b, e)
{
    pathsAreEqual = false
    for(pathCount=b; pathCount<=e; pathCount++)
    {
        if(p1[pathCount].s == p2[pathCount].s && p1[pathCount].d == p2[pathCount].d && p1[pathCount].w == p2[pathCount].w)
        {
            pathsAreEqual=true 
        }
        else
        {
            pathsAreEqual=false
        }
    }
    return pathsAreEqual
}

function displayPath(x)
{
    pathString = ""
    for(di = 0; di < x.length; di++)
    {
        pathString += "{s:"+x[di].s+" d:"+x[di].d+" w:"+x[di].w+"}, "
    }
    console.log(pathString)
}


//this function takes in an unweighted non-directional graph and a source node key
//and outputs a tree from the source node to all other connected nodes 
//with the shortest paths in terms of number of edges (not in terms of weight)
//by using a breadth-first traversal of the graph.

function simpGraphBFS(g, srcKey)
{   
    //objects: {nodeKey: Boolean}
    visited = {};
    //shortest path tree in terms of number of edges
    SPT = {};
    parentLayers = [[srcKey]];
    Object.keys(g).forEach(gKey=>{
            visited[gKey]=false;
            SPT[gKey] = {};
            })
    layerCount = 0
    while(parentLayers[layerCount].length > 0)
    {
        parentLayers[layerCount+1] = [];
        parentLayers[layerCount].forEach(parent=>
                {
                    for(child in g[parent]){
                                if (visited[child] == false)
                                {
                                    visited[child] = true;
                                    parentLayers[layerCount+1].push(child);
                                    SPT[parent][child] = g[parent][child];
                                }
                            }
                })
    layerCount++;
    }

    return SPT;
}



function simpGraphDFS(g, srcKey)
{
    SPT = {};
    visited = {};
    for (gKey in g)
    {
        SPT[gKey] = {};
        visited[gKey] = false;

    } 
    simpGraphDFSRecur(g, srcKey, visited, SPT)
    console.log(SPT)
    return SPT 
}



function simpGraphDFSRecur(g, curKey, visited, SPT)
{
    if (visited[curKey] == true)
    {
        return; 
    }
    visited[curKey] = true;
    for(adjacentKey in g[curKey])
    {
        if(visited[adjacentKey] == false)
        {
            SPT[curKey][adjacentKey] = 0;
            simpGraphDFSRecur(g, adjacentKey, visited, SPT);
        }
    }
    
    return  
}



function simpGraphHasCycleDFS(graph, src)
{
    visited = {}
    for (key in graph)
    {
        visited[key] = false;
    }

    return simpGraphHasCycleDFSRecur(graph, src, visited, 'x')
}



function simpGraphHasCycleDFSRecur(g,c,v,prev)
{
    foundCycle = false;
    if(v[c] == true)
    {
        return true
    }
    v[c] = true
    for(adjKey in g[c])
    {
        if(adjKey != prev)
        {
            //console.log('checking CURNODE: '+adjKey+" PARENT: "+c);
            foundCycle = foundCycle || simpGraphHasCycleDFSRecur(g, adjKey,v, c);
        }
    }
    return foundCycle;

}


//create set of visited 
//set curnode to arbitrary node
//while count of visited is less than total nodes
    //for all visited nodes
        //search for adjacent to any visited with smallest weight
        //add node with smallest weight to visited
        //increment count of visited

function simpGraphPrimMST(g, srcNode)
{
    visited = {}
    MST = {}
    gKeys = Object.keys(g);
    visitedCount = 0;
    gKeys.forEach(gKey=>{
            MST[gKey] = {};
            visited[gKey] = false;
            });
    //if we assume connected graph then there will be at least 1 edge for each node
    curEdge = []
    visited[srcNode] = true;
    visitedCount++
    while (visitedCount < gKeys.length)
    {
        smallestAdjacentWeight = Number.MAX_SAFE_INTEGER;
        //for all visited keys, find edge to unvisited key with smallest weight 
        for (srcKey in g)
        {
            if(visited[srcKey] == true)
            {
                for(dstKey in g[srcKey])
                {
                    if(visited[dstKey] == false && g[srcKey][dstKey]<=smallestAdjacentWeight)
                    {

                            smallestAdjacentWeight = g[srcKey][dstKey];
                            curEdge = [srcKey, dstKey, smallestAdjacentWeight];
                    }
                }
            }
        }
    MST[curEdge[0]][curEdge[1]] = curEdge[2];
    visited[curEdge[1]] = true;
    visitedCount++;
    
    }
    return MST
}


function simpGraphDijkstra(g, src, dst)
{
    nodeInfo = {}
    //shortest path graph
    SP = {}
    for (gKey in g)
    {   
        nodeInfo[gKey] = {v: false, d: Number.MAX_VALUE};
        SP[gKey] = {};
    }
    nodeInfo[src].d = 0;
    nodeInfo[src].p = '';
    visitedCounter = 0
    smallestUnvisited = src
    //while visitedCount < totalNodes
        //get unvisited with smallest dist
        //set that element to visited
        //for all neighbors of visited 
            //if visited.d + edge(visited, neighbor) < dist(neighbor)
                //dist[neighbor] = dist[visited]+edge(visited, neighbor)
                //neighbor.parent = visited

    while(visitedCounter < Object.keys(nodeInfo).length)
    {
        smallestUnvisitedDistance = Number.MAX_VALUE 
        //find unvisited node with smallest distance from source
        for(key in nodeInfo)
        {
            if (nodeInfo[key].v == false && nodeInfo[key].d < smallestUnvisitedDistance)
            {
                //console.log("smallest unvisited is now "+smallestUnvisited); 
                smallestUnvisited = key;
                smallestUnvisitedDistance = nodeInfo[key].d;
            }
        }
        console.log("VISITED "+smallestUnvisited+" now checking adjacents");
        nodeInfo[smallestUnvisited].v = true; 
        //for all adjacent keys, if current dist + edge is less than adj distance, update adj distance
        for (adjKey in g[smallestUnvisited])
        {
            if ((nodeInfo[smallestUnvisited].d + g[smallestUnvisited][adjKey]) < nodeInfo[adjKey].d)
            {
                nodeInfo[adjKey].d = nodeInfo[smallestUnvisited].d + g[smallestUnvisited][adjKey];
                nodeInfo[adjKey].p = smallestUnvisited;
            }
        }
        visitedCounter++;
        console.log("NODEINFO iteration "+visitedCounter);
        console.log(nodeInfo);
    }    
    //traceback starting destination to source
    tb = dst;
    //while the parent is not empty
    while (nodeInfo[tb].p != '')
    {
        SP[tb][nodeInfo[tb].p] = g[tb][nodeInfo[tb].p]
        tb = nodeInfo[tb].p
    }
    return SP
}

/*
    this function is the same as above but returns the shortest path between src and dst 
    as an array of edges in the form {s:'a', d:'b', w:10}
*/
function arrayDijkstra(g, src, dst)
{
    nodeInfo = {}
    //shortest path graph
    SP = []
    for (gKey in g)
    {   
        nodeInfo[gKey] = {v: false, d: Number.MAX_VALUE};
    }
    nodeInfo[src].d = 0;
    nodeInfo[src].p = '';
    visitedCounter = 0
    smallestUnvisited = src
    //while visitedCount < totalNodes
        //get unvisited with smallest dist
        //set that element to visited
        //for all neighbors of visited 
            //if visited.d + edge(visited, neighbor) < dist(neighbor)
                //dist[neighbor] = dist[visited]+edge(visited, neighbor)
                //neighbor.parent = visited

    while(visitedCounter < Object.keys(nodeInfo).length)
    {
        smallestUnvisitedDistance = Number.MAX_VALUE 
        //find unvisited node with smallest distance from source
        for(key in nodeInfo)
        {
            if (nodeInfo[key].v == false && nodeInfo[key].d < smallestUnvisitedDistance)
            {
                //console.log("smallest unvisited is now "+smallestUnvisited); 
                smallestUnvisited = key;
                smallestUnvisitedDistance = nodeInfo[key].d;
            }
        }
        nodeInfo[smallestUnvisited].v = true; 
        //for all adjacent keys, if current dist + edge is less than adj distance, update adj distance
        for (adjKey in g[smallestUnvisited])
        {
            if ((nodeInfo[smallestUnvisited].d + g[smallestUnvisited][adjKey]) < nodeInfo[adjKey].d)
            {
                nodeInfo[adjKey].d = nodeInfo[smallestUnvisited].d + g[smallestUnvisited][adjKey];
                nodeInfo[adjKey].p = smallestUnvisited;
            }
        }
        visitedCounter++;
    }    
    //traceback starting destination to source
    tb = dst;
    //while the parent is not empty
    temp = []
    while (nodeInfo[tb].p != '')
    {
        //SP[tb][nodeInfo[tb].p] = g[tb][nodeInfo[tb].p]
        temp.push({'s':nodeInfo[tb].p, 'd':tb, 'w':g[nodeInfo[tb].p][tb]})
        tb = nodeInfo[tb].p
    }
    //reverse em before putting into SP
    for (i = temp.length-1; i>-1; i--)
    {
        SP.push(temp[i])
    }
    return SP
}

/*
    PATH WITH THE HIGHEST MINIMUM WEIGHT EDGE
   */


function simpGraphWidestDijkstra(g, src, dst)
{
    nodeInfo = {}
    //shortest path graph
    WP = {}
    for (gKey in g)
    {   
        nodeInfo[gKey] = {v: false, lw: Number.MIN_VALUE};
        WP[gKey] = {};
    }
    nodeInfo[src].lw = 0;
    nodeInfo[src].p = '';
    visitedCounter = 0
    largestUnvisited = src
    //set src weight to largest of its adjacent edge weights
   for (adjacentKey in g[src]) 
    {
        if(g[src][adjacentKey] > nodeInfo[src].lw)
        {
            nodeInfo[src].lw = g[src][adjacentKey];
        }
    }
    //while visitedCount < totalNodes
    while(visitedCounter < Object.keys(nodeInfo).length)
    {
        largestUnvisitedWeight = Number.MIN_VALUE
        for(key in nodeInfo)
        {
            if (nodeInfo[key].v == false && nodeInfo[key].lw > largestUnvisitedWeight)
            {
                largestUnvisited = key;
                largestUnvisitedWeight = nodeInfo[key].lw;
            }
        }
        console.log("largestUnvisited is "+largestUnvisited+" with weight "+nodeInfo[largestUnvisited].lw+ ".... visiting adjacent");
        nodeInfo[largestUnvisited].v = true; 
        for (adjKey in g[largestUnvisited])
        {
            //pick smallest of largestUnvisited or edge weight
                //if it is greater than curradjWeight
                    //update parent and weight

            smallerIncoming = nodeInfo[largestUnvisited].lw < g[largestUnvisited][adjKey] ? nodeInfo[largestUnvisited].lw : g[largestUnvisited][adjKey];
            console.log("smallerIncoming is "+smallerIncoming);
            if (smallerIncoming > nodeInfo[adjKey].lw && nodeInfo[largestUnvisited].p != adjKey)
            {
                nodeInfo[adjKey].lw = smallerIncoming;
                nodeInfo[adjKey].p = largestUnvisited;
            }
            else if(g[largestUnvisited][adjKey] > nodeInfo[adjKey].lw)
            {
                nodeInfo[adjKey].lw = g[largestUnvisited][adjKey];
            }
   

        }
        visitedCounter++;
        console.log("NODEINFO iteration "+visitedCounter);
        console.log(nodeInfo);
    }    
    
    
    
    //traceback starting destination to source
    tb = dst;
    //while the parent is not empty
    while (nodeInfo[tb].p != '')
    {
        WP[tb][nodeInfo[tb].p] = g[tb][nodeInfo[tb].p]
        tb = nodeInfo[tb].p
    }

    return WP
}






//create minHeap with getKey function = (x)=>minHeap.data[x].freq
//buildHeap using freqArray
//while heapSize > 1
    //temp1 = extractRoot()
    //temp2 = extractRoot()
    //combined = {name: temp1.name+temp2.name, freq: temp1.freq+temp2.freq, l: temp1, r: temp2}
    //insertNode(combined)
//
//traverse tree adding in 
function freqArrayToOptimalPrefixSimpGraph(freqArray)
{
    if(freqArray.length <1)
    {
        console.log("freqArrayToOptimalPrefixSimpGraph: need more elements in input array");
        return;
    }
    hufTree = {};
    charFreqHeap = new GenHeap('min', (x)=>x.freq);
    charFreqHeap.buildHeap(freqArray);

    while(charFreqHeap.heapSize > 1)
    {
        temp1 = charFreqHeap.extractRoot();
        temp2 = charFreqHeap.extractRoot();

        combined = {'name': temp1.name+'-'+temp2.name, 'freq': temp1.freq+temp2.freq, lChild: temp1, rChild: temp2}

        charFreqHeap.insertNode(combined);
    }

    hufTreeFromHufHeapRecur(charFreqHeap.getRoot(), hufTree);

    return hufTree;
}

function hufTreeFromHufHeapRecur(curNode, t)
{
    if (curNode == null)
    {
        return;
    }
    parentLabel = curNode.name+"-"+curNode.freq;
    t[parentLabel]= {};
    if(curNode.lChild != null)
    {
        childLabel = curNode.lChild.name+"-"+curNode.lChild.freq;
        t[parentLabel][childLabel] = 0; 
    }
    if(curNode.rChild != null)
    {
        childLabel = curNode.rChild.name+"-"+curNode.rChild.freq;
        t[parentLabel][childLabel] = 1; 
    }

    if(curNode.lChild!= null)
    {
        hufTreeFromHufHeapRecur(curNode.lChild, t);
    }
    if(curNode.rChild!= null)
    {
        hufTreeFromHufHeapRecur(curNode.rChild, t);
    }
}

function freqArrayToSimpGraph(fa)
{
    sg = {}
    for (i=0; i<fa.length; i++)
    {
        sg[fa[i].name+ '-'+fa[i].freq] = {}
    }
    return sg
}




















/*
NAME: simpGraphToMSTKruskal
INPUTS: connectedSimpGraphObject g
OUTPUT DATATYPE: simpGraph Object
DESCRIPTION: uses kruskal's algorithm to find minimum weight spanning tree for input graph
PSEUDOCODE:

declare edgeCounter = 0
sort edges
add first 2 edges to MST
edgeCounter += 2
while edgeCount < vertexCount
    for all edges in ascending
        add edge
        if cycle exists
            remove edge
        else
            nodeCount++
            break;
return MST    
*/

function simpGraphKruskalMST(g)
{
    MST= {};
    edgeArray = [];
    edgeCounter = 0;
    for (sKey in g)
    {
        MST[sKey] = {};
        for(dKey in g[sKey])
        {
            edgeArray.push({'s': sKey, 'd': dKey, 'w':g[sKey][dKey]})
        }
    }
    edgeMinHeap = new GenHeap('min', (x)=>x.w);
    edgeMinHeap.buildHeap(edgeArray);
    edgeArray = [];  
    //sort edges in ascending order
    while(edgeMinHeap.heapSize >1)
    {
        edgeArray.push(edgeMinHeap.extractRoot());
    }
    MST[edgeArray[0].s][edgeArray[0].d] = edgeArray[0].w;
    MST[edgeArray[1].s][edgeArray[1].d] = edgeArray[1].w;
    edgeCounter+=2
    
    for (i = 2; i < edgeArray.length; i++)
    {
        src = edgeArray[i].s
        dst = edgeArray[i].d
        weight = edgeArray[i].w
        //skip this edge if it's reciprocal is already in MST
        if(MST[dst] && !MST[dst][src])
        {    
            MST[src][dst] = weight
            MST[dst][src] = weight
            //if this edge creates a cycle, delete it and don't increment edgeCounter
            if(simpGraphHasCycleDFS(MST, src))
            {
                delete  MST[src][dst]
                delete  MST[dst][src]
            }
            else
            {
                edgeCounter++
                //return the tree if we reach vertexes-1 edges
                if (edgeCounter == Object.keys(g).length -1)
                {
                    return MST
                }
            }
        }
    }
    return MST
}

function deepCopy(obj)
{
    if(obj === null || typeof(obj) !== 'object' || 'isActiveClone' in obj)
        return obj
    if(obj instanceof Date)
        var temp = new obj.constructor();
    else
        var temp = obj.constructor();
    
    for(var key in obj)
    {
        if(Object.prototype.hasOwnProperty.call(obj, key))
        {
            obj['isActiveClone'] = null
            temp[key] = deepCopy(obj[key]);
            delete obj['isActiveClone']
        }
    }
    return temp
}

