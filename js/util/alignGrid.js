class AlignGrid
{
	constructor(config)
	{
		this.config=config;
		if (!config.scene)
		{
			console.log("missing scene");
			return;
		}
		if (!config.rows)
		{
			config.rows=5;
		}
		if (!config.cols)
		{
			config.cols=5;
		}
		if (!config.height)
		{
			config.height=game.config.height;
		}
		if (!config.width)
		{
			config.width=game.config.width;
		}

		this.scene=config.scene;

		//cell width
		this.cw=config.width/config.cols;
		//cell height
		this.ch=config.height/config.rows;
	}

	show()
	{
		this.graphics=this.scene.add.graphics();
		this.graphics.depth = 10;
		this.graphics.lineStyle(2,0xff0000);

		 for (var i = 0; i < this.config.width; i+=this.cw) {
		            this.graphics.moveTo(i,0);
		            this.graphics.lineTo(i,this.config.height);
		        }

		  for (var i = 0; i < this.config.height; i+=this.ch) {
		            this.graphics.moveTo(0,i);
		            this.graphics.lineTo(this.config.width,i);
		        }


		  this.graphics.strokePath();
	}
	placeAt(xx,yy,obj)
	{
		//calc position based upon the cellwidth and cellheight
		var x2=this.cw*xx+this.cw/2;
		var y2=this.ch*yy+this.ch/2;

		obj.x=x2;
		obj.y=y2;
	}
	placeAtIndex(index,obj)
	{
		var yy=Math.floor(index/this.config.cols);
		var xx=index-(yy*this.config.cols);

		this.placeAt(xx,yy,obj);

	}
	placeAndScaleAtIndex(index,obj)
	{
		var yy=Math.floor(index/this.config.cols);
		var xx=index-(yy*this.config.cols);

		this.placeAt(xx,yy,obj);
		obj.displayWidth=this.cw*.8;
		obj.scaleY=obj.scaleX;
	}
	indexPosition(index)
	{
		var yy=Math.floor((index)/this.config.cols);
		var xx=(index)-(yy*this.config.cols);
		var x2=this.cw*xx+this.cw/2;
		var y2=this.ch*yy+this.ch/2;
		return [x2,y2];
	}
	showNumbers()
	{
		this.show();
		var count=0;
		 for (var i = 0; i < this.config.rows; i++) {
		            for(var j=0;j<this.config.cols;j++)
		            {

		            	var numText=this.scene.add.text(0,0,count,{color:'#ff0000'});
		            	numText.setOrigin(0.5,0.5);
		            	this.placeAtIndex(count,numText);
						numText.depth = 10;
		            	count++;
		            }
		        }
	}
}