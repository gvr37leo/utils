
function map(val1, start1, stop1, start2, stop2){
    return start2 + (stop2 - start2) * ((val1 - start1) / (stop1 - start1))
}

function inRange(min ,max ,value){
    if(min > max){
        var temp = min;
        min = max;
        max = temp;
    }
    return value <= max && value >= min;
}

function min(a, b){
    if(a < b)return a;
    return b;
}

function max(a, b){
    if(a > b)return a;
    return b;
}

function clamp(val, min, max){
    return this.max(this.min(val, max), min)
}

function rangeContain(a1,a2,b1,b2){//as in does a enclose b----- so returns true if b is smaller in all ways
    return max(a1, a2) >= max(b1, b2) && min(a1,a2) <= max(b1,b2);
}

function createNDimArray(dimensions, fill) {
    if (dimensions.length > 0) {
        function helper(dimensions) {
            var dim = dimensions[0];
            var rest = dimensions.slice(1);
            var newArray = new Array();
            for (var i = 0; i < dim; i++) {
                newArray[i] = helper(rest);
            }
            return newArray;
        }
        var array = helper(dimensions);
        var looper = new Vector2(0, 0);
        looper.vals = dimensions;
        looper.loop((pos) => {
            setElement(array, pos.vals, fill(pos));
        });
        return array;
    }
    else {
        return undefined;
    }
}

function getElement(array, indices) {
    if (indices.length == 0) {
        return null;
    }
    else {
        return getElement(array[indices[0]], indices.slice(1));
    }
}

function setElement(array, pos, val) {
    if (pos.length == 1) {
        array[pos[0]] = val;
    }
    else {
        setElement(array[pos[0]], pos.slice(1), val);
    }
}

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return new Vector2(evt.clientX - rect.left, evt.clientY - rect.top)
}

function createCanvas(x, y){
    var canvas = document.createElement('canvas')
    canvas.width = x;
    canvas.height = y;
    document.body.appendChild(canvas)
    var ctxt = canvas.getContext('2d')
    return {ctxt:ctxt,canvas:canvas};
}

function random(min, max){
    return Math.random() * (max - min) + min
}

function randomSpread(center, spread){
    var half = spread / 2
    return random(center - half, center + half)
}

var lastUpdate = Date.now();
function loop(callback){
    var now = Date.now()
    callback(now - lastUpdate)
    lastUpdate = now
    requestAnimationFrame(() => {
        loop(callback)
    })
}

function mod(number, modulus){
    return ((number%modulus)+modulus)%modulus;
}

function* iter(n){
    var i = 0;
    while(i < n)yield i++;
}

var keys = {}

document.addEventListener('keydown', (e) => {
    keys[e.keyCode] = true
})

document.addEventListener('keyup', (e) => {
    keys[e.keyCode] = false
})

function getMoveInput(){
    var dir = new Vector2(0,0)
    if(keys[37] || keys[65])dir.x--//left
    if(keys[38] || keys[87])dir.y++//up
    if(keys[39] || keys[68])dir.x++//right
    if(keys[40] || keys[83])dir.y--//down
    return dir;
}

function getFiles(strings){
    var promises = []
    for(var string of strings){
        var promise = fetch(string)
        .then(resp => resp.text())
        .then(text => text)
        promises.push(promise)
    }
    return Promise.all(promises)
}

function findbestIndex(list, evaluator) {
    if (list.length < 1) {
        return -1;
    }
    var bestIndex = 0;
    var bestscore = evaluator(list[0])
    for (var i = 1; i < list.length; i++) {
        var score = evaluator(list[i])
        if (score > bestscore) {
            bestscore = score
            bestIndex = i
        }
    }
    return bestIndex
}
