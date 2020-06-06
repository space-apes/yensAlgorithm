/*
   contains base template for graphs and logic for graph selection/visualization
*/

var graph1
var randGraph
var cy
function onSubmit()
{
    v = document.getElementById('vFromForm').value
    p = document.getElementById('pFromForm').value
    maxWeight = document.getElementById('maxWeightFromForm').value




    graph1 = {
        container: document.getElementById("containerA"),
        style: [
            {
                selector: 'node',
                style: 
                {
                    'background-color': '#666',
                    'label': 'data(id)'
                }   
            },
            {
                selector: 'edge',
                style: 
                {
                    'width': 3,
                    'line-color': '#ccc',
                    'target-arrow-color': '#ccc',
                    'target-arrow-shape': 'triangle', 
                    'label': 'data(label)', 
                    'font-size': '16px', 
                    'color': 'magenta'
                }
            },
            {
                selector: '.selectedPath',
                style: 
                {
                    'line-color': 'green',
                    'width': 5
                }
            },
 
        ],

        layout: {
            name: 'breadthfirst'
        }
    }

            randGraph = generateRandomWeightedGraph(v,p,maxWeight)
            graph1.elements = simpGraphToCytoElements(randGraph)
            cy = cytoscape(graph1)
            cy.layout(graph1.layout).run()
           //make node select options show after generating graph 
           document.getElementById('srcSelectContainer').style.display = "block"
           //clear all the previous select choices 
           document.getElementById("src").innerHTML = ''
           document.getElementById("dst").innerHTML = ''
           //add all nodes for src and dst for this particular graph
           //to both src and dst selects
            for (key in randGraph)
            {
                sOpt = document.createElement("OPTION")
                sOpt.value = key
                sOpt.textContent = key
                dOpt = document.createElement("OPTION")
                dOpt.value = key
                dOpt.textContent = key
                document.getElementById("src").appendChild(sOpt);
                document.getElementById("dst").appendChild(dOpt);
            }
            //remove all paths from previous graph
            document.querySelectorAll('.pathParagraphs').forEach(x=>{x.remove()})

            
}

function yenSubmit()
{
    src = document.getElementById("src").value
    dst = document.getElementById("dst").value
    k = document.getElementById("k").value
    yenArray = []
    yenArray = yensKShortestPaths(k, randGraph, src, dst)
    document.querySelectorAll('.pathParagraphs').forEach(x=>{x.remove()})
    for (i = 0; i<yenArray.length; i++)
    {
        pathPara = document.createElement("P")
        pathPara.classList.add("pathParagraphs")
        weightSum = 0
        for(j = 0; j<yenArray[i].length-1; j++)
        {
            pathPara.textContent += yenArray[i][j]+'-'+randGraph[yenArray[i][j]][yenArray[i][j+1]]+'-'+yenArray[i][j+1]+', '
                weightSum += randGraph[yenArray[i][j]][yenArray[i][j+1]]
        }
        pathPara.textContent+= 'SUM: '+weightSum
        let BLORF = i 
        pathPara.addEventListener("mouseenter", x=>{highlightEdges(BLORF)})
        pathPara.addEventListener("mouseleave", x=>{unHighlightEdges(BLORF)})
        document.getElementById("containerB").appendChild(pathPara)
    }
}

function highlightEdges(yenIndex)
{
    for(i = 0; i < yenArray[yenIndex].length-2; i++)
    {
        cy.elements('edge[source = "'+yenArray[yenIndex][i]+'"], edge[source = "'+yenArray[yenIndex][i+1]+'"]').addClass('selectedPath')
    }
}

function unHighlightEdges(yenIndex)
{
    for(i = 0; i < yenArray[yenIndex].length-2; i++)
    {
        cy.elements('edge[source = "'+yenArray[yenIndex][i]+'"], edge[source = "'+yenArray[yenIndex][i+1]+'"]').removeClass('selectedPath')
    }
}

