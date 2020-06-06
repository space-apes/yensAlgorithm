/*
        /argument is index of element
    heap1.heapifyUp(4)
    GENERAL PURPOSE HEAP DATA STRUCTURE CLASS DEFINITION!
    JUST ADD getKey FUNCTION AND WATER AND WATCH IT GROW!


    for each heap, instantiate with constructor
    supplying a string for min or max heap and 
    a function to retrieve heap key from node

    heap1 = new GenHeap('min', (x)=>x.payload)

    heap1.buildHeap([3,5,3,6,7,4,3,2])
    heap1.insertNode({payload: 12})
    node0 = heap1.getRoot()
    node1 = heap1.extractRoot()
    boolVar = heap1.isHeap()
    

    //also some internal methods

    //argument is index of element
    heap1.heapifyUp(4)
    //argument is index of element
    heap1.heapifyDown(4)
    copiedObject = heap1.clone({payload: 65, payload2: true})
    //arguments are indexes
    heap1.swapData(3,6)
    //
    outputArray = heap1.heapSort([3,4,5,7,4,3])    

*/


class GenHeap
{
    constructor(_minOrMax, _getKeyFunction)
    {
        if(_minOrMax != 'min' &&  _minOrMax != 'max')
        {
            console.log('first argument must be "min" or "max"');
            return null; 
        }
        this.minOrMax = _minOrMax;
        this.data = [];
        this.heapSize = 0;
        this.getKeyFromNode = _getKeyFunction;
        this.getKey = (x)=> this.getKeyFromNode(this.data[x]);
    }

    buildHeap(inputArray)
    {
        for (let i=0; i <inputArray.length; i++)
        {
            this.insertNode(inputArray[i]);
        }
        return
    }
    //input: index of element to heapifyUp
    //output: final index of element after shifting
    heapifyUp(i)
    {
        //to trigger first comgetParentison
        let didSwap = true; 
        if(this.minOrMax == 'min')
        {
            while(didSwap == true && i > 1)
            {
                didSwap = false;
                if(this.getKey(i) < this.getKey(getParent(i)))
                {
                    //console.log("swapData getParent this.data["+getParent(i)+"]: "+this.data[getParent(i)]+" with getParent this.data["+i+"]: "+this.data[i]);
                    this.swapData(i, getParent(i));
                    i = getParent(i);
                    didSwap = true; 
                }
            }
        }
        else
        {
            while(didSwap == true && i > 1)
            {
                didSwap = false;
                if(this.getKey(i) > this.getKey(getParent(i)))
                {
                    //console.log("swapDataping getParent this.data["+getParent(i)+"]: "+this.data[getParent(i)]+" with getParent this.data["+i+"]: "+this.data[i]);
                    this.swapData(i, getParent(i));
                    i = getParent(i);
                    didSwap = true; 
                }
            }
        }
            return i;
    }
    //returns final index 
    heapifyDown(i)
    {
        let didSwap = true; 
        while (didSwap ==true && i < this.heapSize)
        {
            didSwap = false;
            if(this.minOrMax == 'min')
            {
                let smallest = i;
                if(lChild(i) <= this.heapSize && this.getKey(lChild(i)) < this.getKey(smallest))
                {
                    smallest = lChild(i);
                }
                if(rChild(i) <= this.heapSize && this.getKey(rChild(i)) < this.getKey(smallest))
                {
                    smallest = rChild(i);
                }
                if (smallest != i)
                {

                    //console.log("swapData: HEAPSIZE: "+this.heapSize+" parent this.data["+i+"] swapped with child this.data["+smallest+"]");
                    this.swapData(i, smallest);
                    i = smallest;
                    didSwap = true; 
                }
            }
            else
            {
                let largest = i;
                if( lChild(i) <= this.heapSize && this.getKey(lChild(i)) > this.getKey(largest))
                {
                    largest = lChild(i);
                }
                if(rChild(i) <= this.heapSize && this.getKey(rChild(i)) > this.getKey(largest))
                {
                    largest = rChild(i);
                }
                if (largest != i)
                {
                    this.swapData(i, largest);
                    i = largest;
                    didSwap = true; 
                }
            }
        } 
       return i;
    }

    insertNode(payLoad)
    {
        this.heapSize++;
        this.data[this.heapSize] = payLoad;
        return this.heapifyUp(this.heapSize);
    }

    swapData(indexA, indexB)
    {
        
        /*
        let temp = this.clone(this.data[indexA]);
        this.data[indexA] = this.clone(this.data[indexB]);
        this.data[indexB] = this.clone(temp);
        */

        
        let temp = this.data[indexA];
        this.data[indexA] = this.data[indexB];
        this.data[indexB] = temp;
        
        return; 
    }
    /*
       deep clone an object recursively. credit to 
        https://stackoverflow.com/questions/122102/what-is-the-most-efficient-way-to-deep-clone-an-object-in-javascript
    */
    clone(obj) {
    if (obj === null || typeof (obj) !== 'object' || 'isActiveClone' in obj)
        return obj;

    if (obj instanceof Date)
        var temp = new obj.constructor(); //or new Date(obj);
    else
        var temp = obj.constructor();

    for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            obj['isActiveClone'] = null;
            temp[key] = this.clone(obj[key]);
            delete obj['isActiveClone'];
        }
    }
    //console.log('made a copy of '+temp.name': '+temp.freq)
    return temp;
    }

    isHeap()
    {
        if (this.minOrMax =='min')
        {
            for(let i = this.heapSize; i>1; i--)
            {
                if(this.getKey(getParent(i)) > this.getKey(i))
                {
                    return false;
                }
            }
        }
        else
        {
            for(let i = this.heapSize; i>1; i--)
            {
                if(this.getKey(getParent(i)) < this.getKey(i))
                {
                    return false;
                }
            }
        }
        return true; 
    }

    extractRoot()
    {
        if(this.heapSize < 1)
        {
            console.log('trying to extractRoot with no elements in heap');
            return;
        }
        let temp = this.data[1];
        this.swapData(1, this.heapSize);
        this.heapSize--;
        
        this.heapifyDown(1);

        return temp;
    }
    getRoot()
    {
        if(this.heapSize < 1)
        {
            console.log('trying to getRoot with no elements in heap');
            return;
        }
        return this.data[1];
    }
}

var lChild = (i) => 2*i;
var rChild = (i) => 2*i + 1;
var getParent = (i) => Math.floor(i/2);



