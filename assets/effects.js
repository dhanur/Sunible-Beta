/*******************************************************************
***
***							TRANSITIONS VERSION II
***
****************************************************************/

/*
  if(animation == "spiral")
    {
      steps = stepsSpiral
      v = step/steps
      rf = 1.0 - v
      t = v * 2.0*Math.PI
      rx = Math.max(Math.abs(el.initLeft), 200)
      ry = Math.max(Math.abs(el.initTop),  200)
      el.style.posLeft = Math.ceil(-rf*Math.cos(t)*rx)
      el.style.posTop  = Math.ceil(-rf*Math.sin(t)*ry)
    }
*/

function F_cFly(theObject, theParm) {
	//Setup		
	this.type = "move";
	this.object = theObject;
	this.controller = new F_cEffectController(theObject, theParm);

	//Set distances
	if(F_NN && (theObject.parent != null)) {
		var topOffset = theObject.getTop('absolute') - (theObject.parent.getTop('absolute') + theObject.parent.getClipTop());
		var leftOffset = theObject.getLeft('absolute') - (theObject.parent.getLeft('absolute') + theObject.parent.getClipLeft());
		var bottomOffset = theObject.parent.getClipHeight() - topOffset;
		var rightOffset = theObject.parent.getClipWidth() - leftOffset;
	} else {
		var topOffset = theObject.getTop('absolute') - theObject.getPageYOffset();
		var leftOffset = theObject.getLeft('absolute') - theObject.getPageXOffset();
		var bottomOffset = theObject.getWindowInnerHeight() - topOffset;
		var rightOffset = theObject.getWindowInnerWidth() - leftOffset;
	}
	var clipX = theObject.getClipWidth();
	var clipY = theObject.getClipHeight();
	//alert('fly :: clipX' + clipX + ', clipY' + clipY )	;
	var d = this.controller.theDirection;
//	F_debug(theObject.getTop('absolute') +" "+ theObject.getPageYOffset() + " " + clipY);
	if((d == 0) || (d > 270))
	{
		var p = F_calcDirection(d, leftOffset + clipX, topOffset + clipY);
	}
	else 
	{
		if(d <= 90)
		{
			var p = F_calcDirection(d, rightOffset, topOffset + clipY);			
		}
		else 
		{
			if(d <= 180)
			{
				var p = F_calcDirection(d, rightOffset, bottomOffset);
			}
			else 
			{
				if(d <= 270)
				{
					var p = F_calcDirection(d, leftOffset + clipX, bottomOffset);
				}
			}
		}
	}	
	//alert('fly :: p.x=' + p.x + ', p.y' + p.y )
	this.controller.setDestination(p.x, -p.y, 0, 0, 0, 0);
}

F_cFly.prototype = new F_effectPrototype;

function F_cMoveBy(theObject, theParm) {
	//Setup
	this.type = "move";
	this.object = theObject;
	this.controller = new F_cEffectController(theObject, theParm);
	this.controller.showHide = "";
	this.controller.resetPosition = false;


	//Set distances
//	var x = parseFloat(theParm.getParm( "x", 0));
//	var y = parseFloat(theParm.getParm( "y", 0));
	var x = theParm.getParm( "x", 0);
	var y = theParm.getParm( "y", 0);
//	alert(x+" "+y);
	this.controller.setDestination(x, y, 0, 0, 0, 0);
}

F_cMoveBy.prototype = new F_effectPrototype;

function F_cMoveTo(theObject, theParm) {
	//Setup
	this.type = "move";
	this.object = theObject;
	this.controller = new F_cEffectController(theObject, theParm);
	this.controller.showHide = "";
	this.controller.resetPosition = false;

	//Set distances
	if(theParm == "Saved Position") {
		var x = theObject.savedPosition.x - theObject.getLeft('style');
		var y = theObject.savedPosition.y - theObject.getTop('style');		
	} else {
//		alert( theObject.getLeft('absolute'));
//		var x = parseFloat(theParm.getParm( "x", 0)) - theObject.getLeft('absolute');
//		var y = parseFloat(theParm.getParm( "y", 0)) - theObject.getTop('absolute');
		var x = theParm.getParm( "x", 0) - theObject.getLeft('absolute');
		var y = theParm.getParm( "y", 0) - theObject.getTop('absolute');		
	}
	this.controller.setDestination(x, y, 0, 0, 0, 0);
}

F_cMoveTo.prototype = new F_effectPrototype;

function F_cPeek(theObject, theParm) {
	//Setup
	this.type = "transition";
	this.object = theObject;
	this.controller = new F_cEffectController(theObject, theParm);

	//Set distances
	//alert("peek :: " + theObject.getClipHeight()+" " +theObject.getClipBottom())
	var width = theObject.getClipWidth();
	var height = theObject.getClipHeight();
	var p = F_calcDirection(this.controller.theDirection, width, height);
	//alert("peek :: " + this.controller.direction+" "+width+" "+height);
	var t = new cEffectParms(0,0,0,0,0,0);
	t.x = p.x;
	t.y = -p.y;
	//alert('top=' + t.top + ', left=' + t.left)		
	F_calculateClip(this.controller.theDirection, t, p);
	this.controller.setDestination(t.x, t.y, t.top, t.right, t.right, t.left);
}

F_cPeek.prototype = new F_effectPrototype;


function F_cWipe(theObject, theParm) {
	//Setup
	this.type = "transition";
	this.object = theObject;
	this.controller = new F_cEffectController(theObject, theParm);


	//Set distances
	this.controller.theDirection = (180+this.controller.theDirection)%360;
	var width = theObject.getClipWidth();
	var height = theObject.getClipHeight();
	var p = F_calcDirection(this.controller.theDirection, width, height);
	var t = new cEffectParms(0,0,0,0,0,0);
	F_calculateClip(this.controller.theDirection, t, p);
	//alert('x=' + t.x + ', y=' + t.y)	
	this.controller.setDestination(t.x, t.y, t.top, t.right, t.bottom, t.left);
}

F_cWipe.prototype = new F_effectPrototype;

function F_cIris(theObject, theParm) {
	//Setup
	this.type = "transition";
	this.object = theObject;
	this.controller = new F_cEffectController(theObject, theParm);

	//Set distances
	var width = Math.ceil(theObject.getClipWidth()/2);
	var height = Math.ceil(theObject.getClipHeight()/2);
	
	this.controller.setDestination(0, 0, height, -width, -height, width);
}

F_cIris.prototype = new F_effectPrototype;

function F_effectPrototype() {
	this.interupt = F_effectInterupt;
	this.start = F_effectStart;
	this.finish = F_effectFinish;
	this.stop = F_effectStop;
	this.restart = F_effectRestart;
	this.service = F_service;
}


/*******************************************************************
***
***							TRANSITIONS METHODS
***
*******************************************************************/


function F_service() {
	return(this.controller.effectService(new Date()));
}


function F_effectStart() {	
	this.object.setClosing();
	if(!document.main.closing)
		sendMsg(this.object.styleID, (this.type == "move" ? 'Motion Started ': 'Transition Started'), '', this);
	this.controller.effectService("start");
	this.service();
}

function F_effectFinish() {
	this.controller.effectService("finish");
	if(!document.main.closing) {		
		sendMsg(this.object.styleID, (this.type == "move"? 'Motion Ended' : 'Transition Ended'), '', this);		
		if(this.controller.message!="")
			sendMsg(this.object.styleID, this.controller.message, '', this);
	}
	this.object.checkHandler();
	this.object.resetClosing();
}

