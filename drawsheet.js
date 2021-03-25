let ctx
const SCENEMANAGER = new SceneManager()

const dots = []
let color
let thickness = 5

let colorInput
let dotSize
let animationTypeInputX
let animationTypeInputY

let numberOfDotsDrawn = 0

let title
let drawingCursor
let sheetDrawer
let signature

window.addEventListener("load", function () { setup() })

function setup() {
    let canvas = document.getElementById("canvas")
    ctx = canvas.getContext("2d")

    colorInput = document.getElementById("colorInput")
    dotSize = document.getElementById("dotSizeInput")
    animationTypeInputX = document.getElementById("animationtypeX")
    animationTypeInputY = document.getElementById("animationtypeY")

    CANVASDEFAULTS.sizePropertionOfInnerWindowY = 0.9
    CANVASDEFAULTS.backgroundFillStyle = "black"



    // this GO draws the score
    title = new GameObject("Drawing Sheet",
        {
            update: function (gameObject) {
                gameObject.sprite.text = "Drawing " + numberOfDotsDrawn + " dots."
            }
        }, true, 130, 50)
    title.sprite = new RenderText("Drawing Sheet", title, 20)
    title.sprite.fillStyle = "white"
    SCENEMANAGER.includeInScene(title, 5)

    // this GO 'places' dots on the canvas space
    drawingCursor = new GameObject("Pen", {
        drawing : false,
        update: function (gameObject) {
            if(drawingCursor.qualia.drawing){
                dots.push({
                    x: GAMEINPUT.mouse.x,
                    y: GAMEINPUT.mouse.y,
                    color: colorInput.value,
                    size: parseInt(dotSize.value, 10),
                    aniX: animationTypeInputX.value,
                    aniY: animationTypeInputY.value
                })
                numberOfDotsDrawn++
            }
        },
        playerInput: function (mousedownEvent) {
           drawingCursor.qualia.drawing = true
        },
        mouseUp: function (event){
            drawingCursor.qualia.drawing = false
        }
    })

    document.addEventListener("mouseup",drawingCursor.qualia.mouseUp)

    SCENEMANAGER.includeInScene(drawingCursor, 0)
    GAMEINPUT.subscribeToMouseDown(drawingCursor)

    // this GO draws the dots
    sheetDrawer = new GameObject("SheetDrawer",
        {
            update: function (gameObject) {
                for (let i = 0; i < dots.length; i++) {
                    const dot = dots[i];
                    ctx.fillStyle = dot.color

                    const sizeXNow = calcSize(dot.size, dot.aniX)
                    const sizeYNow = calcSize(dot.size, dot.aniY)

                    ctx.fillRect(dot.x, dot.y, sizeXNow, sizeYNow)

                    ctx.restore()
                }
            }
        })
    SCENEMANAGER.includeInScene(sheetDrawer, 0)

    // this GO draws the score
    signature = new GameObject("Who made it",
        {
            update: function (gameObject) {
                const x = ctx.canvas.width - 25
                const y = ctx.canvas.height - 25
                gameObject.transform.newPosition(x, y)
            }
        }, true)
    signature.sprite = new RenderText("KCN", signature, 14)
    signature.sprite.fillStyle = "white"
    SCENEMANAGER.includeInScene(signature, 5)



    GAMEINPUT.startDetectingInput()
    SCENEMANAGER.GAMELOOP.doLoop()
}

function calcSize(dotSize, functionChoice) {

    switch (functionChoice) {
        case "noani":
            return dotSize
        case "tan":
            return Math.tan(HEART.timeSinceStart) * dotSize
        case "sin":
            return Math.sin(HEART.timeSinceStart) * dotSize
        case "cos":
            return Math.cos(HEART.timeSinceStart) * dotSize
        default:
            return dotSize
    }
}

// removes 'drawn' dots from canvas
function cleanSheet(){
    numberOfDotsDrawn = 0

    dots.splice(0,dots.length)
}

function exportPoints(){

    dotString = ""

    for (i  = 0;i< dots.length; i++) {
      dotString =  dotString.concat(dots[i].color).concat(";")
    }

    console.log("Export Alpha: " + dotString)
}