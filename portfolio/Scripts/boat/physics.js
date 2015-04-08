    var b2Vec2 = Box2D.Common.Math.b2Vec2
    ,   b2AABB = Box2D.Collision.b2AABB
    ,	b2BodyDef = Box2D.Dynamics.b2BodyDef
    ,	b2Body = Box2D.Dynamics.b2Body
    ,	b2Shape = Box2D.Collision.Shapes
    ,   b2Mat22 = Box2D.Common.Math.b2Mat22
    ,	b2Transform = Box2D.Common.Math.b2Transform
    ,	b2FixtureDef = Box2D.Dynamics.b2FixtureDef
    ,	b2Fixture = Box2D.Dynamics.b2Fixture
    ,	b2World = Box2D.Dynamics.b2World
    ,	b2MassData = Box2D.Collision.Shapes.b2MassData
    ,	b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape
    ,	b2CircleShape = Box2D.Collision.Shapes.b2CircleShape
    ,	b2DebugDraw = Box2D.Dynamics.b2DebugDraw
    ,   b2MouseJointDef =  Box2D.Dynamics.Joints.b2MouseJointDef
    ,   b2BuoyancyController = Box2D.Dynamics.Controllers.b2BuoyancyController
    ,   b2ContactEdge = Box2D.Dynamics.Contacts.b2ContactEdge
    ;
    function Physics()
    {
        var self=this;
    	var gravity = new b2Vec2(0,10);
    	self.world = new b2World(gravity, true);
    	self.bgcanvas= document.getElementById("bg");
    	self.bgcontext = self.bgcanvas.getContext("2d");
    	self.water_canvas= document.getElementById("water");
    	self.water_context = self.water_canvas.getContext("2d");
    	self.boat_canvas = document.getElementById("boat");
    	self.boat_context = self.boat_canvas.getContext("2d");
       	self.box_canvas = document.getElementById("box");
    	self.box_context = self.box_canvas.getContext("2d");
       	
    	self.scale = 30;
    	self.stepAmount = 1/60;
    	this.draw=true;
  	};
    Physics.prototype.debug = function() 
    {
   		this.debugDraw = new b2DebugDraw();
    	this.debugDraw.SetSprite(this.box_context);
    	this.debugDraw.SetDrawScale(this.scale);
    	this.debugDraw.SetFillAlpha(0.3);
    	this.debugDraw.SetLineThickness(1.0);
    	this.debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
    	this.world.SetDebugDraw(this.debugDraw);  	
    };
	Physics.prototype.update= function() 
	{
     	this.world.Step(this.stepAmount, 10, 10);
     	this.extend();  
       // this.world.DrawDebugData();
      	this.drawBody();     
        this.world.ClearForces();
  	};
  	Physics.prototype.addBody= function() 
  	{
  	    this.wall = new Wall(this);
  	    this.box = new Box(this);
  	    this.water = new Water(this);
  	    this.boat = new Boat(this);
  	    
  	    this.box.createBox();
  	    this.wall.createWall();
 		for(var i = 0; i < 150; ++i) 
 	  	{
     		this.water.createWater();
      	}
      	this.boat.createBoat();
  	};
  	Physics.prototype.drag = function() 
  	{
  		var self = this;
  	  	var obj = null;
  	  	var joint = null;
  	  	this.doListen = false;
        var md;
  	  	
    	function calculateWorldPosition(e) 
    	{
    	  	return {
        	x: (e.offsetX || e.layerX) / self.scale,
        	y: (e.offsetY || e.layerY) / self.scale
      		};
    	}
    	self.box_canvas.addEventListener("mousedown",function(e) 
    	{  	  	
    	    if(self.doListen==false){ return;}
    	    md=true;
    		e.preventDefault();
      		var point = calculateWorldPosition(e);
      		self.world.QueryPoint(function(fixture) {
      		obj = fixture.GetBody().GetUserData();
      		},point);
    	}, false);
    	self.box_canvas.addEventListener("mousemove",function(e) 
    	{
      	    if(self.doListen==false){ return;}
    	    content.doDrawEx=md;      	   
 			if(!obj) { return; }
      		else if(obj.constructor!==Box) { return; }
      		var point = calculateWorldPosition(e);
      		if(!joint) 
      		{
        		var jointDefinition = new Box2D.Dynamics.Joints.b2MouseJointDef();
        		jointDefinition.bodyA = self.world.GetGroundBody();
        		jointDefinition.bodyB = obj.body;
        		jointDefinition.target.Set(point.x,point.y);
        		jointDefinition.maxForce = 100000;
        		joint = self.world.CreateJoint(jointDefinition);
      		}
      		joint.SetTarget(new b2Vec2(point.x,point.y));
    	}, false);
    	self.box_canvas.addEventListener("mouseup",function(e) 
    	{ 
    	    if(self.doListen==false){ return;}
    	    md=false;
    	    content.doDrawEx=false;

      		obj = null;
      		if(joint) 
      		{
        		self.world.DestroyJoint(joint);
        		joint = null;
      		}
    	},false);
    	
    	
       	self.clearJoint=function()
    	{
    	    obj = null;
      		if(joint) 
      		{
        		self.world.DestroyJoint(joint);
        		joint = null;
      		}
    	}
  	};
  	Physics.prototype.buoyancy = function() 
   	{  
   	   	this.buoyancyController = new b2BuoyancyController();
   	   	this.buoyancyController.normal.Set(0, -1);
      	this.buoyancyController.density = 14.0;
      	this.buoyancyController.linearDrag = 10;
      	this.buoyancyController.angularDrag = 6;
      	this.buoyancyController.offset=height;
    	this.world.AddController(this.buoyancyController);
   	};
 	Physics.prototype.drawBody= function() 
  	{  	    	
  	    this.boat_context.clearRect(0,0,width,height); 
  	    this.water_context.clearRect(0,0,width,height);    
  	    this.box_context.clearRect(0,0,width,height);

  	    if(this.draw==true)
  	    {
  	    	this.box.draw();
  	    }
  	      	this.water.draw();
    	    this.boat.draw();

  	        render(this.water_context, physics.box.position().x-100 , physics.box.position().y-100, 200, 200, 8);
  	    	thershold(this.water_context,this.box.position().x-100 , this.box.position().y-100);
  	};
 	Physics.prototype.boatControl= function() 
  	{
  	
        var boat_addBuoyant=false;
        if(this.boat.body.GetControllerList()!=null)
        {
        	this.buoyancyController.RemoveBody(this.boat.body);
        	boat_addBuoyant=false;
        }  	
  	  	for (var boat_contacts = this.boat.body.GetContactList(); boat_contacts; boat_contacts = boat_contacts.next) 
  	  	{
  	  	
			var contact = boat_contacts.contact;
			var fixtureB = contact.GetFixtureB();
			var bodyB = fixtureB.GetBody();

			if (bodyB.GetUserData().constructor===Water) 
			{   			
			    boat_addBuoyant=true;
			}
		}
		if(boat_addBuoyant==true)
		{
			this.buoyancyController.offset=-(this.box.position().y-15)/this.scale;
			this.buoyancyController.AddBody(this.boat.body);
		}
 	};
 	
 	Physics.prototype.waterControl= function() 
  	{      
            for (var b = physics.world.GetBodyList(); b; b = b.GetNext())
		 	{
      			 if (b.GetType() == b2Body.b2_dynamicBody) 
      			 {			
    			  	 var fl = b.GetFixtureList();
   					 var shape=fl.GetShape();
					 if (shape.GetType() == 0) 
					 {         
					     if(b.GetUserData().constructor===Water)
					     {
         	 				  var bx = b.GetPosition().x * this.scale;
			 				  var by = b.GetPosition().y * this.scale;
			 				  var ox = this.box.position().x;
			 				  var oy = this.box.position().y;
	  		 				  if( ( bx > (ox +90) )||
								  ( bx < (ox -90) )||
	     	 					  ( by > (oy +90) )||
	     	 					  ( by < (oy -90) )
							    )
							    {
			 			   		    this.world.DestroyBody(b);
	     	 					}
	      	 			  }
	  				  }	
			     }
            }
 	};
	Physics.prototype.extend= function() 
  	{      
  	    physics.boatControl(); 
  	    physics.waterControl();
  	};