function F_effectInterupt(){
	if(document.main.closing)	//don't interupt transitions during closing
		return(false);
//	this.object.resetClosing();  //#######
	clearTimeout(this.timer);
	this.controller.effectService("finish");
	return(true);
}
//  ### these two are just for play: delete them at will
function F_effectStop(){
	clearTimeout(this.timer);
	return(true);
}
function F_effectRestart(){	
	this.timer = setTimeout( this.object.textRef + '.serviceEffect("' + this.type + '");',  this.controller.rate);
	return(true);
}
// #######
 
/*******************************************************************
***
***		EFFECT CONTROLLER
***
*******************************************************************/

/**
**	 constructors
**/


function F_cEffectController (theObject, theParm){
	
	this.object = theObject;
	if(typeof(theParm) == "string") {
		this.duration = 10;
		this.inDuration = 2;
		this.outDuration = 2;
		this.rate = 10;
		this.repeat = 1;
		this.reverse = true;
		this.theDirection = (F_getDirection (theParm) % 360);
		this.showHide = F_hideShow (theParm);
		this.message =  "";
	} else {
//		this.duration =  parseFloat(theParm.getParm( "duration", 10));
//		this.inDuration = parseFloat(theParm.getParm( "inDuration", 2));
//		this.outDuration =  parseFloat(theParm.getParm( "outDuration", 2));
		this.duration =  theParm.getParm( "duration", 10);
		this.inDuration = theParm.getParm( "inDuration", 2);
		this.outDuration =  theParm.getParm( "outDuration", 2);
		
		// inDuration + outDuration can't be greater than duration
//*
//		debug.traceln( this.duration +" "+ this.inDuration  +" "+ this.outDuration)
		if(this.duration == 0) this.duration = 1;
		if(this.inDuration >= this.duration) {
			this.inDuration = this.duration-1;
			this.outDuration =  0;
		} else {
			if((this.inDuration + this.outDuration) >= this.duration) {
				this.outDuration =  this.duration - this.inDuration - 1;
			}	
		}
//		alert( this.duration +" "+ this.inDuration  +" "+ this.outDuration)
//*/
				
//		this.rate =  parseFloat(theParm.getParm( "rate", 10));
//		this.repeat =  parseFloat(theParm.getParm( "repeat", 1));
		this.rate =  theParm.getParm( "rate", 10);
		this.repeat =  theParm.getParm( "repeat", 1);
//		this.reverse = (theParm.getParm( "reverse", false) == "true");  //######
		this.reverse = (theParm.getParm( "reverse", false)); 
		this.theDirection = theParm.getParm( "direction", 90) % 360;
		this.showHide = theParm.getParm( "hide", "show").toLowerCase();
		this.message =  theParm.getParm( "message", "");
	}
	this.resetPosition = true;

	//used to calculate easein and easeout
	this.I = 2 * this.inDuration / Math.PI;
	this.O = 2 * this.outDuration / Math.PI;
	this.Mid = this.duration - this.inDuration - this.outDuration;
	this.factor = 1/(this.Mid + this.I + this.O);
	this.midTest = this.inDuration + this.Mid;
	this.inRad = Math.PI / (2 * this.inDuration);
	this.outRad = Math.PI / (2 * this.outDuration);

	this.flipped = false;
	this.offset = new cEffectParms(0,0,0,0,0,0);
//	with(this.offset)	alert(x+" "+y+" "+ top+" "+ right+" "+ bottom+" "+ left);
	this.effectSetTime();
}
	
function cEffectParms(x, y, top, right, bottom, left) {
	this.x = Math.floor(x);
	this.y = Math.floor(y);
	this.top = Math.floor(top);
	this.right = Math.floor(right);
	this.bottom = Math.floor(bottom);
	this.left = Math.floor(left);
	
	/*debug.traceln("cEffectParms = " + 
	this.x + ", " + 
	this.y + ", " + 
	this.top + ", " + 
	this.right + ", " + 
	this.bottom + ", " + 
	this.left)*/
}

/**
**	 prototypes
**/

F_prototypeF("F_cEffectController.prototype.", 
		"effectGetFactor",
		"effectService",
		"setDestination",
		"doEffect",
		"effectSetTime"	);

/**
**	 methods
**/


function F_effectService(theTime) {
	var d = this.object;
	if(theTime == "start") 
	{ 
		if (this.showHide != "")
			this.object.setVisibility("inherit");
		return(true);
	}		
	if(theTime == "finish")  
	{ 
//alert(this.showHide +" "+ ((this.showHide == "hide") & !this.flipped));
		if ((this.showHide == "hide") && !this.flipped) 
			d.setVisibility("hidden");
		
		this.flipped=false;		
		if (this.resetPosition)
			this.doEffect(0);
		return(false);
	}
	var theRatio = this.effectGetFactor(theTime);
	if ( this.showHide == "show" ) 
		theRatio = 1 - theRatio;
	if (this.flipped) 
		theRatio = 1 - theRatio;
	this.doEffect(theRatio);
	if(theTime.getTime() > this.endTime) {  //done
		if(--this.repeat > 0) {  //repeat
			if(this.reverse) {  //reverse
				this.flipped = !this.flipped;
			}
			this.effectSetTime();	
		} else {
			return(false);		// really done
		}
	}
	
	if (d.moveCollision != null) F_checkCollision(d, "move");
	return(true);
}

function F_doEffect(theRatio) {	
	var d = this.object;
	/*if ( (d.style.visibility == "hide") && 
		 ( navigator.appName=='Netscape' ) && 
		 ( parseInt( navigator.appVersion ) < 5 ))
			return;*/
			
	with(this.dest) {
		var newOffset = new cEffectParms(
			Math.ceil(x * theRatio), 
			Math.ceil(y * theRatio), 
			Math.ceil(top * theRatio), 
			Math.ceil(right * theRatio), 
			Math.ceil(bottom * theRatio), 
			Math.ceil(left * theRatio));
	}
	var a = ( parseInt( newOffset.x ) - parseInt( this.offset.x) );
	var b = ( parseInt( newOffset.y ) - parseInt( this.offset.y ) );
	
	if((a != 0) || (b != 0)) {	//move
		d.offset(a, b);
	}
	
	with(d.style) {			
			if( ( navigator.appName=='Netscape' ) && ( parseInt( navigator.appVersion ) < 5 ) ) {
			clip.top = clip.top + (newOffset.top - this.offset.top);
			clip.right = clip.right + (newOffset.right - this.offset.right);
			clip.bottom = clip.bottom + (newOffset.bottom - this.offset.bottom);
			clip.left = clip.left + (newOffset.left- this.offset.left);
								
			/*
			} 
			else if ( ( navigator.appName=='Netscape' ) && ( parseInt( navigator.appVersion ) >= 5 ) ) {
			alert("this.offset.left="+this.offset.left);
				with(d.style){
					clip = "rect("+this.object.getClipLeft() + (newOffset.left- this.offset.left)+"px "+this.object.getClipTop() + (newOffset.top - this.offset.top)+"px "+this.object.getClipRight() + (newOffset.right - this.offset.right)+"px "+this.object.getClipBottom() + (newOffset.bottom - this.offset.bottom)+"px)";
				}
				//alert("dupa d.style")
		    */
			} else {								// InternetExplorer & NN6+
				  with(d) {				  	
					this.object.setClipRect(new F_cRect( 
						getClipLeft()   + ( parseInt( newOffset.left )   - this.offset.left ),
						getClipTop()    + ( parseInt( newOffset.top )    - this.offset.top ),
						getClipRight()  + ( parseInt( newOffset.right )  - this.offset.right ),
						getClipBottom() + ( parseInt( newOffset.bottom ) - this.offset.bottom )			 	
						));		
						
						/*debug.traceln( 
							(getClipLeft()   + ( parseInt( newOffset.left )   - this.offset.left )) + " " + 
							(getClipTop()    + ( parseInt( newOffset.top )    - this.offset.top ))+ " " + 
							(getClipRight()  + ( parseInt( newOffset.right )  - this.offset.right ))+ " " + 
							(getClipBottom() + ( parseInt( newOffset.bottom ) - this.offset.bottom ))			 	
							);*/
			 	  }
			 }
	}
	this.offset = newOffset;	
}

