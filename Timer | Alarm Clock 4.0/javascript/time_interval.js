class Time_interval
{
            
    constructor(id,tp,name,raw_time,tune,automatic_start,automatic_interruption_raw_time)
    {
        this.id = id;
        this.tp = tp;
        this.name = name;
        this.raw_time = raw_time;
     
        this.tune = tune;
        this.automatic_start = automatic_start;
        this.automatic_interruption_raw_time = +automatic_interruption_raw_time;
       
        this.status = (this.automatic_start) ? 1 : 0;

 

        /*
           STATUS
           
           0 - waiting
           1 - running 
           2 - ringing
           3 - paused
        
        */
                 
    }


    set id(id)
    {
        this._id = id;  
    }

    get id()
    {
        return this._id;  
    }

    set tp(tp)
    {
        this._tp = tp;
    }

    get tp()
    {
        return this._tp;
    }

    set name(name)
    {
        this._name = name;
    }

    get name()
    {
        return this._name;
    }

    set raw_time(raw_time)
    {
        this._raw_time = raw_time;
    }

    get raw_time()
    {
        return this._raw_time;
    }

    set actual_time(dt)
    {
        this._actual_time = dt;  
    }

    get actual_time()
    {
        return this._actual_time;  
    }

    set remain_time(t)
    {
        this._remain_time = t;   
    }

    get remain_time()
    {
        return this._remain_time;  
    }
  

    set tune(tune)
    {
        this._tune = tune;
    }

    get tune()
    {
        return this._tune;
    }

    set automatic_start(automatic_start)
    {
        this._automatic_start = automatic_start;
    }

    get automatic_start()
    {
        return this._automatic_start;
    }

    set automatic_interruption_raw_time(automatic_interruption_raw_time)
    {
        this._automatic_interruption_raw_time = automatic_interruption_raw_time;
    }

    get automatic_interruption_raw_time()
    {
        return this._automatic_interruption_raw_time;
    }

    set automatic_interruption_end_time(automatic_interruption_raw_time)
    {
        var time_interval = new Date(); 
     
        time_interval.setSeconds(time_interval.getSeconds() + automatic_interruption_raw_time);
        this._automatic_interruption_end_time = time_interval;
    }

    get automatic_interruption_end_time()
    {
        return this._automatic_interruption_end_time;
    }

    set automatic_interruption_remain_time(automatic_interruption_remain_time)
    {
        this._automatic_interruption_remain_time = automatic_interruption_remain_time;
    }

    get automatic_interruption_remain_time()
    {
        return this._automatic_interruption_remain_time;
    }

    set status(status)
    {
        this._status = status;
    }

    get status()
    {
        return this._status;
    }

    set countdown(func)
    {
        this._countdown = func; 
    }

    get countdown()
    {
        return this._countdown;
    }



    set end_time(end_time)
    {
        this._end_time = end_time;
    }

    get end_time()
    {
        return this._end_time;
    }
 
    set_time_interval_initial_configurations()
    {
        this.actual_time = new Date();
        this.end_time = this.engine_set_end_time(this.raw_time);
        this.remain_time = (this.end_time - this.actual_time);
         
    }

    format_remain_time(remain_time)
    {    
        var [hours,minutes,seconds] = this.format_milliseconds(remain_time);
                 
        return `${hours}:${minutes}:${seconds}`;  
    }


    update_remain_time()
    {
        this.actual_time = new Date();

        this.remain_time = (this.end_time - this.actual_time);
    }
    

    update_automatic_interruption_remain_time()
    {
        this.actual_time = new Date();
        this.automatic_interruption_remain_time = (this.automatic_interruption_end_time - this.actual_time);
    }

    set_countdown_time_interval(callback_function)
    {
        callback_function();
        this.countdown = window.setInterval(callback_function,100); 
    }

    clear_countdown_time_interval()
    {
        window.clearInterval(this.countdown);
        this.countdown = null;
    }


    format_milliseconds(milliseconds)
    {
      
        

        if(milliseconds > 0)
        {
            milliseconds -= milliseconds % 1000;
            milliseconds += 1000;
        }
  

        var hours = (milliseconds - (milliseconds % 3600000)) / 3600000;

        milliseconds -= hours * 3600000;

        var minutes = (milliseconds - (milliseconds % 60000)) / 60000;

        milliseconds -= minutes * 60000;

        var seconds = (milliseconds - (milliseconds % 1000)) / 1000;
          
       return this.add_zero([hours,minutes,seconds]);
    }
        
    add_zero(numbers)
    {
        for(var i = 0; i < numbers.length;i++)
        {
            if(numbers[i] < 10)
                numbers[i] = "0" + numbers[i];
        }    
        
        return numbers;
    }


}


class Alarm extends Time_interval
{
    constructor(id,tp,name,raw_time,tune,automatic_start,automatic_interruption_raw_time)
    {
        super(id,tp,name,raw_time,tune,automatic_start,automatic_interruption_raw_time);
    }


    engine_set_end_time(time)
    {
        this.actual_time = new Date(); 
        var time_interval = new Date();
      
        var [hours,minutes,seconds] = time.split(":");

        time_interval.setHours(hours);
        time_interval.setMinutes(minutes);
        time_interval.setSeconds(seconds);
     
                
        if(this.actual_time > time_interval)
            time_interval.setDate(time_interval.getDate() + 1);
        
     
        return time_interval;
       
    }
  
}



class Timer extends Time_interval
{
    constructor(id,tp,name,raw_time,tune,automatic_start,automatic_interruption_raw_time)
    {
        super(id,tp,name,raw_time,tune,automatic_start,automatic_interruption_raw_time);
    }

    engine_set_end_time(time)
    {
        var time_interval = new Date(); 

        var [hours,minutes,seconds] = time.split(":");
   
        time_interval.setHours(time_interval.getHours() + +hours);
        time_interval.setMinutes(time_interval.getMinutes() + +minutes);
        time_interval.setSeconds(time_interval.getSeconds() + +seconds);

        return time_interval;
    }

    
    resume_time_interval()
    {
        this.end_time = this.engine_set_end_time(this.format_milliseconds(this.remain_time).join(":"));
    }
    

}

Time_interval.prototype.toJson = function()
{
                    
    return JSON.stringify({
                           id:this.id,
                           tp:this.tp,
                           name:this.name,
                           raw_time:this.raw_time,
                           tune:this.tune, 
                           automatic_start:this.automatic_start,
                           automatic_interruption_raw_time:this.automatic_interruption_raw_time     
                          });
};


Time_interval.prototype.fromJson = function(json)
{
              var data = JSON.parse(json);

              var time_interval_classes = [Alarm,Timer];

              return new time_interval_classes[+data.tp](data.id,data.tp,data.name,data.raw_time,data.tune,data.automatic_start,data.automatic_interruption_raw_time);
                                                         
};  




