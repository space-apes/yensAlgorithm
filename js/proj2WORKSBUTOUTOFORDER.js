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
    yenPaths = []
    yenPaths[0] = arrayDijkstra(g,src,dst).slice()
    console.log(`yenPaths[0] is ${yenPaths[0]}`)
    for(k = 1; k<K; k++)
    {

        //heap used for finding kth shortest path from candidates.
        //using sum of weights as key for comparison within heap. 
        candidateHeap = new GenHeap('min', (x)=>{
                total = 0
                for(i=0; i<x.length-1; i++)
                {
                    total += g[x[i]][x[i+1]]
                }
                return total
                })
        //each subsequent shortest path after the first found with dijkstra's
        //is found in size(previousShortestPath) - 1 iterations 
        //since 
        for(spurIndex = 0; spurIndex < yenPaths[k-1].length -1; spurIndex++)
        {
            
            spurNode = yenPaths[k-1][spurIndex]
            rootPath =  yenPaths[k-1].slice(0, spurIndex+1)
            console.log(`yenPath[k-1] is ${yenPaths[k-1]}`)
            console.log(`rootPath: ${rootPath}`)
            console.log(`spurNode: ${spurNode}`)
            gLocal = deepCopy(g) 
            for (prevPathCount = 0; prevPathCount<yenPaths.length; prevPathCount++)
            {
                console.log(`prevPathCount: ${prevPathCount}`)
                prevPath = yenPaths[prevPathCount]
                console.log(`comparing paths: ${rootPath} vs ${prevPath} from indexes 0 to ${spurIndex}`)
                if(subPathsAreEqual(rootPath, prevPath, 0, spurIndex))
                {
                    console.log("removing all links between "+prevPath[spurIndex]+" and "+prevPath[spurIndex+1])
                    if(gLocal[prevPath[spurIndex]][prevPath[spurIndex+1]])
                    {
                        delete gLocal[prevPath[spurIndex]][prevPath[spurIndex+1]]
                    }   
                    if(gLocal[prevPath[spurIndex+1]][prevPath[spurIndex]])
                    {
                        delete gLocal[prevPath[spurIndex+1]][prevPath[spurIndex]]
                    }
                }
            }

            spurPath = arrayDijkstra(gLocal, spurNode, dst)
            total = rootPath.slice(0,rootPath.length-1).concat(spurPath)
            console.log(`spurPath: ${spurPath}`)
            console.log('checking if candidate is repeat')
            insertCandidate = true
            for (r = 0; r < yenPaths.length; r++)
            {
                if (subPathsAreEqual(total, yenPaths[r], 0, yenPaths[r].length))
                {
                    insertCandidate = false
                }
            }
            if (insertCandidate == true)
            {
                console.log(`INSERTING CANDIDATE ${total}`)
                if(total[0] == src && total[total.length-1] == dst)
                    candidateHeap.insertNode(total)
            }
        }
        
        if(candidateHeap.heapSize > 0)
        {
            winner = candidateHeap.getRoot()
            console.log(`WINNER: inserting ${winner}`)
            yenPaths[k] = candidateHeap.getRoot()
        }
        //no unique shortest path found this iteration. 
        else
        {
            console.log("no unique paths this iteration")
            continue;
        }
    
    }
    return yenPaths
}


function subPathsAreEqual(p1, p2, b, e)
{
    if (b==e)
        return true
    if (e > p1.length-1 || e > p2.length -1)
        return false

    pathsAreEqual = false
    for(pathCount=b; pathCount<=e; pathCount++)
    {
        if(p1[pathCount] == p2[pathCount])
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
        pathString += x[di]+', '
    }
    console.log(pathString)
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
    //if no path found between src and dst return false. 
    //we can check this by looking at the distance of dst from src
    if(nodeInfo[dst].d == Number.MAX_VALUE)
    {
        return []
    }
    //traceback starting destination to source
    tb = dst;
    //while the parent is not empty
    temp = []
    while (nodeInfo[tb].p != '')
    {
        //SP[tb][nodeInfo[tb].p] = g[tb][nodeInfo[tb].p]
        temp.push(tb)
        tb = nodeInfo[tb].p
    }
    temp.push(tb)
    //reverse em before putting into SP
    for (i = temp.length-1; i>-1; i--)
    {
        SP.push(temp[i])
    }
    return SP
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