function F_effectGetFactor(theTime) {
	
	with(this) {
		var time = (theTime.getTime() - this.startTime)/(100)
		if ( time < inDuration ) {  //in ease in
  		 	return((I - (Math.cos(time *inRad) * I)) * factor);
  		}
		else {
 			if ( time <= midTest) {  //in middle
  		 		return((time - inDuration + I) * factor);
			}
			else {  //in ease out
				if ( time >= duration ) return(1);
		   	return(((Math.sin((time - inDuration - Mid) * outRad) * O) + I + Mid) * factor);
			}
		}
   }	
}

function F_setDestination(x, y, top, right, bottom, left) {	
	this.dest = new cEffectParms(x, y, top, right, bottom, left);
}

function F_effectSetTime() {
	this.startTime = (new Date()).getTime();
	this.endTime =  this.startTime + (this.duration*100);
}


/*******************************************************************
***
***		MOVEMENT UTILITIES II
***
*******************************************************************/

/*
** methods attached to object
*/

function F_serviceEffect(theType) {
	var theEffect = this[theType];
//	alert('F_serviceEffect');
	if(theEffect != null) {
		if(theEffect.service()) 
			theEffect.timer = F_setTimeout(this.timeoutTest, this.textRef, 'serviceEffect("' + theEffect.type + '")', theEffect.controller.rate);		
		/*
			if(F_NN || !F_MAC) {		//not IE Mac
				if(top.setTimeout) {
					theEffect.timer = top.setTimeout( this.timeoutTest+'?'+this.textRef + '.serviceEffect("' + theEffect.type + '"):null;',  theEffect.controller.rate);
				}
			} else {
				theEffect.timer = top.setTimeout( this.timeoutTest+'?'+this.textRef + '.serviceEffect("' + theEffect.type + '"):null;',  theEffect.controller.rate);
//				theEffect.timer = setTimeout( this.timeoutTest+'?'+this.textRef + '.serviceEffect("' + theEffect.type + '"):null;',  theEffect.controller.rate);
//				theEffect.timer = setTimeout(this.textRef + '.serviceEffect("' + theEffect.type + '");',  theEffect.controller.rate);
			}
		*/
		else
			this.endEffect(theType);
	}
}

function F_startEffect(theEffect, theParm) {
	var t = new theEffect(this, theParm);
	if(this[t.type] != null) {		//effect of same type happening, stop it.
		if(!this[t.type].interupt())
			return(false);
	}
	this[t.type] = t;
	this[t.type].start();
/*
	var test = "document.objectModel";
	if(parent!=self) {	//In frames
		var test="top.frames['"+self.name+"']."+test;
	}
	var test = "("+test + "&&"+test+"['"+this.styleID+"'])"
*/
	this[t.type].timer = F_setTimeout(this.timeoutTest, this.textRef, 'serviceEffect("' + this[t.type].type + '")', this[t.type].controller.rate);
/*
	if(F_NN || !F_MAC) {		//not IE Mac
		if(top.setTimeout) {
			this[t.type].timer = top.setTimeout(this.timeoutTest+'?'+this.textRef + '.serviceEffect("' + this[t.type].type + '"):null;',  this[t.type].controller.rate);
		}
	} else {
		this[t.type].timer = top.setTimeout(this.timeoutTest+'?'+this.textRef + '.serviceEffect("' + this[t.type].type + '"):null;',  this[t.type].controller.rate);
//		this[t.type].timer = setTimeout(this.textRef + '.serviceEffect("' + this[t.type].type + '");',  this[t.type].controller.rate);
	}
*/
	return(true);
}

function F_endEffect(theType) {
	var t = this[theType];
	this[theType] = null;
	t.finish();
}

F_prototype("F_cObject.prototype.", 
	"serviceEffect", "F_serviceEffect",
	"endEffect", "F_endEffect",
	"startEffect", "F_startEffect");


/**
**	 F_calcDirection  -  returns the  coordinate to move to give a direction, width and height.
**/

function F_calcDirection(theDirection, theWidth, theHeight)
{
	theDirection = theDirection % 360;
	theRadians = theDirection * (Math.PI/180);
	if ((theDirection % 90) == 0) 
	{
		xMove = 0;
		yMove = 0;
		if(theDirection == 0) yMove = theHeight;
		if(theDirection == 90) xMove = theWidth;
		if(theDirection == 180) yMove = -theHeight;
		if(theDirection == 270) xMove = -theWidth;
	} 
	else 
	{ 
		xMove = theWidth;
		yMove =	theWidth / Math.tan(theRadians);
		if(theDirection >=180)
		{
			yMove = -yMove;
			xMove = -xMove;
		}
		if (Math.abs(yMove) > theHeight) //angle means we disapear vertically
		{
			yMove =	 theHeight;
			xMove =	 theHeight * Math.tan(theRadians);
			if((theDirection > 90) && (theDirection < 270))
			{
				yMove = -yMove;
				xMove = -xMove;
			}
		}
	}
	return(new F_cPoint(xMove, yMove));
}

function F_calculateClip(theDirection, clip, point) {
	if((theDirection == 0) || (theDirection > 270)){
		clip.left = -point.x;
		clip.top = point.y; 
	} 
	else 
		if(theDirection <= 90) {
			clip.right = -point.x;
			clip.top = point.y;  
		} 
		else 
			if(theDirection <= 180) {
				clip.right = -point.x;
				clip.bottom = point.y;  
			} 
			else 
				if(theDirection <= 270) {
					clip.left = -point.x;
					clip.bottom = point.y;  
				} 	
}




/*******************************************************************
***
***		UTILITIES
***
*******************************************************************/



/**
**	 F_hideShow
**/

function F_hideShow (theString) {
	if (theString.substring(0,2) == "In")  return("show");
	if (theString.substring(0,3) == "Out")  return("hide");
	return("");
}

/**
**	 F_getDirection
**/

function F_getDirection (theString) {
//		var t = theString.toLowerCase();
		var t = theString;
		if (t.indexOf("Top Right") != -1) return (45);
		if (t.indexOf("Top Left") != -1) return (315);
		if (t.indexOf("Bottom Right") != -1) return (135);
		if (t.indexOf("Bottom Left") != -1) return (225);
		if (t.indexOf("Top") != -1) return (0);
		if (t.indexOf("Bottom") != -1) return (180);
		if (t.indexOf("Right") != -1) return (90);
		if (t.indexOf("Left") != -1) return (270);
		return(0)
}



/*******************************************************************
***
***		COLLISION
***
*******************************************************************/

function F_clearCollision () {
	this.dragCollision = null;
	this.dropCollision = null;	
	this.moveCollision = null;	
}

function F_addCollision (theParm) {
	var o = theParm.getParm( "objectID", null);
	if(document.objectModel[o]) {		//if valid object ID
		var t = theParm.getParm( "when", "drop") + "Collision";
		if(this[t] == null) 
			this[t] = new Array(0);
		this[t][this[t].length] = new F_cCollision(
			o, 
			theParm.getParm( "message", "collision"), 
			theParm.getParm( "type", "intersection"));
	}
}

