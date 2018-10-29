"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var NODE_TYPE_1 = require("./NODE_TYPE");
var compose_1 = require("./compose");
var log_1 = require("./middlewares/log");
var interaction_1 = require("./middlewares/interaction");
var layout_1 = require("./middlewares/layout");
var style_1 = require("./middlewares/style");
var grid_1 = require("./middlewares/grid");
var scaleCanvas_1 = require("./middlewares/scaleCanvas");
var moveCanvas_1 = require("./middlewares/moveCanvas");
var moveNode_1 = require("./middlewares/moveNode");
var event_1 = require("./middlewares/event");
var applyMiddlewares_1 = require("./applyMiddlewares");
var createStage_1 = require("./createStage");
var createMergeAdapter_1 = require("./adapters/createMergeAdapter");
var createFixAdapter_1 = require("./adapters/createFixAdapter");
var clone_1 = require("./clone");
var createImageNode_1 = require("./components/createImageNode");
var createImageNodeOption_1 = require("./adapters/createImageNodeOption");
var createServiceNode_1 = require("./components/createServiceNode");
var createServiceNodeOptionAdapter_1 = require("./adapters/createServiceNodeOptionAdapter");
var createArrowLine_1 = require("./components/createArrowLine");
var createArrowLineOptionAdapater_1 = require("./adapters/createArrowLineOptionAdapater");
var components_1 = require("./components/components");
var formatDataAdapter = compose_1.default(createFixAdapter_1.default, createMergeAdapter_1.default, function (data) {
    if (!data.nodes)
        data.nodes = [];
    if (!data.links)
        data.links = [];
    return data;
}, clone_1.default);
var imageNode = compose_1.default(createImageNode_1.default, createImageNodeOption_1.default);
var serviceNode = compose_1.default(createServiceNode_1.default, createServiceNodeOptionAdapter_1.default);
var arrowLine = compose_1.default(createArrowLine_1.default, createArrowLineOptionAdapater_1.default);
// Entrance, start from here
exports.default = (function (container, eventOption, updated) {
    var enhancer = applyMiddlewares_1.default(log_1.log, layout_1.layout, interaction_1.interaction, style_1.style, scaleCanvas_1.scaleCanvas, moveCanvas_1.moveCanvas, moveNode_1.moveNode, event_1.event(eventOption), grid_1.grid);
    var createStageAt = enhancer(createStage_1.default);
    var _a = createStageAt(container), create = _a.create, subscribe = _a.subscribe, patch = _a.patch, getStageNode = _a.getStageNode;
    updated && subscribe(updated);
    patch();
    // Expose update method
    return function (data, option) {
        var root = getStageNode();
        if (option) {
            root.data.attrs = components_1.createSvg(option).data.attrs;
        }
        var formattedData = formatDataAdapter(data);
        // map every node to strategy function which return a VNode
        formattedData.nodes.forEach(function (item) {
            if (item.type === NODE_TYPE_1.NODE_TYPE.SERVER) {
                create(serviceNode(item));
            }
            else {
                create(imageNode(item));
            }
        });
        // map every line to strategy function which return a VNode
        formattedData.links.forEach(function (item) {
            create(arrowLine(item));
        });
        patch(formattedData);
    };
});
