/*:
 * @plugindesc This plugin is one of the premade scene styles for MVAchievements
 * @author Sarlecc
 * @help
 *   First scene style for SAR_MVAchievements
 * 
 * Copyright (c) 2016, Sarlecc (Mythical Games)
 * Permission to use, copy, modify, and/or distribute this software for the purposes defined
 * here after: RPGmaker MV non-commercial game are hereby granted provided that the above copyright notice 
 * and this permission notice appear in all copies.
 * 
 * @param headerText
 * @desc sets the text at the top of the scene
 * @default Sarlecc's MV Achievements
 * 
 * @param commandName
 * @desc sets the text of the menu command that opens the achievement scene
 * @default Achievements
 */

var parameters = PluginManager.parameters('Achievement_Scene_Style1');
var headerText = String(parameters['headerText'] || "Sarlecc's MV Achievements");
var commandName = String(parameters['commandName'] || "Achievements");

(function($){
    var Window_MenuCommand_addAchieveCommand = $.prototype.addOriginalCommands;
    $.prototype.addOriginalCommands = function (){
    	Window_MenuCommand_addAchieveCommand.call(this);
    	this.addCommand(commandName, 'achievements', true);
    };
})(Window_MenuCommand);
         
(function($){
    var Scene_Menu_createAchieveCommand = $.prototype.createCommandWindow;
         	
    $.prototype.createCommandWindow = function (){
     	Scene_Menu_createAchieveCommand.call(this);
        this._commandWindow.setHandler('achievements', this.commandAchievements.bind(this), true);
    };
         	
    $.prototype.commandAchievements = function() {
   		SceneManager.push(Scene_Achievements);
    };
})(Scene_Menu);
			
//Window_Achievement_Header
function Window_Achievement_Header() {
    this.initialize.apply(this, arguments);
}

Window_Achievement_Header.prototype = Object.create(Window_Base.prototype);
Window_Achievement_Header.prototype.constructor = Window_Achievement_Header;

Window_Achievement_Header.prototype.initialize = function(numLines) {
    var width = Graphics.boxWidth;
    var height = this.fittingHeight(numLines || 2);
    Window_Base.prototype.initialize.call(this, 0, 0, width, height);
    this._text = headerText;
    this.drawText(this._text, 190, 6);
};

// Window_Achievements
function Window_Achievements() {
    this.initialize.apply(this, arguments);
}

Window_Achievements.prototype = Object.create(Window_Selectable.prototype);
Window_Achievements.prototype.constructor = Window_Achievements;

Window_Achievements.prototype.initialize = function(x, y) {
    var width = this.windowWidth();
    var height = this.windowHeight();
    Window_Selectable.prototype.initialize.call(this, x, y, width, height);
    this._pendingIndex = -1;
    this.refresh();
    this.activate();
};

Window_Achievements.prototype.windowWidth = function() {
    return Graphics.boxWidth;
};

Window_Achievements.prototype.windowHeight = function() {
    return Graphics.boxHeight - 75;
};

Window_Achievements.prototype.maxItems = function() {
    return (SAR.achievements.allSize());
};

Window_Achievements.prototype.itemHeight = function() {
    var clientHeight = this.height - this.padding * 2;
    return Math.floor(clientHeight / this.numVisibleRows());
};

Window_Achievements.prototype.numVisibleRows = function() {
    return 5;
};

Window_Achievements.prototype.drawItem = function(index) {
    this.drawItemBackground(index);
    this.drawItemImage(index);
    this.drawItemStatus(index);
};

Window_Achievements.prototype.drawItemBackground = function(index) {
    if (index === this._pendingIndex) {
        var rect = this.itemRect(index);
        var color = this.pendingColor();
        this.changePaintOpacity(false);
        this.contents.fillRect(rect.x, rect.y, rect.width, rect.height, color);
        this.changePaintOpacity(true);
    }
};


Window_Achievements.prototype.drawItemImage = function(index) {
    var achieve = SAR.achievements.allAchieves()[index];
    var rect = this.itemRect(index);
    this.changePaintOpacity(SAR.achievements.getProperty(index, 'bool'));
    this.drawIcon(achieve.icon, rect.x + 1, rect.y + 34);
    this.changePaintOpacity(true);
};

Window_Achievements.prototype.drawItemStatus = function(index) {
    var achieve = SAR.achievements.allAchieves()[index];
    var rect = this.itemRect(index);
    var x = rect.x + 100;
    var y = rect.y + rect.height / 2 - this.lineHeight() * 1.5;
    var width = rect.width - x - this.textPadding();
    this.drawAchieveStatus(achieve, x, y, width, index);
};

Window_Achievements.prototype.drawAchieveStatus = function(achieve, x, y, width, index) {
    var lineHeight = this.lineHeight();
    var width2 = Math.min(200, width - 180 - this.textPadding());
    this.drawText(achieve.name, x - 48, y + 34);
    this.drawTextEx(achieve.description, x + 100, (y + lineHeight * 1) - 30);
    this.drawGauge(x, (y + lineHeight * 2) - 6, width, achieve.progress, this.textColor(18), this.textColor(3))
    this.drawText("" + +(Math.round((achieve.progress * 100) + "e+2") + "e-2") + "%", x + 594, y + lineHeight * 2)
    if (typeof achieve.limit !== "number") {
    this.drawText("" + SAR.achievements.convertSwitchValue(index) + "/1", x + 500, y + lineHeight * 2);
    } else {
    this.drawText("" + $gameVariables.value(achieve.gameVariableID) + "/" + achieve.limit + "", x + 500, y + lineHeight * 2);	
    };
};

Window_Achievements.prototype.processOk = function() {
    Window_Selectable.prototype.processOk.call(this);
};

Window_Achievements.prototype.pendingIndex = function() {
    return this._pendingIndex;
};

Window_Achievements.prototype.setPendingIndex = function(index) {
    var lastPendingIndex = this._pendingIndex;
    this._pendingIndex = index;
    this.redrawItem(this._pendingIndex);
    this.redrawItem(lastPendingIndex);
};

// Scene_Achievements
function Scene_Achievements() {
    this.initialize.apply(this, arguments);
}

Scene_Achievements.prototype = Object.create(Scene_MenuBase.prototype);
Scene_Achievements.prototype.constructor = Scene_Achievements;

Scene_Achievements.prototype.initialize = function() {
    Scene_MenuBase.prototype.initialize.call(this);
};

Scene_Achievements.prototype.create = function() {
    Scene_MenuBase.prototype.create.call(this);
    this.createAchievementsWindow();
    this.createHeaderWindow();
};

Scene_Achievements.prototype.start = function() {
    Scene_MenuBase.prototype.start.call(this);
    this._achievementsWindow.refresh();
};

Scene_Achievements.prototype.createAchievementsWindow = function() {
    this._achievementsWindow = new Window_Achievements(0, 75);
    this.addWindow(this._achievementsWindow);
    this._achievementsWindow.setHandler('cancel', this.popScene.bind(this));
};

Scene_Achievements.prototype.createHeaderWindow = function(){
	this._headerWindow = new Window_Achievement_Header(1.09);
	this.addWindow(this._headerWindow);
};