function F_cCollision(detectID, message, type) {
	this.detectID = detectID;
	this.message = message;
	this.type = type;
	this.tripped = false;
	this.testCollision = F_testCollision;
}

function F_resetCollision(dragObj) {
		with(dragObj) {
			if(dragCollision!=null)
				for ( var i = 0; i < dragCollision.length; i++)
					dragCollision[i].tripped = false;
					
			if(dropCollision!=null)
				for ( var i = 0; i < dropCollision.length; i++)
					dropCollision[i].tripped = false;
					
			if(moveCollision!=null)
				for ( var i = 0; i < moveCollision.length; i++)
					moveCollision[i].tripped = false;
		}
}

function F_checkCollision(dragObj, theWhen) {
		var c = dragObj[theWhen + "Collision"];
		var o = false;
		for ( var i = 0; i < c.length; i++) {
			var o = false;
			var d = c[i];
			var obj = document.objectModel[d.detectID];				
			if ((d.type == "intersection") && F_testCollision(dragObj, obj, "int"))
					o = true;
			if ((d.type == "not intersection") && !F_testCollision(dragObj, obj, "int"))
					o = true;
			if ((d.type == "contained by") && F_testCollision(dragObj, obj, "cont"))
					o = true;
			if ((d.type == "not contained by") && !F_testCollision(dragObj, obj, "cont"))
					o = true;
			if ((d.type == "contains") && F_testCollision(obj, dragObj, "cont"))
					o = true;
			if ((d.type == "not contains") && !F_testCollision(obj, dragObj, "cont"))
					o = true;
			if ((d.type == "mouse inside") && F_pointInObject(obj, window.NOFevent.pageX, window.NOFevent.pageY))
					o = true;
			if ((d.type == "mouse not inside") && !F_pointInObject(obj, window.NOFevent.pageX, window.NOFevent.pageY))
					o = true;
			if(o) {
				if (d.tripped==false) {
					sendMsg(dragObj.styleID, d.message, d.detectID, dragObj.styleID);
					d.tripped = true;
				} 
			}
			else 
				d.tripped = false;
		}
}

/**
**	 F_testCollision - check for collision.
**/

function F_testCollision(obj1, obj2, test) {   //########## write two versions which don't use calls
	with(obj1) {
		var x = getLeft('absolute');
		var y = getTop('absolute');
		var l1 = x + getClipLeft();
		var t1 = y + getClipTop();
		var r1 = x + getClipRight();
		var b1 = y + getClipBottom();
	}
	with(obj2) {
		var x = getLeft('absolute');
		var y = getTop('absolute');
		var l2 = x + getClipLeft();
		var t2 = y + getClipTop();
		var r2 = x + getClipRight();
		var b2 = y + getClipBottom();
	}
	if (test== "int")
		if((l1 >= l2 && l1 <= r2) || (r1 >= l2 && r1 <= r2) || (l1 < l2 && r1 > r2))
			if((t1 >= t2 && t1 <= b2) || (b1 >= t2 && b1 <= b2) || (t1 < t2 && b1 > b2))
				return(true);
	if (test== "cont")
		if((l1 >= l2) && (r1 <= r2))
			if((t1 >= t2) && (b1 <= b2))
				return(true);
	return(false);
}

/*******************************************************************
***
***		DRAG AND DROP
***
*******************************************************************/



/**
**	 F_setDrag - adds a layer to be dragged.
**/

function F_setDrag(theParm) {
	with(document) {
		if(F_dragLayer == null)
			F_dragLayer = new Array;

		//don't add 2 drags for same layer
		var index = -1;
		for(var i=(F_dragLayer.length-1);i>-1;i--)		
			if(F_dragLayer[i].layer == this)
				index = i;
		if(index != -1)
			F_dragLayer[index]	= {layer:this,type:theParm};
		else
			F_dragLayer[F_dragLayer.length] = {layer:this,type:theParm};

		F_resetCollision(this);		
		if(navigator.appName=='Netscape') {
			document.captureEvents(Event.MOUSEMOVE);
			//F_nn_setEvent( e )
			this.oldx = window.NOFevent.pageX;
			this.oldy = window.NOFevent.pageY;

		} else {
			document.onmousemove = F_ie_mouseMove;
			this.oldx = window.NOFevent.pageX;
			this.oldy = window.NOFevent.pageY;
		}
		//trying this becuase of different way of capturing events.
//		alert(typeof this.actions['Drag Started']);
		this.fastDrag=false;		
		if(this.actions) {
			this.sendBeginDrag = (this.actions['Drag Started'] != null);
			this.fastDrag=((!this.sendBeginDrag)&&(this.dragBoundries=="none")&&(this.actions['Dragged'] == null)&&(this.dragCollision == null));			
		}
	}
}


function F_drag (x, y) {
	if(document.F_dragLayer != null) {
		for (var i = (document.F_dragLayer.length-1); i > -1; i--) {
			var dObj = document.F_dragLayer[i];
			var d = dObj.layer;
			if(d.sendBeginDrag) {
				sendMsg(d.styleID, 'Drag Started', '', null);
				d.sendBeginDrag = false;
			}
			if (typeof d.oldx == "undefined"){
				d.oldx = x;
				d.oldy = y;
			}
			var xMove = d.oldx - x;
			var yMove = d.oldy - y;
			// constrain drag to containing layer			
			if((d.parent!= null) && (d.dragBoundries=="to container object")) {				
				if( (d.getLeft('absolute')	+ d.getClipLeft() - d.parent.getClipLeft() - d.parent.getLeft('absolute') - xMove) < 0 )
					xMove = d.getLeft('absolute')+ d.getClipLeft() - d.parent.getClipLeft() - d.parent.getLeft('absolute');
				if( (d.getLeft('absolute')+ d.getClipRight()  - xMove) > (d.parent.getClipRight() + d.parent.getLeft('absolute')) )
					xMove = d.getLeft('absolute')+ d.getClipRight()  -  (d.parent.getClipRight() + d.parent.getLeft('absolute'));
				if( (d.getTop('absolute')+ d.getClipBottom() - yMove) > (d.parent.getClipBottom() + d.parent.getTop('absolute')) )
					yMove = d.getTop('absolute')+ d.getClipBottom()  -  d.parent.getClipBottom() - d.parent.getTop('absolute');
				if( (d.getTop('absolute')+ d.getClipTop() - d.parent.getClipTop() - d.parent.getTop('absolute') - yMove) < 0 )
					yMove = d.getTop('absolute')+ d.getClipTop()  - d.parent.getClipTop() - d.parent.getTop('absolute');
			}
			d.oldx = d.oldx - xMove ;
			d.oldy = d.oldy - yMove;
			d.offset (-xMove, -yMove);			
			if(d.actions['Dragged'] != null) 
				sendMsg(d.styleID, 'Dragged', '', null);
			if (d.dragCollision != null) 
				F_checkCollision(d, "drag");
		}
	}
}

/**
**	 gets called when the user drops an item that it being dragged. 
**/


function F_endDrag () {
	if(document.F_dragLayer) {
		sendMsg(this.styleID, 'Drag Ended', '', null);
		if (this.dropCollision != null) F_checkCollision(this, "drop");
		var d = new Array(0);
		for(var i=0;i<document.F_dragLayer.length;i++) {
			if(document.F_dragLayer[i].layer != this)
				d[d.length] = document.F_dragLayer[i];
		}
		if(d.length>0) {
			document.F_dragLayer = d;
		} else {
			document.F_dragLayer = null;
			if(navigator.appName=='Netscape') {
				document.releaseEvents (Event.MOUSEMOVE);
			} else {
				document.onmousemove = null;
				window.event.returnValue = false
				window.event.cancelBubble = true
			}
		}
	}
}
/*
function F_nn_DblClick(e) {
	var theLayer = F_clickedOn(e.pageX, e.pageY);
	if (theLayer != null) {
		sendMsg(theLayer.styleID, 'Double Click', '', null);
	}
}
*/



