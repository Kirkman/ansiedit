function freehandTool(editor) {
    "use strict";
    var currentColor, lastPoint;

    function colorChange(col) {
        currentColor = col;
    }

    function freehand(block, currentColorBias) {
        editor.setBlock(block, currentColor, currentColorBias, currentColor);
    }

    function blockLine(from, to, currentColorBias) {
        editor.blockLine(from, to, function (block, setBlockLineBlock) {
            setBlockLineBlock(block, currentColor);
        }, currentColorBias, currentColor);
    }

    function canvasDown(coord) {
        editor.takeUndoSnapshot();
        if (coord.shiftKey && lastPoint) {
            blockLine(lastPoint, coord, !coord.altKey);
        } else {
            freehand(coord, !coord.altKey);
        }
        lastPoint = coord;
    }

    function canvasDrag(coord) {
        if (lastPoint) {
            blockLine(lastPoint, coord, !coord.altKey);
            lastPoint = coord;
        }
    }

    function init() {
        editor.addMouseDownListener(canvasDown);
        editor.addMouseDragListener(canvasDrag);
        editor.addColorChangeListener(colorChange);
        currentColor = editor.getCurrentColor();
        return true;
    }

    function remove() {
        editor.removeMouseDownListener(canvasDown);
        editor.removeMouseDragListener(canvasDrag);
        editor.removeColorChangeListener(colorChange);
    }

    function toString() {
        return "Freehand";
    }

    return {
        "init": init,
        "remove": remove,
        "toString": toString,
        "uid": "freehand",
        "autoselect": true
    };
}

AnsiEditController.addTool(freehandTool, "tools-right", 102);