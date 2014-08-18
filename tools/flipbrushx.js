function flipBrushXTool(editor) {
    "use strict";

    function init() {
        editor.fireCustomEvent("custombrush", {"operation": "flipx"});
        return false;
    }

    function toString() {
        return "Custom Brush FlipX";
    }

    return {
        "init": init,
        "toString": toString,
        "uid": "flipbrushx"
    };
}

AnsiEditController.addTool(flipBrushXTool, "tools-right", 91);