F_prototype("F_cObject.prototype.", 
	"addCollision", "F_addCollision",
	"clearCollision", "F_clearCollision",
	"setDrag", "F_setDrag",
	"endDrag", "F_endDrag");	
if(navigator.appName=='Netscape')
{
}else{
//	F_prototype("F_cObject.prototype.", 
//	"endDrag", "F_ie_endDrag",
//		"setEvent",	"F_ie_setEvent")
}	

	







/*******************************************************************
***
***		IMAGES
***
*******************************************************************/

function F_setSrc(theParm) {
	if(typeof this.objRef != "undefined") {	//**netscape bug
			this.objRef.src=theParm;
	}
}

function F_setLowsrc(theParm) {
	if(typeof this.objRef != "undefined") {	//**netscape bug
		this.objRef.src=theParm;
	}
}

/*
function F_setImage(theParm) {
	var a = ["Image 1 (Normal)","Image 2 (Highlighted)","Image 3 (Depressed)","Image 4 (Selected)","Image 5","Image 6","Image 7","Image 8","Image 9","Image 10"];
	for ( var i=0; i<a.length; i++ ) {
		var b = theParm.getParm( a[i], "");
		if(b!="") {
			this.images[a[i]] = new Image();
			this.images[a[i]].src = b;
		}
	}
}

function F_useImage(theName) {
	var t = theName;
	if(typeof this.objRef != "undefined")	//netscape bug
		if((typeof this.images[t]!="undefined") && (this.images[t]!=null))
			this.objRef.src=this.images[t].src;
}
*/

function F_setImage(theParm) {
	var a = ["Image 1 (Normal)","Image 2 (Highlighted)","Image 3 (Depressed)","Image 4 (Selected)","Image 5","Image 6","Image 7","Image 8","Image 9","Image 10"];
	if (typeof theParm != "object") return(false);	//this happens if the user set no values in the action dialog
	for ( var i=0; i< a.length; i++ ) {  
		var b = theParm.getParm( a[i], "");
		if(b!="") {
			this.images[a[i]] = new Object();
			this.images[a[i]].image = new Image();
			if(!F_NN) this.images[a[i]].image.src = b;  //IE doesn't support onLoad, but seems okay with many loads at once
//			this.images[a[i]].image.onLoad = new Function(this.textRef+".setImageLoad('"+a[i]+"')");
			this.images[a[i]].source = b;
			this.images[a[i]].complete = false;
		}
	}
	if(F_NN) {
		 this.setImageLoad();
	}
	return(true);
}

function F_setImageLoad(p) {
	if(p) {
		this.images[p].complete = true;
	}
	for ( var i in this.images ) {
		with(this.images[i]) {
			if(!complete) {
				image.src = source;
//				image.onLoad = new Function(this.timeoutTest+'?'+this.textRef+".setImageLoad('"+i+"'):null");
				image.onLoad = new Function(this.textRef+".setImageLoad('"+i+"')");
				break;
			} else {
				if(typeof image != "undefined") {
					image.onLoad = null;
				}
			}
		}
	}
}

function F_setImageExpression() {
	var a = ["Image 1 (Normal)","Image 2 (Highlighted)","Image 3 (Depressed)","Image 4 (Selected)","Image 5","Image 6","Image 7","Image 8","Image 9","Image 10"];
	var o = new Object();
	for ( var i=0; i< a.length; i++ ) { 
		if(F_setImageExpression.arguments.length > i) 
		{
			o[a[i]] = F_setImageExpression.arguments[i];
		}
	}
	return(o);
}

function F_useImage(theName) {
	var t = theName;
	if(typeof this.objRef != "undefined")	//**netscape bug
		if((typeof this.images[t]!="undefined") && (this.images[t]!=null))
			this.objRef.src=this.images[t].source;
}

/*******************************************************************
***
***		AUDIO and VIDEO
***
*******************************************************************/

function F_IEsound(command) {
	if ( !(!F_NN && F_MAC) ) {  //IE mac doesn't support play etc.
		if (command == "play")
			if(this.objRef.run) this.objRef.run();
//			this.objRef.play();
		if (command == "stop")
			if(this.objRef.stop) this.objRef.stop();
		if (command == "pause")
			if(this.objRef.pause) this.objRef.pause();
	}
}

/*
function pluginEnabled(plug_in) {
	for (var i = 0; i < navigator.plugins.length; i++) {
		if (navigator.plugins[i].name.toLowerCase() == plug_in.toLowerCase()) {
			for (var j = 0; j < navigator.plugins[i].length; j++) {
				if (navigator.plugins[i][j].enabledPlugin) {
					return(true);
				}
			}
			return(false);
		}
	}
	return(false);
}

// if(pluginEnabled("LiveAudio")) F_debug("LiveAudio");
// if(pluginEnabled("LiveVideo")) F_debug("LiveVideo");
// if(pluginEnabled("QuickTime")) F_debug("QuickTime");

function musicControl(cmd) {
	if (audioEnabled("LiveAudio")) {
		if (cmd == "play") {
			music.play(false, "" );
		}
		else if (cmd == "stop") {
			music.stop();
		}
		else if (cmd == "pause") {
			music.pause();
		}
	} else {
		alert("I could not find the required LiveAudio plugin");
	}
}
*/

/*******************************************************************
***
***		WINDOW
***
*******************************************************************/
     
/*
**	F_windowUtil(theFunction, theParm)  - used by window
*/

/*windowStatus = "";	
function ShowStatus( theParm ){
	window.status = windowStatus;
	window.setTimeout( 'ShowStatus()',0.1);
}*/	
	
