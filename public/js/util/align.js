class Align
{
	static scaleToGameW(obj,per)
	{
		obj.displayWidth=game.config.width*per;
		obj.scaleY=obj.scaleX;
	}
	static centerH(obj)
	{
		obj.x=game.config.width/2-obj.displayWidth/2;
	}
	static centerV(obj)
	{
		obj.y=game.config.height/2-obj.displayHeight/2;
	}
	static center2(obj)
	{
		obj.x=game.config.width/2-obj.displayWidth/2;
		obj.y=game.config.height/2-obj.displayHeight/2;
	}
	static moveTowardsCenter(obj)
	{
		var xCenter=game.config.width/2;
		if(obj.x!=xCenter){
			if(obj.x>xCenter){
				obj.x= obj.x-2;
			}

			if(obj.x<xCenter){
				obj.x= obj.x+2;
			}
		}

		var yCenter=game.config.height/2;
		if(obj.y!=yCenter){
			if(obj.y>yCenter){
				obj.y= obj.y-2;
			}

			if(obj.y<yCenter){
				obj.y= obj.y+2;
			}
		}
	}
	static center(obj)
	{
		obj.x=game.config.width/2;
		obj.y=game.config.height/2;
	}
	static isCenter(obj)
	{
		if(obj.x==game.config.width/2 && obj.y==game.config.height/2){
			return true
		}
		return false;
	}
	static sizeReduce(obj)
	{
		obj.displayWidth=obj.displayWidth*.98;
		obj.scaleY=obj.scaleX;
	}
	static sizeIncrease(obj)
	{
		obj.displayWidth=obj.displayWidth*1.02;
		obj.scaleY=obj.scaleX;
	}
}