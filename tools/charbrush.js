function charBrushTool(options) {
    "use strict";

    return function (editor) {
        var currentColor, lastPoint, mode;

        mode = 0;

        function colorChange(col) {
            currentColor = col;
        }

        function charBrush(block) {
            editor.setChar(block, options.characters[mode].charCode, currentColor);
        }

        function sampleTextBlock(coord) {
            if (coord.isBlocky) {
                editor.setCurrentColor(coord.isUpperHalf ? coord.upperBlockColor : coord.lowerBlockColor);
            } else {
                editor.setCurrentColor(coord.foreground);
            }
        }

        function canvasDown(coord) {
            if (coord.ctrlKey) {
                sampleTextBlock(coord);
            } else {
                editor.startOfDrawing();
                if (coord.shiftKey && lastPoint) {
                    editor.blockLine(lastPoint, coord, charBrush);
                } else {
                    charBrush(coord);
                }
                lastPoint = coord;
            }
        }

        function canvasDrag(coord) {
            if (coord.ctrlKey) {
                sampleTextBlock(coord);
            } else {
                if (lastPoint) {
                    editor.blockLine(lastPoint, coord, charBrush);
                    lastPoint = coord;
                }
            }
        }

        function init() {
            editor.addMouseDownListener(canvasDown);
            editor.addMouseDragListener(canvasDrag);
            editor.addMouseUpListener(editor.endOfDrawing);
            editor.addMouseOutListener(editor.endOfDrawing);
            editor.addColorChangeListener(colorChange);
            currentColor = editor.getCurrentColor();
            return true;
        }

        function remove() {
            editor.removeMouseDownListener(canvasDown);
            editor.removeMouseDragListener(canvasDrag);
            editor.removeMouseUpListener(editor.endOfDrawing);
            editor.removeMouseOutListener(editor.endOfDrawing);
            editor.removeColorChangeListener(colorChange);
        }

        function modeChange(shiftKey) {
            if (shiftKey) {
                if (--mode < 0) {
                    mode = options.characters.length - 1;
                }
            } else {
                if (++mode === options.characters.length) {
                    mode = 0;
                }
            }
        }

        function toString() {
            return options.characters.length ? options.name + ": " + options.characters[mode].name : options.name;
        }

        return {
            "init": init,
            "modeShiftKey": (options.characters.length > 2),
            "remove": remove,
            "modeChange": modeChange,
            "toString": toString,
            "uid": "charbrush-" + options.name
        };
    };
}