function F_windowUtil(f, theParm) {
	if(typeof theParm == "object") {
		var theLeft = parseInt(theParm.getParm( "left", 0));
		var theTop = parseInt(theParm.getParm( "top", 0));
		var theWidth = parseInt(theParm.getParm( "width", 0));
		var theHeight = parseInt(theParm.getParm( "height", 0));
	}
	if (f=="open") {
		var n = theParm.getParm( "name", "myWindow").replace(/\W/gi,"");
		var p = "width="+theParm.getParm( "width", "")+
			",height="+theParm.getParm( "height", "")+
			",top="+theParm.getParm( "top", "")+
			",left="+theParm.getParm( "left", "")+
			",toolbar="+theParm.getParm( "toolbar", "")+
			",location="+theParm.getParm( "location", "") +
			",menubar="+theParm.getParm( "menubar", "")+
			",status="+theParm.getParm( "status", "")+
			",resizable="+theParm.getParm( "resizable", "")+
			",directories="+theParm.getParm( "directories", "")+ 
			",scrollbars="+theParm.getParm("scrollbars", ""); //  directories: IE switches with left yes; scrollbars: IE switches with top
		var w = (window.open(theParm.getParm( "URL", ""), n, p))
		document.F_windows[n] = w; 
		if(F_NN) w.focus();	//this gives an error in IE if displaying other domain
		return(w);
//			if(theParm.getParm( "bring to front", 0))
//				w.focus();
	}
	if (f=="prompt")
		return(window.prompt(theParm.getParm( "message", ""), theParm.getParm("defaultValue", "")));
	if (f=="set status") {
		if ( document.all ) {
			window.defaultStatus = theParm
			//window.setTimeout( 'window.status = "' + theParm + '"',1);
			//document.onmousemove  = ShowStatus(theParm);
			//ShowStatus(theParm);
				windowStatus = theParm;
			
			return false;
		}			
		
		window.status=theParm;
		return(false);
	}
	if (f=="move to")
		window.moveTo(theLeft, theTop);
	if (f=="move by")
		window.moveBy(theLeft, theTop);
	if (f=="resize to") {
		if(navigator.appName=='Netscape')
			top.resizeTo(theWidth, theHeight);
		else
			top.resizeTo(theWidth, theHeight);
	}
	if (f=="resize by")
		window.resizeBy(theWidth, theHeight);
	if (f=="scroll to")
		window.scrollTo(theLeft, theTop);
	if (f=="scroll by")
		window.scrollBy(theLeft, theTop);
	if (f=="delayed action") {
		var m = 'sendMsg("'+this.styleID+'", "'+theParm.getParm("action", "")+'")';
		var d = theParm.getParm("delay", "60")*1000;
		var test = "top.frames['"+self.name+"'].sendMsg";
		if(theParm.getParm("continuous", false)) {
			F_setInterval(this.timeoutTest, F_getFrameRef(), m, d);
			/*
			if(parent!=self) {	//In frames
				if(F_NN || !F_MAC) {		//not IE Mac
					if(top.setInterval)
						top.setInterval( this.timeoutTest+'?'+F_getFrameRef()+ m +":null;", d);	
				} else {
					top.setInterval(F_getFrameRef()+ m +";", d);	
				}	
			} else {
				setInterval( "document.sendMsg+?"+m +":null;", d);	
			}
			*/
		} else { //once
			F_setTimeout(this.timeoutTest, F_getFrameRef(), m, d);
//      	 (true, 'document', m, d);
/*
			alert(this.textRef + " " +F_getFrameRef());
			if(parent!=self) {	//In    
				if(F_NN || !F_MAC) {		//not IE Mac
					if(top.setTimeout)
						top.setTimeout( this.timeoutTest+'?'+F_getFrameRef()+ m +":null;", d);	
				} else {
					top.setTimeout(F_getFrameRef()+ m +";", d);	
				}
			} else {
				setTimeout(  "sendMsg?"+m +":null;", d);
			}
*/
		}
	}
	if (f=="browser type") {
	    var ms = navigator.appVersion.indexOf("MSIE");
	    var nn = navigator.appName == "Netscape";
		var ie4 = (ms>0) && (parseInt(navigator.appVersion.substring(ms+5, ms+6)) >= 4);
		var nn4 = (nn) && (parseInt(navigator.appVersion.substring(0, 1)) >= 4);
		var t = theParm;
		if((t == "Is Navigator") && (nn4))
			return(true);
		if((t == "Is Internet Explorer") && (ie4))
			return(true);
		return(false);
	}
	if (f=="message to window") {
		msg = new F_cMessage(theParm.getParm("message", ""), new F_Parm(),false, null);
		var w = document.F_windows[theParm.getParm("window", "")];
		if (typeof w == "undefined")
			var w = window.open("",theParm.getParm("window", ""));
		if(typeof w != "undefined") 
			if(typeof w.document != "undefined") 
				if(typeof w.document.objectModel != "undefined") {
					var target = w.document.objectModel[theParm.getParm("object", "")];
					if(typeof target != "undefined") {
						return(msg.send(target));
					}
				}
	}
	return(null);
}

/*******************************************************************
***
***							COMMANDS
***
*******************************************************************/

/*******************************************************************
  ********** HTML TYPES MAPPED TO LAYOUT TYPES *****

	img = image		   	// picture, navbutton, banner, drawobjects
	txt = text block			// text
	chk = checkbox				// FormCheckbox
	rad = radio button		 	// FormRadio
	frm = form					// ****
	tfd = text field			// FormEdit, FormMultiEdit
	sel = selection object	 	// FormComboBox
	btn = button				// FormButton
	doc = document				// layout
	win = window				// ****
	fra = frame					// ****
	fst = frameset				// ****
	wht = white board			// whiteboard

	shk = shockwave				// ShockWave
	snd = Sound					// Sound
	vid = Video					// Video
	act = ActiveX				// ActiveX
	nav = NavBar				// NavBar, VertBar
	nbt = NavButton				// NavButton
	tbl = Table					// Table
	jav = Java					// ???
	com = Component				// ???
	jbn = JavaBean				// ??
	map	= imageMap				//
	tln = text link				//

	vrm = VRML					// ???

	vis = visible object 	(doc, img, txt, wht, shk, snd, vid, act, nav, jav, jbn, tbl)
	all = all object			//

*******************************************************************/

function F_commandsInit() {
	for (var c in this.commands) {
		this.commands[c].addCommands = F_addCommands;
		this.commands[c].addCommands(c);
	}
}

