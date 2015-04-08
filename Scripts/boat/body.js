  var Box= function(physics) 
  {
   	 var bodyDef=new b2BodyDef;   
     var fixDef=new b2FixtureDef; 
     var box_w=175;
     var box_h=25;
     this.body;
     this.createBox=function()  
     {                     
         fixDef.density = 50;
         fixDef.friction = 40;
         fixDef.restitution = 0;
         fixDef.isSensor=false;

         bodyDef.userData=this;
         bodyDef.type = b2Body.b2_dynamicBody;    
         bodyDef.fixedRotation=false;
         bodyDef.bullet=false;
         bodyDef.position.Set(width/2/physics.scale,height/2/physics.scale);
         this.body=physics.world.CreateBody(bodyDef);         
         bodyDef = new b2PolygonShape(); 
         
         //up
         bodyDef.SetAsOrientedBox(box_w/2/physics.scale,box_h/2/physics.scale, new b2Vec2( 0, -(box_w-box_h)/2/physics.scale), 0); 
         fixDef.shape=bodyDef;
         this.body.CreateFixture(fixDef);   
         //down
         bodyDef.SetAsOrientedBox(box_w/2/physics.scale,box_h/2/physics.scale, new b2Vec2( 0, (box_w-box_h)/2/physics.scale), 0); 
         fixDef.shape=bodyDef;
         this.body.CreateFixture(fixDef);  
         //left
         bodyDef.SetAsOrientedBox(box_h/2/physics.scale, box_w/2/physics.scale, new b2Vec2( -(box_w-box_h)/2/physics.scale, 0 ), 0); 
         fixDef.shape=bodyDef;
         this.body.CreateFixture(fixDef);  
         //right
         bodyDef.SetAsOrientedBox(box_h/2/physics.scale, box_w/2/physics.scale, new b2Vec2( (box_w-box_h)/2/physics.scale, 0 ), 0);          
         fixDef.shape=bodyDef;         
         this.body.CreateFixture(fixDef); 
         
      }
      this.position=function()
      {	
      	  return { x:this.body.GetPosition().x * physics.scale,
      	           y:this.body.GetPosition().y * physics.scale };
      
      }
      this.draw=function()
      {
         var point = this.position();
         physics.box_context.save();
       	 physics.box_context.translate(point.x , point.y);
   	     physics.box_context.rotate(this.body.GetAngle());
     	 physics.box_context.drawImage(glass_img,-(box_w-5)/2,-(box_w-5)/2);
         physics.box_context.restore();
      } 
  };
  
  var Water= function(physics) 
  {
  	  var bodyDef=new b2BodyDef;   
  	  var fixDef=new b2FixtureDef;  
  	  var circle_r=8;
  	  var w=175;
  	  var h=25;
  	  this.createWater=function()  
  	  {                       
  	      bodyDef.userData=this;
  	      fixDef.density = 0.3;
  	      fixDef.friction = 0;
          fixDef.restitution = 0;
          fixDef.isSensor=false;
          bodyDef.bullet=false;
          bodyDef.type = b2Body.b2_dynamicBody;

          fixDef.shape = new b2CircleShape(circle_r/2/physics.scale);
          bodyDef.position.x = ((width-w+h)/2/physics.scale)+ Math.random()* (w-h)/physics.scale;
          bodyDef.position.y = (height/2/physics.scale) + (Math.random()* ((w-h)/2/physics.scale));                      
          physics.world.CreateBody(bodyDef).CreateFixture(fixDef);
      }
      this.draw=function()
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
					 	physics.water_context.save();
	    		     	physics.water_context.drawImage(water_img, b.GetPosition().x*physics.scale , b.GetPosition().y*physics.scale );     						
      	 			 	physics.water_context.restore();
      	 			 }
  				 }	
  			 }	
      	  }
      } 
  };

  var Boat= function(physics) 
  {
      var bodyDef=new b2BodyDef;   
      var fixDef=new b2FixtureDef; 
      var boat_w=7;
      var boat_h=7;
      this.body=null;

      this.createBoat=function()  
      {                 
          bodyDef.userData=this;
          bodyDef.bullet=false;
          fixDef.density = 3;
          fixDef.friction = 0.3;
          fixDef.restitution = 0;

          // fixDef.isSensor=true;
          bodyDef.type = b2Body.b2_dynamicBody;
          fixDef.shape = new b2PolygonShape;
          fixDef.shape.SetAsBox(boat_w/2/physics.scale, boat_h/2/physics.scale);
          bodyDef.position.Set(width/2/physics.scale, height/2/physics.scale);
          this.body= physics.world.CreateBody(bodyDef);
          this.body.CreateFixture(fixDef);         
         
      }
      this.position=function()
      {	
      	  return { x:this.body.GetPosition().x * physics.scale,
      	           y:this.body.GetPosition().y * physics.scale };
      
      }
      this.draw=function()
      {
          var point = this.position();
          physics.boat_context.save();
      	  physics.boat_context.drawImage(boat_img , point.x-boat_w/2, point.y-boat_h/2);
      	  physics.boat_context.restore();    
      }             
  };


                   
  var Wall= function(physics) 
  {
      var bodyDef=new b2BodyDef;   
      var fixDef=new b2FixtureDef;  
      var wall_w=width;
      var wall_h=10;
      this.body=null;

    this.createWall=function()  
     {                  
     	 bodyDef.userData=this;
         bodyDef.type = b2Body.b2_staticBody;
         bodyDef.position.Set(width/2/physics.scale,height/2/physics.scale);
         this.body=physics.world.CreateBody(bodyDef);     
         bodyDef = new b2PolygonShape();
         
         //up   
         bodyDef.SetAsOrientedBox(wall_w/2/physics.scale,wall_h/2/physics.scale, new b2Vec2( 0, -(height-80)/2/physics.scale), 0); 
         fixDef.shape=bodyDef;
         this.body.CreateFixture(fixDef);   
         //down
         bodyDef.SetAsOrientedBox(wall_w/2/physics.scale,wall_h/2/physics.scale, new b2Vec2( 0, (height-80)/2/physics.scale), 0); 
         fixDef.shape=bodyDef;
         this.body.CreateFixture(fixDef);  
         //left
         bodyDef.SetAsOrientedBox(wall_h/2/physics.scale, wall_w/2/physics.scale, new b2Vec2( -width/2/physics.scale, 0), 0); 
         fixDef.shape=bodyDef;
         this.body.CreateFixture(fixDef);  
         //right
         bodyDef.SetAsOrientedBox(wall_h/2/physics.scale, wall_w/2/physics.scale, new b2Vec2( width/2/physics.scale, 0), 0); 
         fixDef.shape=bodyDef;
         this.body.CreateFixture(fixDef);        
     }
  };
