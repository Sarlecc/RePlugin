/*:
* @plugindesc This Plugin allows you to create Achievements for your game.
* @author Sarlecc
*
*
* @help
* 
* Copyright (c) 2016, Sarlecc (Mythical Games)
* Permission to use, copy, modify, and/or distribute this software for the purposes defined
* here after: RPGmaker MV non-commercial game are hereby granted 
* provided that the above copyright notice and license number and this permission notice 
* appear in all copies.
* 
* SAR.achievements.achievementSwitch(global, name, description, gameSwitchID, reward, icon, bool)
* global = number 1 or 0
* name = string
* description = string
* gameSwitchID = number
* reward = number
* icon = number
* bool = optional true or false (false is default)
* 
* SAR.achievements.achievementVariable(global, name, description, gameVariableID, limit, reward, icon, bool)
* global = number 1 or 0
* name = string
* description = string
* gameVariableID = number
* limit = number (this is what the gameVariable must equal to recieve the achievement)
* reward = number
* icon = number
* bool = optional true or false (false is default)
* 
* to see the rest of the functions you have access too see the Manual
*
* UPDATE 1.1.0 changed the reward variable to be a common event id
* UPDATE 1.2.0 Fixed global achieves not being so global. Fixed anyGlobalAchieves switch now the id you use 
* will work for it.
* 
* @param anyGlobalAchieves
* @desc this is an id for a $gameSwitch which gets set to true when there is a global achievement file.
* @default 5
* 
* @param autoCheck
* @desc perform own checks to see if you got the requirements for an achievement? 0 or 1
* @default true
* 
*/
var SAR = SAR || {};
    (function ($) {
    	"use strict";
    	
    	var parameters = PluginManager.parameters('SAR_MVAchievements');
    	var anyGlobalAchieves = parseInt(parameters.anyGlobalAchieves || '5', 10);
    	var autoCheck = String(parameters.autoCheck || 'true');
		
		/**
		 * initializes the achievement arrays
		 * and allows use of all other methods.
		 * @method initAchieve 
		 */
		
    	$.initAchieve = function() {  
	    
	    	var _AchievementList = [];
	    	var _AchievementListGlob = [];
	    
	    $.achievements = {	
	    	
	    /**
	     * create an achievement tied to a $gameSwitches
	     * @method achievementSwitch
	     * @param global   {Number}  any number for non global 1 for global
	     * @param name     {String}  name of the achievement
	     * @param desc     {String}  description of the achievement
	     * @param switchID {Number}  id for a $gameSwitches
	     * @param reward   {Number}  number value common event id
	     * @param icon     {Number}  number of the icon in the icon list
	     * @param bool     {Boolean} optional if true then the achievement has been awarded
	    */
		achievementSwitch: function (global, name, desc, switchID, reward, icon, bool) {
			var achieve = {			
		    name:         name,
			description:  desc,
			gameSwitchID: switchID,
			limit:        true,
			reward:       reward,
			icon:         icon,
            bool:         typeof bool === "boolean" ? bool : false,
            progress:     0,
            global:       global
          };
          if (global === 1){
          	_AchievementListGlob.push(achieve);
          } else {
            _AchievementList.push(achieve);
          }
		},
		
		/**
	     * create an achievement tied to a $gameVariables
	     * @method achievementVariable
	     * @param global     {Number}  any number for non global 1 for global
	     * @param name       {String}  name of the achievement
	     * @param desc       {String}  description of the achievement
	     * @param variableID {Number}  id for a $gameVariables
	     * @param limit      {Number}  number of tasks that must happen before you get the achievement
	     * @param reward     {Number}  common event id
	     * @param icon       {Number}  number of the icon in the icon list
	     * @param bool       {Boolean} optional if true then the achievement has been awarded
	    */
        achievementVariable: function (global, name, desc, variableID, limit, reward, icon, bool) {
			var achieve = {			
		    name:           name,
			description:    desc,
			gameVariableID: variableID,
			limit:          typeof limit === "number" ? limit : 1,
			reward:         reward,
			icon:           icon,
            bool:           typeof bool === "boolean" ? bool : false,
            progress:       0,
            global:         global
          };
          if (global === 1) {
            _AchievementListGlob.push(achieve);
          } else {
          	_AchievementList.push(achieve);
          }
		},
		
		 /**
		  * seals both achievement lists so no more achievements may be added
		  * @method sealIt
		  * @param global {Boolean} true or false
		  * @return {Boolean} true 
		  */
		  sealIt: function (global) {
		  	if (global === true) {
		  		Object.seal(_AchievementListGlob);
		  		return true;
		  	} else {
		    	Object.seal(_AchievementList);
		    	return true;
		    }
		  },
		  
		  /**
		   * checks if an achievement list has been sealed
		   * @method hasSeal
		   * @param global {Boolean} true or false
		   * @return {Boolean} seal status of the achievement lists
		   */
		  
		  hasSeal: function (global) {
		  	if (global === true) {
		  	   return Object.isSealed(_AchievementListGlob);
		  	} else {
		  	   return Object.isSealed(_AchievementList);
		  	}
		  },
		  
		
		/**
		 * returns the size of the achievement list
		 * @method getSize
		 * @param global {Boolean} asks for the global achievement list if true
		 * @return {Number} the length of the achievement list
		 */
		   getSize: function (global) {
		   	if (global === true){
		   		return _AchievementListGlob.length;
		   	} else {
		   		return _AchievementList.length;
		   	}
		   },
		  
		  /**
		   * returns the entire achievement list
		   * @method getAchieves
		   * @param global {Boolean} asks for the global achievement list if true
		   * @return {Array} the achievement list
		   */
		   getAchieves: function (global) {
		   	if (global === true){
		   		return _AchievementListGlob;
		   	} else {
		   		return _AchievementList;
		   	}
		   },
		   
		   /**
		    * returns all of the achievements
		    * @method allAchieves
		    * @return {Array} both the global and non global achievement lists
		    */
		   allAchieves: function () {
		   	 return this.getAchieves(true).concat(
		   	        this.getAchieves(false));
		   },
		   
		   /**
		    * returns the size of all the achievements global plus non global
		    * @method allSize
		    * @return {Number} size of all the achievements 
		    */
		   allSize: function () {
		   	 return this.allAchieves().length;
		   },
		   
		   /**
		    * returns achievement information using bracket notation
		    * @method getProperty
		    * @param index {Number} index for the achievement
		    * @param property {String} the the information to access i.e "name", "description" or "progress"
		    * @return {Varies} will be information based on what was accessed.
		    */
		   getProperty: function (index, property) {
		   	try {
		   		if (this.allAchieves()[index] === undefined) {
		   			throw new Error("index " + index + " is not an index for achievements.")
                } else if (this.allAchieves()[index][property] === undefined) {
                	if (property !== 'gameSwitchID' && property !== 'gameVariableID') { 
		   		        throw new Error("No such property '" + property + "' for achievements."); 
		   		    }
		   		}
		   		return this.allAchieves()[index][property];
		    } catch (e) {
		   		SceneManager.catchException(e);
		   	}
		   },
		   
		   /**
		    * returns the $gameSwitches value as a number
		    * @method convertSwitchValue
		    * @param i {Number} index of the achievement
		    * @return {Number} value of the $gameSwitches as a number. 1 : 0 
		    */
		   convertSwitchValue: function (index) {
		   	if (index < this.allSize() && typeof index === 'number' && index !== null){
		   		return $gameSwitches.value(this.allAchieves()[index].gameSwitchID) | 0;
		   	} else {
		   		console.warn("Value " + index + " is not a valid index");
		   	}
		   },
		   
		   /**
		    * changes the bool value of the achievement equal to value
		    * @method changeValue
		    * @param global {Boolean} asks for the global achievement list if true
		    * @param i {Number} index of the achievement
		    * @param value {Boolean} value to change the achievement bool too.
		    * @return {Boolean} bool value of the achievement
		    */
		   changeValue: function (global, i, value) {
		   	if (global === true){
		   		_AchievementListGlob[i].bool = value;
		   		return _AchievementListGlob[i].bool;
		   	} else {
		   		_AchievementList[i].bool = value;
		   	    return _AchievementList[i].bool;
		   	}
		   },
		   
		   /**
		    * change the bool value of all (global : nonGlobal) achievements to value
		    * @method changeValueAll
		    * @param global {Boolean} asks for the global achievement list if true
		    * @param value {Boolean} value to change the achievement bool too.
		    * @return does not return a value 
		    */
		   changeValueAll: function (global, value) {
		   	var i = 0;
		   	var lengthG = _AchievementListGlob.length;
		   	var lengthN = _AchievementList.length;
		   	if (global === true){
		   		for(i = 0; i < lengthG; i++){
		   			SAR.changeValue(global, i, value);
		   		}
		   	} else {
		   		for(i = 0; i < lengthN; i++){
		   			SAR.changeValue(global, i, value);
		   		}
		   	}
		   },
		   
		   /**
		    * checks the progress of all (global : non global) achievements
		    * calls _updateSwitchAchieve or _updateVariableAchieve depending on it's
		    * limit type. Goes to the next index if the achievement bool is true.
		    * @method checkProgress
		    * @param global {Boolean} asks for the global achievement list if true
		    * @return does not return a value
		    */

		   checkProgress: function () {
		   	var i = 0;
		   	var size = this.allSize();
		   		for (i = 0; i < size; i++){
		   	  		if (!this.getProperty(i, 'bool')){
		   		 		if (this.getProperty(i, 'limit') === true){
		  	 				_updateSwitchAchieve(i);
		 	  	 		} else if (typeof this.getProperty(i, 'limit') === 'number'){
			   				_updateVariableAchieve(i);
		 	  	 		}
		 	  	 		continue;
			  	 	}
		 	  	}
		   },
		   
		   /**
		    * loads achievements backinto the achievement arrays
		    * this method may be changed in the future to only allow arrays
		    * @method loadAchieves
		    * @param global {Boolean} loads into the global achievement list if true
		    * @param arg {Array} data to be loaded 
		    */
		   loadAchieves: function (global, arg) {
		   	if (global === true){
		   		_AchievementListGlob = arg;
		   		_updateValues();
		   	} else {
		   		_AchievementList = arg;
		   	}
		   }
		   
		};

		  var _updateSwitchAchieve = function (arg) {
		  	if ($.achievements.getProperty(arg, 'global') !== 0){
		  		if ($gameSwitches.value($.achievements.getProperty(arg, 'gameSwitchID')) === $.achievements.getProperty(arg, 'limit')){
		 	  		$.achievements.changeValue(true, arg, true);
		 	  		_AchievementListGlob[arg].progress = 1;
		 	  		$gameTemp.reserveCommonEvent(_AchievementListGlob[arg].reward);
		 	  		_popup(arg);
		 	  		DataManager.saveAchievesWithoutRescue(21);
		 	  	}
		  	} else {
		  		if ($gameSwitches.value($.achievements.getProperty(arg, 'gameSwitchID')) === $.achievements.getProperty(arg, 'limit')){
		  			_popup(arg);
		  			arg -= $.achievements.getSize(true);
		 	  		this.changeValue(false, arg, true);
		 	  		$gameTemp.reserveCommonEvent(_AchievementList[arg].reward);
		 	  		_AchievementList[arg].progress = 1;
		 	  	}
		  	}
		   };

		  var _updateVariableAchieve = function (arg) {
		  	var num = 0;
		  	if ($.achievements.getProperty(arg, 'global') !== 0){
		  		if ($gameVariables.value($.achievements.getProperty(arg, 'gameVariableID')) >= $.achievements.getProperty(arg, 'limit')){
			   		$.achievements.changeValue(true, arg, true);
			   		_AchievementListGlob[arg].progress = 1;
			   		$gameTemp.reserveCommonEvent(_AchievementListGlob[arg].reward);
			   		_popup(arg);
			   		DataManager.saveAchievesWithoutRescue(21);
		 	  	} else {
		 	  		num = ($gameVariables.value($.achievements.getProperty(arg, 'gameVariableID')) / $.achievements.getProperty(arg, 'limit'));
		 	  		_AchievementListGlob[arg].progress = num;
		 	  		DataManager.saveAchievesWithoutRescue(21);
		 	  	}
		  	} else {
		  		if ($gameVariables.value($.achievements.getProperty(arg, 'gameVariableID')) >= $.achievements.getProperty(arg, 'limit')){
		  			_popup(arg);
		  			arg -= $.achievements.getSize(true);
			   		$.achievements.changeValue(false, arg, true);
			   		$gameTemp.reserveCommonEvent(_AchievementList[arg].reward);
			   		_AchievementList[arg].progress = 1;
		 	  	} else {
		 	  		num = ($gameVariables.value($.achievements.getProperty(arg, 'gameVariableID')) / $.achievements.getProperty(arg, 'limit'));
		 	  		arg -= $.achievements.getSize(true);
		 	  		_AchievementList[arg].progress = num;
		 	  	}
		  	}	
		   };
		   
		   var _popup = function (arg) {
		   	    if (SAR.Popup) {
			   	SAR.Popup.setIcon($.achievements.getProperty(arg, 'icon'));
		 	    SAR.Popup.add("" + $.achievements.getProperty(arg, 'name') + "achievement complete!");
		 	    }
		   };
		   
		   var _updateValues = function () {
		   	var i = 0;
		   	var lengthG = _AchievementListGlob.length;
		   	for (i = 0; i < lengthG; i++){
		   		if (_AchievementListGlob[i].limit === true){
		   			if (_AchievementListGlob.bool){
		   				$gameSwitches.setValue(_AchievementListGlob[i].gameSwitchID, true);
		   			} else {
		   				continue;
		   			}
		   		} else if (typeof _AchievementListGlob[i].limit === 'number'){
		   			if (_AchievementListGlob[i].bool === true){
		   				$gameVariables.setValue(_AchievementListGlob[i].gameVariableID,
		   					_AchievementListGlob[i].limit);
		   			} else {
		   				$gameVariables.setValue(_AchievementListGlob[i].gameVariableID,
		   					_AchievementListGlob[i].progress);
		   			}
		   		}
		   	 }
		   };   
	};

	      (function ($) {
	      	
	      	var DataManager_createAchieves = $.createGameObjects;
	      	
	      	$.createGameObjects = function () {
	      		DataManager_createAchieves.call(this);
	      		SAR.initAchieve();
	      		if (StorageManager.exists(21)){
	      			this.loadAchievesWithoutRescue(21);
	      			$gameSwitches.setValue(anyGlobalAchieves, true);
	      		}
	      	};
	      	
	      	var data_saveGameWithoutRescue = $.saveGameWithoutRescue;
	      	
	      	$.saveGameWithoutRescue = function (savefileId) {
	      		this.saveAchievesWithoutRescue(21);
	      		data_saveGameWithoutRescue.call(this, savefileId);
	      		return true;
	      	};
	      	
	      	$.saveAchievesWithoutRescue = function (savefileId) {
	      		var contents = {};
	      		contents.achieves = SAR.achievements.getAchieves(true);
	      		contents.variables = $gameVariables;
	      		contents.switches = $gameSwitches;
	      		var json = JsonEx.stringify(contents);
    			if (json.length >= 200000) {
        			console.warn('Save data too big!');
    			}
    			StorageManager.save(savefileId, json);
	      	};
	      	
	      	$.loadAchievesWithoutRescue = function (savefileId) {
	      		var json = StorageManager.load(savefileId);
        		SAR.achievements.loadAchieves(true, JsonEx.parse(json).achieves);
        		$gameVariables = JsonEx.parse(json).variables;
        		$gameSwitches = JsonEx.parse(json).switches;
	      	};
	      	
	      	var data_makeSaveContents = $.makeSaveContents;
	      	
	      	$.makeSaveContents = function () {
	      		var contents = data_makeSaveContents.call(this);
	      		contents.achievements = SAR.achievements.getAchieves(false);
	      		return contents;
	      	};
	      	
	      	var DataManager_extractSaveContents = $.extractSaveContents;
	      	
	      	$.extractSaveContents = function (contents) {
	      		DataManager_extractSaveContents.call(this, contents);
	      		var data = contents.achievements;
	      		SAR.achievements.loadAchieves(false, data);
	      	};
	      	
	      })(DataManager);
	
		   
		   (function($){
		   	 var Game_Switches_Changing = $.prototype.onChange;
 
 		   	 $.prototype.onChange = function () {
   		   		Game_Switches_Changing.call(this);
   		   		if (autoCheck === 'true') {
   		   		SAR.achievements.checkProgress();
   		   	    }
             };
            })(Game_Switches);
            
            (function($){ 
             var Game_Variables_Changing = $.prototype.onChange;
 
 		   	 $.prototype.onChange = function () {
   		   		Game_Variables_Changing.call(this);
   		   		if (autoCheck === 'true') {
   		   		SAR.achievements.checkProgress();
   		   		}
             };
           })(Game_Variables);
            
            (function($){
    		var _Game_Interpreter_pluginCommand = $.prototype.pluginCommand;
    		
    		$.prototype.pluginCommand = function(command, args) {
       		_Game_Interpreter_pluginCommand.call(this, command, args);
       		var _SARstr, _SARname = "";
       		if (command === "SarleccAchievementsSwitch"){
       			_SARname = args[1].replace(/[\.*]/g, " ");
       			_SARstr = args[2].replace(/[\.*]/g, " ");
       			_SARstr = _SARstr.replace(/\\n*/g, "\n");
       			SAR.achievements.achievementSwitch(parseInt(args[0], 10), _SARname, _SARstr, parseInt(args[3], 10),
       			                                   parseInt(args[4], 10), parseInt(args[5], 10));
       		} else if (command === "SarleccAchievementsVariable"){
       			_SARname = args[1].replace(/[\.*]/g, " ");
       			_SARstr = args[2].replace(/[\.*]/g, " ");
       			_SARstr = _SARstr.replace(/\\n*/g, "\n");
       			SAR.achievements.achievementVariable(parseInt(args[0], 10), _SARname, _SARstr, parseInt(args[3], 10),
       			                                     parseInt(args[4], 10), parseInt(args[5], 10),
       			                                     parseInt(args[6], 10));
           }
         };
         })(Game_Interpreter);
         	  
})(SAR);