function F_addCommands(theType) { 

	/**
	**	 Visible Object commands
	**/
	
	if(theType == "vis") {
		F_addCommandsLoop(this, new Array(	
			"Move To",					"this.startEffect(F_cMoveTo, msg.data)",
			"Move By",					"this.startEffect(F_cMoveBy, msg.data)",
			"Fly",						"this.startEffect(F_cFly, msg.data)",
			"Iris",						"this.startEffect(F_cIris, msg.data)",
			"Peek",						"this.startEffect(F_cPeek, msg.data)",
			"Wipe",						"this.startEffect(F_cWipe, msg.data)",
			"Hide",						"this.hide()",
			"Show",						"this.show()",
			"Toggle Visibility",		"this.setVisibility('toggle')",
			"Bring To Front",			"this.bringToFront()",
			"Send To Back",				"this.sendToBack()",
			
			"Bring Forward",			"this.shiftZindex1(1)",
			"Send Backward",			"this.shiftZindex1(-1)",
//			"Bring Forward",			"this.bringForward()",
//			"Send Backward",			"this.sendBackward()",
			"Set Position",				"this.setPosition(msg.data)",
			"Get Position",				"msg.returnValue = this.getPosition('absolute')",
			"Get Z-Index",				"msg.returnValue = this.getzIndex()",
			"Set Z-Index",				"msg.returnValue = this.setIndex(msg.data)",
			"Save Position",			"this.savedPosition=this.getPosition('style')",
			"Restore Position",			"this.restorePosition(this.savedPosition)", 
			"Set Left",					"this.setLeft(msg.data)",
			"Get Left",					"msg.returnValue = this.getLeft('absolute')",
			"Set Top",					"this.setTop(msg.data)",
			"Get Top",					"msg.returnValue = this.getTop('absolute')",
			"Set Clip Left",			"this.setClipLeft(msg.data)",
			"Set Clip Top",				"this.setClipTop(msg.data)",
			"Set Clip Right",			"this.setClipRight(msg.data)",
			"Set Clip Bottom",			"this.setClipBottom(msg.data)",
			"Get Clip Left",			"msg.returnValue = this.getClipLeft()",
			"Get Clip Top",				"msg.returnValue = this.getClipTop()",
			"Get Clip Right",			"msg.returnValue = this.getClipRight()",
			"Get Clip Bottom",			"msg.returnValue = this.getClipBottom()",
			"Start Drag",				"this.setDrag(msg.data)",
			"End Drag",					"this.endDrag() ",
			"Constrain Drag",			"this.dragBoundries=msg.data",
			"Set Collision Detection",	"this.addCollision(msg.data)",
			"Clear Collision Detection","this.clearCollision(msg.data)",
			"Set Masking",				"this.masked = eval(msg.data)",
			"Get Masking",				"msg.returnValue = this.masked",
			"Set Filter",				"this.style.filter=msg.data",
			"Delay",					"this.windowUtil('delayed action', msg.data)",
			"Display File",				"this.setSource(msg.data)",	
			"Display HTML",				"this.writeSource(msg.data)",
			"Set Draggable",			"this.draggable = eval(msg.data)",
			"Get Draggable",			"msg.returnValue = this.draggable"	));
	}

	/**
	**	 Image commands
	**/
	
	if(theType == "img") {
		F_addCommandsLoop(this,  new Array(	
			"Set Src",		"this.setSrc(msg.data)",
			"Set Lowsrc",		"this.setLowsrc(msg.data)",
			"Set Image",	"this.setImage(msg.data)",
			"Use Image",	"this.useImage(msg.data)"));
		F_addCommands_method(this,  "getObjectValue", "Src","Lowsrc");		// ##### breaks in tables/Netscape??
		F_addCommands_method(this,  "setObjectValue");		// ##### breaks in tables/Netscape??
		this.addCommands("vis");
	}

	/**
	**	 Nav Bar
	**/
	
	if(theType == "nav") {
			this.addCommands("vis");
	}

	/**
	**	 Active-x
	**/
	
	if(theType == "act") {
			this.addCommands("vis");
	}

	/**
	**	 Video comands
	**/

if(theType == "vid") {
/*	
		if(navigator.appName=='Netscape') {	
			// Netscape
			F_addCommandsLoop(this,  new Array(	
				"Play",		"this.objRef.play()",
				"Stop",		"this.objRef.stop()",
				"Rewind",	"this.objRef.rewind()",
				"Seek",		"this.objRef.seek(msg.data)"));
		} else {
			// Internet Explorer
			F_addCommandsLoop(this,  new Array(	
				"Play",		"this.objRef.run()",
				"Pause",	"this.objRef.pause()",
				"Stop",		"this.objRef.stop()"	));
		}
*/
		this.addCommands("vis");
	}

	/**
	**	 Shockwave commands
	**/
	
	if(theType == "shk") {
		F_addCommandsLoop(this,  new Array(	
			"Play",		"this.objRef.Play()",
			"Stop",		"this.objRef.Stop()",
			"Rewind",	"this.objRef.Rewind()",
			"Go To Frame",		"this.objRef.GotoFrame(msg.data)"));
		this.addCommands("vis");
	}
	
	/**
	**	 Java commands
	**/
	
	if(theType == "jav") {
		this.addCommands("vis");
	}
	
	/**
	**	 JavaBean commands
	**/
	
	if(theType == "jbn") {
		this.addCommands("vis");
	}

	/**
	**	 VRML commands
	**/
/*	
	if(theType == "vrm") {
		if(navigator.appName=='Netscape') {	
			// Netscape
			F_addCommandsLoop(this,  new Array(	
				"Load Scene",			"this.objRef.LoadScene(msg.data, null)",
				"SetBackgroundImage",	"this.objRef.SetBackgroundImage(msg.data)",
				"Goto ViewPoint",		"this.objRef.GotoViewPoint(msg.data.viewpoint,msg.data.steps)"));
		} else {
			// Internet Explorer
			F_addCommandsLoop(this,  new Array(	
				"Play",		"this.objRef.run()",
				"Pause",	"this.objRef.pause()",
				"Stop",		"this.objRef.stop()"	));
		}
		this.addCommands("vis");
	}
*/
	/**
	**	 Audio commands
	**/
	
	if(theType == "snd") {
		if(navigator.appName=='Netscape') {	
			// Netscape
			F_addCommandsLoop(this,  new Array(	
				"Play",			"this.objRef!=null?this.objRef.play(false):void(0)",
				"Pause",		"this.objRef!=null?this.objRef.pause():void(0)",
				"Stop",			"this.objRef!=null?this.objRef.stop():void(0)",
//				"Start Time",	"this.objRef.start_time(msg.data)",
//				"End Time",		"this.objRef.end_time(msg.data)",
//				"Set Volume",	"this.objRef.setvol(msg.data)",
//				"Fade To",		"this.objRef.fade_to(msg.data)",
//				"Fade From To",	"this.objRef.fade_from_to(msg.data.from,msg.data.to)",  //###########
//				"Start At Beginning",	"this.objRef.start_at_beginning()",
//				"Stop At End",	"this.objRef.stop_at_end()",
//				"Is Ready",	"msg.returnValue = this.objRef.IsReady()",
//				"Is Playing",	"msg.returnValue = this.objRef.IsPlaying()",
//				"Is Paused",	"msg.returnValue = this.objRef.IsPaused()",
				"Get Volume",	"msg.returnValue = this.objRef.GetVolume()"));
		} else {
			// Internet Explorer
			F_addCommandsLoop(this,  new Array(	
//				"Play",		"this.objRef.run()",
//				"Play",			"typeof this.objRef.play!= 'undefined'?this.objRef.play():void(0)",
//				"Pause",		"typeof this.objRef.pause!= 'undefined'?this.objRef.pause():void(0)",
//				"Stop",			"typeof this.objRef.stop!= 'undefined'?this.objRef.stop():void(0)"));
				"Play",			"this.IEsound('play')",
				"Pause",			"this.IEsound('pause')",
				"Stop",			"this.IEsound('stop')"));
		}
		this.addCommands("vis");
	}

	/**
	**	 Text Block commands
	**/
	
	if(theType == "txt") {

		this.addCommands("vis");
		F_addCommandsLoop(this,  new Array(	
			"Set Font Weight",	"this.style.fontWeight = msg.data",
			"Set Font Size",	"this.style.fontSize = msg.data"));
	}

	/**
	**	 Table
	**/
	
	if(theType == "tbl") {

		this.addCommands("vis");
	}

	/**
	**	 Text Link commands
	**/

	if(theType == "tln") {

		if(navigator.appName!='Netscape')
			F_addCommandsLoop(this,  new Array(	
			
	//			"Set Word Spacing",		"this.style.wordSpacing = msg.data",
	//			"Set Letter Spacing",	"this.style.letterSpacing = msg.data",
	//			"Set Text Decoration",	"this.style.textDecoration = msg.data",
	//			"Set Vertical Align",	"this.style.verticalAlign = msg.data",		//for inline elements
	//			"Set Text Transform",	"this.style.textTransform = msg.data",
	//			"Set Text Align",		"this.style.textAlign = msg.data",			//block level
	//			"Set Text Indent",		"this.style.textIndent = msg.data",			//block level
	//			"Set Line Height",		"this.style.lineHeight = msg.data",		
			
				"Set Color",	"this.style.color = msg.data",
	//			"Set Background Color",	"this.style.backgroundColor = msg.data",
	//			"Set Background Image",	"this.style.backgroundImage = msg.data",
				
	//			"Set Font Family",	"this.style.fontFamily = msg.data",
	//			"Set Font Style",	"this.style.fontStyle = msg.data",
	//			"Set Font Variant",	"this.style.fontVariant = msg.data",
	//			"Set Font Weight",	"this.style.fontWeight = msg.data",
				"Set Font Size",	"this.style.fontSize = msg.data"));
	}

	/**
	**	 Checkbox Commands
	**/
	
	if(theType == "chk") {
		F_addCommandsLoop(this,  new Array(	
			"Check",		"this.objRef.checked = true",
			"Uncheck",		"this.objRef.checked = false",
			"Focus",		"this.objRef.focus()",
			"Blur",			"this.objRef.blur()",
//			"Set Checked",	"alert(msg.data)"));
			"Set Checked",	"this.objRef.checked = msg.data"));
		F_addCommands_method(this,  "getObjectValue", "Checked");	
		this.addCommands("fob");
	}

	/**
	**	 Radio Button commands
	**/

	if(theType == "rad") {
		F_addCommandsLoop(this,  new Array(
			"Select",		"this.objRef.checked=true",
			"Check",		"this.objRef.checked = true",
			"Uncheck",		"this.objRef.checked = false",
			"Focus",		"this.objRef.focus()",
			"Blur",			"this.objRef.blur()",
//			"Set Value",	"this.objRef.value = msg.data",
			"Set Checked",	"this.objRef.checked = msg.data",
			"Get Checked",	"msg.returnValue = this.objRef.checked",
//			"Get Value",	"msg.returnValue = this.objRef.value",
			"Get Name",		"msg.returnValue = this.objRef.name"));
		this.addCommands("fob");
	}

	/**
	**	 Form commands
	**/
/*	
	if(theType == "frm") {
		F_addCommandsLoop(this,  new Array(	
			"Reset",	"this.objRef.reset()",
			"Submit",	"this.objRef.submit()"));
		F_addCommands_method(this,  "getObjectValue",   "Name", "Elements", "Length", "Action", "Method", "Target", "Encoding");
		this.addCommands("fob");
	}
*/
	/**
	**	 Text Field commands
	**/
	
	if(theType == "tfd") {
		F_addCommandsLoop(this,  new Array(	
			"Get Default Value",	"msg.returnValue = this.objRef.defaultValue",
			"Focus",	"this.objRef.focus()",
			"Blur",	"this.objRef.blur()",
			"Select",	"this.objRef.select()",
			"Set Value",	"this.objRef.value = msg.data"));
		F_addCommands_method(this,  "getObjectValue", "Name", "Value");
		this.addCommands("fob");
	}
	
	/**
	**	 Select commands
	**/
	
	if(theType == "sel") {
		F_addCommandsLoop(this,  new Array(	
			"Get Selected Value",	"msg.returnValue = this.objRef.options[this.objRef.selectedIndex].value",
			"Get Selected Index",	"msg.returnValue = this.objRef.selectedIndex",
			"Get Selected Text",	"msg.returnValue = this.objRef.options[this.objRef.selectedIndex].text",
		//	"Get Default Selected For Index",	"msg.returnValue = this.objRef.options[msg.data].defaultSelected",
		//	"Get Value For Index",	"msg.returnValue = this.objRef.options[msg.data].value",
		//	"Get Text For Index",	"msg.returnValue = this.objRef.options[msg.data].text",
		//	"Set Text For Index",	"this.objRef.options[msg.data].text = msg.data",
		//	"Set Value For Index",	"this.objRef.options[msg.data].value = msg.data",
			"Select",	"this.objRef.options[msg.data].selected = true",
			"Restore Default Selection",	"F_selectRestoreDefault(this)",
			"Delete Option",	"this.objRef.options[msg.data] = null",
			"Add Option",	"this.objRef.options[this.objRef.length] = new Option(msg.data.getParm( 'Option Name', ''),msg.data.getParm( 'Value', ''))",
			"Focus",	"this.objRef.focus()",
			"Blur",	"this.objRef.blur()"));
		F_addCommands_method(this,  "getObjectValue", "Name", "Length", "Options");
		this.addCommands("fob");
	}

	/**
	**	 Button commands
	**/

	if(theType == "btn") {
		F_addCommandsLoop(this,  new Array(	
			"Click",	"this.objRef.click()",
			"Focus",	"this.objRef.focus()",
			"Blur",	"this.objRef.blur()"));
		F_addCommands_method(this,  "getObjectValue", "Name", "Value");
		this.addCommands("fob");
	}

	/**
	**	 Document commands
	**/
	
	if(theType == "doc") {
		F_addCommandsLoop(this,  new Array(	
		
		//IE only???
//			"Set Text Color",			"document.fgColor=msg.data",
			"Set Active Link Color",	"document.alinkColor=msg.data",
			"Set Visited Link Color",	"document.vlinkColor=msg.data",
			"Set Link Color",			"document.linkColor=msg.data",
//			"Document Title",			"document.title=msg.data",
			"Go To",					"this.gotoURL(msg.data)",
			"Go To URL",				"this.gotoURL(msg.data)",
			"Get Location",				"msg.returnValue = document.location",
//			"Add Netcaster Channel",	"F_doAddChannel(msg.data)",
			"Set Background Color",		"document.bgColor=msg.data"));
	
//		F_addCommands_method(this, "getObjectValue", "Name", "Value");
		this.addCommands("vis");
		this.addCommands("win");
	}

	/**
	**	 Window commands - not using the window object, but used by document (and frame?)
	**/
	
	if(theType == "win") {
		F_addCommandsLoop(this,  new Array(	
			"Set Status Bar",	"msg.returnValue = this.windowUtil('set status', msg.data)",
			"Open Window",		"msg.returnValue = this.windowUtil('open', msg.data)",
			"Resize To",		"this.windowUtil('resize to', msg.data)",
			"Resize By",		"this.windowUtil('resize by', msg.data)",
			"Reposition To",			"this.windowUtil('move to', msg.data)",
			"Reposition By",			"this.windowUtil('move by', msg.data)",
			"Scroll To",		"this.windowUtil('scroll to', msg.data)",
			"Scroll By",		"this.windowUtil('scroll by', msg.data)",
			"Close",				"window.close()",
			"Focus Window",				"window.focus()",
			"Blur Window",				"window.blur()",
			"Alert",				"window.alert(msg.data)",
			"Confirm",			"msg.returnValue = window.confirm(msg.data)",
//			"Prompt",			"msg.returnValue = window.prompt(msg.data,'')",
			"Prompt",			"msg.returnValue = this.windowUtil('prompt', msg.data)",
			"Check Browser Type",	"msg.returnValue = this.windowUtil('browser type', msg.data)",
			"Message To Window","this.windowUtil('message to window', msg.data)",
			"Get Opener",		"msg.returnValue = window.opener",  //???? returns ref, not name, could be null
			"Get Name",			"msg.returnValue = window.name",
			"Set Name",			"window.name = msg.data",
			"Check Closing",	"this.checkClosing()"));	//used internally
	}

	/**
	**	 Frame commands
	**/
	/*
	if(theType == "fra") {
		F_addCommandsLoop(this,  new Array(	
			"Focus",			"self.focus()",
			"Blur",				"self.blur()"));
	}
	*/
	/**
	**	 Frameset commands
	**/
	/*
	if(theType == "fst") {
		this.addCommands("win");
		F_addCommandsLoop(this,  new Array());
	}
	*/

	/**
	**	 Region commands
	**/
	
	if(theType == "lyr" || theType == "wht") {
		this.addCommands("vis");
	}
	
	/**
	**	 Form Object commands
	**/
	
	if(theType == "fob") {
		F_addCommandsLoop(this,  new Array(	
			"Get Form",	"msg.returnValue = this.formRef",
			"Get Form Object",	"msg.returnValue = this.getFormObj(this.formRef.name)"));
	}

}

/*******************************************************************
***
***							PROTOTYPES
***
*******************************************************************/

F_prototypeF("F_cObject.prototype.", 
//		"setSource",
		"setLowsrc",
//		"writeSource",
		"setImage",
		"useImage",
		"setImageLoad",
		"setSrc",
		"windowUtil",
		"IEsound"
	);	
/*
	if(navigator.appName=='Netscape')
	{
	
	} else {													// InternetExplorer
			F_prototypeIE("F_cObject.prototype.",
				"setSource",
				"writeSource");
	}
*/
F_prototype("F_cMain.prototype.", 
	"commandsInit", "F_commandsInit"
	);	
