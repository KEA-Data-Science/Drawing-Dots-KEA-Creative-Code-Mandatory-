let ctx
const SCENEMANAGER = new SceneManager() // manages all objects in scene / canvas / sheet

const dots = [] // dots that are drawn

let colorInput // references colorInput element
let dotSize // references dotSizeInput element
let animationTypeInputX // references a..X element
let animationTypeInputY // references a..Y element

let numberOfDotsDrawn = 0

let title // GameObject object, displays title
let drawingCursor // GO object, places dots on the sheet
let sheetDrawer // GO object, draws dots on the sheet
let signature // GO object, display name in corner

window.addEventListener("load", function () {
    setup()
})

// initialize all variables and start scene
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
        drawing: false,
        update: function (gameObject) {
            if (drawingCursor.qualia.drawing && GAMEINPUT.mouse.y < ctx.canvas.height) {
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
        playerInput: function (e) {
            drawingCursor.qualia.drawing = true
        },
        mouseUp: function (e) {
            drawingCursor.qualia.drawing = false
        }
    })
    document.addEventListener("mouseup", drawingCursor.qualia.mouseUp)
    GAMEINPUT.subscribeToMouseDown(drawingCursor)
    SCENEMANAGER.includeInScene(drawingCursor, 0)

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

    // this GO draws the signature
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

// returns a number based on dotSize that is
// multiplied by the return value of the functionChoice (sin,cos,tan),
// itself applied to the number of seconds since the beginning of the scene.
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

// removes 'drawn' dots from canvas / gives a clean sheet
function cleanSheet() {
    numberOfDotsDrawn = 0
    dots.splice(0, dots.length)
}

// Skimpy proof of concept for another time; the basic idea is to
// export all dots in sequence, representing their qualities as a string.
// At a later time, that string can be 'loaded' to reproduce the original.
// AT CURRENT: only exports the color of each dot to the console log.
function exportPoints() {
    dotString = ""

    for (i = 0; i < dots.length; i++) {
        dotString = dotString.concat(dots[i].color).concat(";")
    }

    console.log("Export Alpha: " + dotString)
}