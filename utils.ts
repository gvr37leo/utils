/// <reference path="node_modules/vectorx/vector.ts" />

var TAU = Math.PI * 2
function map(val:number,from1:number,from2:number,to1:number,to2:number):number{
    return lerp(to1,to2,inverseLerp(val,from1,from2))
}

function inverseLerp(val:number,a:number,b:number):number{
    return to(a,val) / to(a,b)
}

function inRange(min: number, max: number, value: number):boolean{
    if(min > max){
        var temp = min;
        min = max;
        max = temp;
    }
    return value <= max && value >= min;
}

function min(a: number, b: number): number{
    if(a < b)return a;
    return b;
}

function max(a: number, b: number): number{
    if(a > b)return a;
    return b;
}

function clamp(val: number, min: number, max: number): number{
    return this.max(this.min(val, max), min)
}

function rangeContain(a1: number, a2: number, b1: number, b2: number):boolean{//as in does a enclose b----- so returns true if b is smaller in all ways
    return max(a1, a2) >= max(b1, b2) && min(a1,a2) <= max(b1,b2);
}

function createNDimArray<T>(dimensions: number[], fill:(pos:Vector) => T) {
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
        var looper = new Vector(0, 0);
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

function getElement<T>(array:T[], indices:number[]):T {
    if (indices.length == 0) {
        return null;
    }
    else {
        return getElement(array[indices[0]] as any, indices.slice(1));
    }
}

function setElement<T>(array:T[], pos:number[], val:T) {
    if (pos.length == 1) {
        array[pos[0]] = val;
    }
    else {
        setElement(array[pos[0]] as any, pos.slice(1), val);
    }
}

function getMousePos(canvas:HTMLCanvasElement, evt:MouseEvent) {
    var rect = canvas.getBoundingClientRect();
    return new Vector(evt.clientX - rect.left, evt.clientY - rect.top)
}

function createCanvas(x: number, y: number){
    var canvas = document.createElement('canvas')
    canvas.width = x;
    canvas.height = y;
    document.body.appendChild(canvas)
    var ctxt = canvas.getContext('2d')
    return {ctxt:ctxt,canvas:canvas};
}

function random(min: number, max: number){
    return Math.random() * (max - min) + min
}

function randomSpread(center: number, spread: number){
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

function mod(number: number, modulus: number){
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

function getMoveInput():Vector{
    var dir = new Vector(0,0)
    if(keys[37] || keys[65])dir.x--//left
    if(keys[38] || keys[87])dir.y++//up
    if(keys[39] || keys[68])dir.x++//right
    if(keys[40] || keys[83])dir.y--//down
    return dir;
}

function getMoveInputYFlipped():Vector{
    var input = getMoveInput()
    input.y *= -1
    return input
}

function getFiles(strings:string[]){
    var promises = []
    for(var string of strings){
        var promise = fetch(string)
        .then(resp => resp.text())
        .then(text => text)
        promises.push(promise)
    }
    return Promise.all(promises)
}

function findbestIndex<T>(list:T[], evaluator:(T) => number):number {
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

function createAndAppend(element: HTMLElement, html: string): HTMLElement {
    var result = string2html(html);
    element.appendChild(result)
    return result;
}

function string2html(string): HTMLElement {
    var div = document.createElement('div')
    div.innerHTML = string;
    return div.children[0] as HTMLElement;
}

function line(ctxt:CanvasRenderingContext2D,a:Vector,b:Vector){
    ctxt.beginPath()
    ctxt.moveTo(a.x,a.y)
    ctxt.lineTo(b.x,b.y)
    ctxt.stroke()
}

function lerp(a:number,b:number,r:number):number{
    return a + to(a,b) * r
}

function to(a:number,b:number):number{
    return b - a;
}

function swap<T>(arr:T[],a:number = 0,b:number = 1){
    var temp = arr[a];
    arr[a] = arr[b];
    arr[b] = temp;
}

class RNG{
    public mod:number = 4294967296
    public multiplier:number = 1664525
    public increment:number = 1013904223

    constructor(public seed:number){

    }

    next(){
        this.seed = (this.multiplier * this.seed + this.increment) % this.mod
        return this.seed
    }

    norm(){
        return this.next() / this.mod
    }
    
    
    range(min:number,max:number){
        return this.norm() * to(min,max) + min
    }
}

function last<T>(arr:T[]):T{
    return arr[arr.length - 1]
}

function findAndDelete(arr:any[],item:any){
    arr.splice(arr.findIndex(v => v == item),1)
}

class StopWatch{

    starttimestamp = Date.now()
    pausetimestamp = Date.now()
    pausetime = 0
    paused = true

    get():number{
        var currentamountpaused = 0
        if(this.paused){
            currentamountpaused = to(this.pausetimestamp,Date.now())
        }
        return to(this.starttimestamp, Date.now()) - (this.pausetime + currentamountpaused)
    }



    start(){
        this.paused = false
        this.starttimestamp = Date.now()
        this.pausetime = 0
    }

    continue(){
        if(this.paused){
            this.paused = false
            this.pausetime += to(this.pausetimestamp, Date.now())
        }
    }

    pause(){
        if(this.paused == false){
            this.paused = true
            this.pausetimestamp = Date.now()
        }
    }

    reset(){
        this.paused = true
        this.starttimestamp = Date.now()
        this.pausetimestamp = Date.now()
        this.pausetime = 0
    }
}

class Table<T>{
    columns: Column<T>[];
    orderDesc:Box<boolean>;
    orderedColumn:Box<number>;

    element: HTMLTableElement;
    head: HTMLTableSectionElement;
    body: HTMLTableSectionElement;
    headerRows:HTMLTableRowElement[] = []
    

    constructor(columns:Column<T>[]){
        this.columns = columns
        this.element = string2html(`
            <table class="table table-bordered table-striped">
                <thead>
                </thead>
                <tbody></tbody>
            </table>`) as HTMLTableElement
        this.head = this.element.querySelector('thead')
        this.body = this.element.querySelector('tbody')
        this.addHeader()
    }

    addHeader(){
        for(var header of this.columns[0].headerRenderers){
            var row = document.createElement('tr')
            this.headerRows.push(row)
            this.head.appendChild(row)
        }

        for(var column of this.columns){
            for(let i = 0; i < column.headerRenderers.length; i++){
                var headerRenderer = column.headerRenderers[i]
                var cell = this.createTableHeadCell(this.headerRows[i])
                cell.appendChild(headerRenderer())
            }
        }
    }

    load(objects:T[]){
        this.body.innerHTML = ''
        for(let i = 0; i < objects.length; i++){
            var object = objects[i]
            var row = document.createElement('tr')
            this.body.appendChild(row)            
            for(var column of this.columns){
                var cell = document.createElement('td')
                row.appendChild(cell)
                cell.appendChild(column.renderer(object, i))
            }
        }
    }

    private createTableHeadCell(row){
        var td = document.createElement('th')
        row.appendChild(td)
        return td
    }

}

class Column<T>{
    renderer:(obj:T, i:number) => HTMLElement
    headerRenderers:(() => HTMLElement)[]

    constructor(headerRenderers:(() => HTMLElement)[], renderer:(obj:T, i:number) => HTMLElement){
        this.headerRenderers = headerRenderers
        this.renderer = renderer
    }
}

class Router{

    listeners:RouteRegistration[] = []

    constructor(){
        
    }

    listen(regex:RegExp, listener:(string:RegExpExecArray) => void){
        this.listeners.push(new RouteRegistration(regex,listener))
    }

    trigger(string:string){
        for (var routeRegistration of this.listeners) {
            var result = routeRegistration.regex.exec(string)
            if(result != null){
                routeRegistration.listener(result)
                break
            }
        }
    }

    pushTrigger(url:string){
        window.history.pushState(null,null,url)
        this.trigger(url)
    }
}

class RouteRegistration{
    
    regex:RegExp
    listener:(string:RegExpExecArray) => void

    constructor(regex:RegExp, listener:(string:RegExpExecArray) => void){
        this.regex = regex
        this.listener = listener
    }
}

class Rule{

    constructor(public message:string,public cb:() => boolean){

    }
}

class Ability{
    // ammo:number = 1
    // maxammo:number = 1
    // ammorechargerate:number = 1000
    // casttime:number = 2000
    // channelduration:number = 3000

    cooldown:number = 1000
    lastfire = Date.now()
    rules:Rule[] = [
        new Rule('not ready yet',() => (this.lastfire + this.cooldown) < Date.now()),
        //cast while moving rule
        //must have target rule
        //must have valid target rule
        //resource rule
        //ammo rule
        //line of sight rule
    ]
    stopwatch:StopWatch = new StopWatch()
    ventingtime:number = 0
    onCastFinished = new EventSystemVoid()
    shots: number = 0
    firing: boolean = false

    

    constructor(public cb:() => void){

    }

    //positive if you need to wait 0 or negative if you can call it
    timeTillNextPossibleActivation():number{
        return to(Date.now(), this.lastfire + this.cooldown)
    }

    canActivate(){
        return this.rules.some(r => r.cb())
    }

    callActivate(){
        this.cb()
    }

    fire(){//activate
        if(this.firing == false){
            this.startfire()
        }else{
            this.holdfire()
        }
    }

    releasefire(){
        this.firing = false
    }

    tapfire(){
        this.startfire()
        this.releasefire()
    }
    
    private startfire(){
        if(this.rules.some(r => r.cb())){
            this.firing = true
            this.ventingtime = 0
            this.stopwatch.start()
            this.ventingtime -= this.cooldown
            this.shots = 1
            this.lastfire = Date.now()
            this.cb()
        }
    }

    private holdfire(){
        this.ventingtime += this.stopwatch.get()
        this.stopwatch.start()
        this.shots = Math.ceil(this.ventingtime / this.cooldown)
        this.ventingtime -= this.shots * this.cooldown
        this.lastfire = Date.now()
        if(this.shots > 0){
            this.cb()
        }
    }
}

enum AnimType{once,repeat,pingpong,extend}

class Anim{
    animType:AnimType = AnimType.once
    reverse:boolean = false
    duration:number = 1000
    stopwatch:StopWatch = new StopWatch()
    begin:number = 0
    end:number = 1

    constructor(){

    }

    get():number{
        var cycles = this.stopwatch.get() / this.duration

        switch (this.animType) {
            case AnimType.once:
                return clamp(lerp(this.begin,this.end,cycles),this.begin,this.end) 
            case AnimType.repeat:
                return lerp(this.begin,this.end,mod(cycles,1))
            case AnimType.pingpong:
                
                var pingpongcycle = mod(cycles, 2)
                if(pingpongcycle <= 1){
                    return lerp(this.begin,this.end,pingpongcycle)
                }else{
                    return lerp(this.end,this.begin,pingpongcycle - 1)
                }

            case AnimType.extend:
                var distPerCycle = to(this.begin,this.end)
                return Math.floor(cycles) * distPerCycle + lerp(this.begin,this.end,mod(cycles,1))
        }
    }
}

enum Hor {left,middle,right}
enum Vert {bottom,middle,top}
function createVector(x:Hor,y:Vert):Vector{
    return new Vector(x * 0.5,y * 0.5)
}
var zero = new Vector(0,0)
var one = new Vector(1,1)
var minusone = new Vector(-1,-1)
var half = new Vector(0.5,0.5)

var botleft = createVector(Hor.left,Vert.bottom)
var botmiddle = createVector(Hor.middle,Vert.bottom)
var botright = createVector(Hor.right,Vert.bottom)
var middleleft = createVector(Hor.left,Vert.middle)
var center = createVector(Hor.middle,Vert.middle)
var middleright = createVector(Hor.right,Vert.middle)
var topleft = createVector(Hor.left,Vert.top)
var topmiddle = createVector(Hor.middle,Vert.top)
var topright = createVector(Hor.right,Vert.top)


class BezierAnim extends Anim{
    private path:Vector[] = []

    constructor(public controlPoints:Vector[]){
        super()
        this.cacheControlPoints()
    }

    cacheControlPoints(){
        var precision = 11
        this.path = Bezier.cacheSlopeX(precision,Bezier.computeWaypointsContinuously(precision,this.controlPoints))
    }

    getSmooth(){
        return Bezier.tween(this.get(),this.path).y
    }
    static in = [botleft,botmiddle]
    static out = [topmiddle,topright]

    static linear = [botleft,center,center,topright]
    static easeInEaseOut = [...BezierAnim.in,...BezierAnim.out]
    static easeOut = [botleft,center,...BezierAnim.out]
    static easeIn = [...BezierAnim.in,center,topright]
}



class Bezier{
    constructor(){

    }

    static getBezierPoint(t:number,p0:Vector,p1:Vector,p2:Vector,p3:Vector):Vector{
        var a = p0.lerp(p1,t)
        var b = p1.lerp(p2,t)
        var c = p2.lerp(p3,t)
        var d = a.lerp(b,t)
        var e = b.lerp(c,t)
        var res = d.lerp(e,t)
        return res
    }

    static computeWaypoints(numberOfWaypoints:number,p0:Vector,p1:Vector,p2:Vector,p3:Vector){
        var spaces = numberOfWaypoints - 1
        var waypoints:Vector[] = [];
        for(var i = 0; i < numberOfWaypoints; i++){
            waypoints.push(Bezier.getBezierPoint(i / spaces, p0,p1,p2,p3))
        }
        return waypoints;
    }

    static computeWaypointsContinuously(waypointsPerSection:number,controlpoints:Vector[]):Vector[]{
        var waypoints:Vector[] = Bezier.computeWaypoints(10,controlpoints[0],controlpoints[1],controlpoints[2],controlpoints[3])
        for(var i = 3; i < controlpoints.length - 3; i += 3){
            var result = Bezier.computeWaypoints(waypointsPerSection,controlpoints[i],controlpoints[i + 1],controlpoints[i + 2],controlpoints[i + 3])
            result.shift()
            waypoints = waypoints.concat(result)
        }
        return waypoints
    }

    static calcLength(waypoints:Vector[]){
        var length = 0;
        for(var i = 1; i < waypoints.length; i++){
            length += waypoints[i].to(waypoints[i - 1]).length()
        }
        return length;
    }

    static tween(t:number, waypoints:Vector[]){
        var lm1 = waypoints.length - 1;
        var low = Math.floor(lm1 * t)
        var high = Math.ceil(lm1 * t)
        return waypoints[low].lerp(waypoints[high],t*lm1 - Math.floor(t*lm1))
    }

    static constantDistanceWaypoints(waypoints:Vector[],numberOfWaypoints:number){
        var length = this.calcLength(waypoints);
        var spacing = length / (numberOfWaypoints - 1)
        var result:Vector[] = [first(waypoints).c()]
        
        var budget = 0
        for(var i = 0; i < waypoints.length - 1; i++){
            var a = waypoints[i]
            var b = waypoints[i + 1]
            var length = a.to(b).length()
            var remainingLength = budget
            budget += length
            var fits = Math.floor((remainingLength + length) / spacing) 
            budget -= fits * spacing
            for(var j = 1; j <= fits; j++){
                result.push(a.lerp(b,(j * spacing - remainingLength) / length))
            }
        }
        result.push(last(waypoints).c())
        return result
    }

    //points need to be guaranteed left to tight
    static cacheSlopeX(samplePoints:number,points:Vector[]):Vector[]{
        var result = []
        var spaces = samplePoints - 1;
        for(var i = 0; i < samplePoints; i++){
            result.push(new Vector(lerp(first(points).x, last(points).x, i / spaces), 0))
        }
        var sectionIndex = 0
        for(var point of result){
            var a = points[sectionIndex]
            var b = points[sectionIndex + 1]
            while(!inRange(a.x,b.x,point.x)){
                sectionIndex++
                a = points[sectionIndex]
                b = points[sectionIndex + 1]
            }
            point.y = map(point.x,a.x,b.x,a.y,b.y)
        }
        return result
    }
}

function first<T>(arr:T[]):T{
    return arr[0]
}

function cacheSin(precision:number){
    for(var i = 0; i < precision;i++){
        sinCache[i] = Math.sin((i / precision) * TAU)
    }
}

var sinCache = []
cacheSin(360)

function sinCached(radians:number){
    var percentage = mod(radians,TAU) / TAU
    var abs = percentage * sinCache.length
    var bot = Math.floor(abs)
    var top = Math.ceil(abs)
    var remains = abs - bot
    return lerp(sinCache[bot],sinCache[top % sinCache.length],remains)
}

function cacheCos(precision:number){
    for(var i = 0; i < precision;i++){
        cosCache[i] = Math.cos((i / precision) * TAU)
    }
}

var cosCache = []
cacheCos(360)

function cosCached(radians:number){
    var percentage = mod(radians,TAU) / TAU
    var abs = percentage * cosCache.length
    var bot = Math.floor(abs)
    var top = Math.ceil(abs)
    var remains = abs - bot
    return lerp(cosCache[bot],cosCache[top % cosCache.length],remains)
}

function rotate2d(v:Vector,rotations:number){
    var s = sinCached(rotations * TAU)
    var c = cosCached(rotations * TAU)
    var x = v.x * c - v.y * s
    var y = v.x * s + v.y * c
    v.x = x
    v.y = y
    return v
}

function rotate2dCenter(v:Vector,rotations:number,center:Vector){
    v.sub(center)
    rotate2d(v,rotations)
    v.add(center)
    return v
}

function loadImages(urls:string[]):Promise<HTMLImageElement[]>{
    var promises:Promise<HTMLImageElement>[] = []

    for(var url of urls){
        promises.push(new Promise((res,rej) => {
            var image = new Image()
            image.onload = e => {
                res(image)     
            }
            image.src = url
        }))
    }

    return Promise.all(promises)
}

function convertImages2Imagedata(images:HTMLImageElement[]):ImageData[]{
    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');
    var result:ImageData[] = []
    for(var img of images){
        canvas.width = img.width;
        canvas.height = img.height;
        context.drawImage(img, 0, 0 );
        result.push(context.getImageData(0, 0, img.width, img.height))
    }
    return result
}

function round(v:Vector){
    return v.map((arr,i) => arr[i] = Math.round(arr[i]))
}

function floor(v:Vector){
    return v.map((arr,i) => arr[i] = Math.floor(arr[i]))
}

function addrange<T>(a:T[],b:T[]){
    for(var v of b){
        a.push(v)
    }
}

function create2DArray<T>(size:Vector,filler:(pos:Vector) => T){
    var result = new Array(size.y)
    for(var i = 0; i < size.y;i++){
        result[i] = new Array(size.x)
    }
    size.loop2d(v => {
        result[v.y][v.x] = filler(v)
    })
    return result
}

function contains(box:Vector,point:Vector){
    return inRange(0,box.x,point.x) && inRange(0,box.y,point.y)
}

function get2DArraySize(arr:any[][]){
    return new Vector(arr[0].length,arr.length)
}

function index2D<T>(arr:T[][],i:Vector){
    return arr[i.y][i.x]
}

function copy2dArray<T>(arr:T[][]){
    return create2DArray(get2DArraySize(arr),pos => index2D(arr,pos))
}