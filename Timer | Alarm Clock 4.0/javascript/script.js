// Constants created from HTML TAGS;

const tag_box_time_intervals = document.querySelector("#box_time_intervals");

const tag_bt_show_credits = document.querySelector("#bt_show_credits");

const tag_bt_add_new_time_interval = document.querySelector("#bt_add_new_time_interval");


const tag_input_data_menu = document.querySelector("#input_data_menu");
const tag_bt_close_input_data_menu = document.querySelector("#bt_close_input_data_menu");
const tag_title_input_data_menu = document.querySelector("#title_input_data_menu");  

const tag_box_credits = document.querySelector("#box_credits");
const tag_bt_close_box_credits = document.querySelector("#bt_close_box_credits");


const tags_tp_time_interval = document.querySelectorAll("input[type='radio'][name='tp_time_interval']");
const tag_name_time_interval = document.querySelector("#name_time_interval");

const tag_hours_time_interval = document.querySelector("select[name = 'hours_time_interval']");
const tag_minutes_time_interval = document.querySelector("select[name = 'minutes_time_interval']");
const tag_seconds_time_interval = document.querySelector("select[name = 'seconds_time_interval']");


const tag_audio_preview = document.querySelector("#audio_preview");
const tags_tune_time_interval = document.querySelectorAll("input[type='radio'][name='tune_time_interval']");
const tag_automatic_start_time_interval = document.querySelector("#automatic_start_time_interval");
const tags_time_automatic_interrupt_time_interval = document.
querySelectorAll("input[type='radio'][name='time_automatic_interrupt_time_interval']");

const tag_id_time_interval = document.querySelector("input[type='hidden'][name='id_time_interval']");

const tag_bt_save_data = document.querySelector("#bt_save_data");

const tag_template_time_interval = document.querySelector("#template_time_interval");


// ===========================================================================

// Events

tag_bt_show_credits.addEventListener("click",Open_box_credits);
tag_bt_close_box_credits.addEventListener("click",Close_box_credits); 

tag_bt_add_new_time_interval.addEventListener("click",Engine_create_time_interval);
tag_bt_close_input_data_menu.addEventListener("click",Close_input_data_menu);
tag_name_time_interval.addEventListener("input",Check_data_validity);


Create_event_helper(tags_tune_time_interval,"change",(ev) => { 
                                                                Engine_Configure_Selected_label_visual(ev.target); 
                                                                Set_audio_preview_src();
                                                            
                                                             });


Create_event_helper(tags_tp_time_interval,"change",(ev) => { 
                                                              
                                                                Engine_Configure_Selected_label_visual(ev.target);
                                                                Engine_reconfigure_tag_hours_time_interval(Get_element_value(ev.target));
                                                                Check_data_validity();

                                                                if(!(mode))
                                                                    Set_element_value(tag_name_time_interval,Compare_strings(Get_checked_elements_values(tags_tp_time_interval),"1") ? 
                                                                    "New Timer" : 
                                                                    "New Alarm Clock");

                                                            });

tag_hours_time_interval.addEventListener("change",Check_data_validity);  
tag_minutes_time_interval.addEventListener("change",Check_data_validity); 
tag_seconds_time_interval.addEventListener("change",Check_data_validity); 

Create_event_helper(tags_time_automatic_interrupt_time_interval,"change",(ev) => { Engine_Configure_Selected_label_visual(ev.target); });

tag_bt_save_data.addEventListener("click",Engine_build_edit_time_interval);

// ============================================================================


// Auxiliary Variables;

var local_storage_data_time_intervals; 

var local_storage_data_input_data_menu;

var time_intervals;

var countdown_time_intervals;

var tunes = ["default.mp3","double hit.mp3","school bell.mp3","japanese school bell.mp3","beep.mp3"];

var mode; /* 0 - Create / 1 - Edit */

// ============================================================================

// Functions

start();

function start()
{
   
    Engine_fill_tag_select(tag_minutes_time_interval,59);
    Engine_fill_tag_select(tag_seconds_time_interval,59);

    Engine_load_data();

    Set_audio_preview_src();

 
}

// ==============================================================================

async function Engine_load_data()
{
    var hours = [23,99];

    local_storage_data_time_intervals = new Local_storage_data(1,"data_time_intervals");
  

    time_intervals = local_storage_data_time_intervals.load().map((data) => Time_interval.prototype.fromJson(data)); 

    if(time_intervals.length)
    {

        if(time_intervals.some((time_interval) => { return time_interval.automatic_start;}))
        {
            await Message.alert_box("Some countdowns will start automatically.");
        }

        time_intervals.forEach((time_interval,i) => {
                                                            Add_child(tag_box_time_intervals,Render_time_interval(time_interval));
                                                            Configure_time_intervals(i);

                                                            if(time_intervals[i].automatic_start)
                                                                time_intervals[i].set_time_interval_initial_configurations();
                                                    });
                   
                                                    Set_countdown_time_intervals();
    }
    else
        Render_no_data_message();
    


    local_storage_data_input_data_menu = new Local_storage_data(1,"data_input_data_menu");
          
    if(local_storage_data_input_data_menu.load().length != 0) 
    {
        Fill_input_data_menu(Time_interval.prototype.fromJson(local_storage_data_input_data_menu.load()));
    }
    else
    {
        Engine_Configure_Selected_label_visual(Get_checked_element(tags_tp_time_interval));
        Engine_Configure_Selected_label_visual(Get_checked_element(tags_tune_time_interval));
        Engine_Configure_Selected_label_visual(Get_checked_element(tags_time_automatic_interrupt_time_interval));

        Engine_fill_tag_select(tag_hours_time_interval,hours[+Get_checked_elements_values(tags_tp_time_interval)]);
    }
   
}


// ==============================================================================

function Render_time_interval(time_interval)
{
  
    const tag_template_time_interval_copy = document.importNode(tag_template_time_interval.content,true);

    const tag_time_interval = tag_template_time_interval_copy.querySelector(".time_interval");
    
    const tag_txt_basic_info_time_interval = tag_time_interval.querySelector(".txt_basic_info_time_interval");
    const tag_name_time_interval = tag_time_interval.querySelector(".name_time_interval");
     
    const tag_bt_start_resume_time_interval = tag_time_interval.querySelector(".bt_start_resume_time_interval");
    const tag_bt_pause_time_inverval = tag_time_interval.querySelector(".bt_pause_time_interval");
    const tag_bt_cancel_time_inverval = tag_time_interval.querySelector(".bt_cancel_time_interval");

    const tag_tune_time_inverval = tag_time_interval.querySelector(".tune_time_interval");
   
    const tag_tune_notification_txt  = tag_time_interval.querySelector(".tune_notification_txt");
 
    const tag_bt_finish_tune_notification = tag_time_interval.querySelector(".bt_finish_tune_notification");

    var time_interval_type_names = ["Alarm Clock","Timer"];
   
    Set_element_dataset(tag_time_interval,"unique_id",time_interval.id);
    Set_element_txt(tag_txt_basic_info_time_interval,`${time_interval_type_names[+time_interval.tp]}: ${(time_interval.raw_time)}`);
    Set_element_txt(tag_name_time_interval,time_interval.name);
        
   
    Set_element_txt(tag_tune_notification_txt,(time_interval.name)); 
    
    Set_element_attribute(tag_tune_time_inverval,"src",`media/${tunes[+time_interval.tune]}`);

   
    // ============================================================================             

               
    tag_bt_start_resume_time_interval.addEventListener("click",(ev) => {
       
   
       var index_time_interval = Get_index_element_time_interval(Get_element_dataset(ev.target.parentElement.parentElement.parentElement,"unique_id"));
     
       
       if(time_intervals[index_time_interval].status == 3)
            time_intervals[index_time_interval].resume_time_interval();
        else if(time_intervals[index_time_interval].status == 0)
            time_intervals[index_time_interval].set_time_interval_initial_configurations();  
                            
       time_intervals[index_time_interval].status = 1;

       Configure_time_intervals(index_time_interval);
     
       if(!(countdown_time_intervals))
            Set_countdown_time_intervals();
    

        
 
     });
 
     // ============================================================================
     
     tag_bt_pause_time_inverval.addEventListener("click",(ev) => {

        engine_configure_time_interval(ev,3);
                                                                                       
     });
 
     // ============================================================================
  
    tag_bt_cancel_time_inverval.addEventListener("click",(ev) => {
     
        engine_configure_time_interval(ev,0);
     
    });    
 
   // ==============================================================================
   
   tag_bt_finish_tune_notification.addEventListener("click",(ev)=>{

        tag_tune_time_inverval.pause();

        engine_configure_time_interval(ev,0);

   });
   
   // ==============================================================================

   function engine_configure_time_interval(ev,status)
   {


      
    var index_time_interval = Get_index_element_time_interval(Get_element_dataset(ev.target.parentElement.parentElement.parentElement,"unique_id")); 
                            
    time_intervals[index_time_interval].status = status;

    Configure_time_intervals(index_time_interval);



   } 

  // ===============================================================================

   return tag_template_time_interval_copy;
                                                                               
}  

// =================================================================================

function Render_no_data_message()
{
    const tag_no_data_message = Create_element("div");
    
    Add_class(tag_no_data_message,"no_data_message");
    Set_element_txt(tag_no_data_message,"THERE IS NO DATA");
    
    Add_child(tag_box_time_intervals,tag_no_data_message);

}

// =================================================================================


function Engine_countdown_time_intervals()
{
 
    for(var i = 0; i < time_intervals.length;i++)
    {
        
        switch(time_intervals[i].status)
        {
            case 1:
               engine_update_rendered_time_interval(i);
            break;

            case 2:
                if(time_intervals[i].automatic_interruption_raw_time > 0)
                    engine_update_automatic_interruption_remain_time(i);
            break;
        }
   
 
    }

 // =============================================================================================================




  
function engine_update_rendered_time_interval(index)
{

  if(time_intervals[index].status != 1)
    return;

    const tag_time_interval = document.querySelectorAll(".time_interval")[index];
    const tag_remain_time_time_interval = tag_time_interval.querySelector(".remain_time_time_interval");  
   
    
    time_intervals[index].update_remain_time();  

    time_intervals[index].formated_remain_time = time_intervals[index].format_remain_time(time_intervals[index].remain_time); 
    Set_element_txt(tag_remain_time_time_interval,`${(time_intervals[index].formated_remain_time)}`);   

 

  if(time_intervals[index].remain_time <= 0)
  {            
     time_intervals[index].status = 2;
     Configure_time_intervals(index);     
  }
   
}


    function engine_update_automatic_interruption_remain_time(index)
    {
    
        if((time_intervals[index].status != 2) || (!(time_intervals[index].automatic_interruption_raw_time)))
            return;

        const tag_time_interval = document.querySelectorAll(".time_interval")[index];
        const tag_tune_time_inverval = tag_time_interval.querySelector(".tune_time_interval");
        
        
        time_intervals[index].update_automatic_interruption_remain_time(); 

        if(time_intervals[index].automatic_interruption_remain_time <= 0)
        {
            const Check_current_time = (ev) => {
                                            
                if(ev.target.paused)
                {
                    tag_tune_time_inverval.removeEventListener("timeupdate",Check_current_time);

                     time_intervals[index].status = 0; 
                     Configure_time_intervals(index);    
                }

             }


            tag_tune_time_inverval.loop = false;

            tag_tune_time_inverval.addEventListener("timeupdate",Check_current_time); 

                       
                                                                                  
        }
    }


    Set_countdown_time_intervals();

}


function Configure_time_intervals(index)
{

    const tag_time_interval = document.querySelectorAll(".time_interval")[index];
    const tag_remain_time_time_interval = tag_time_interval.querySelector(".remain_time_time_interval");
    
    const tag_bt_start_resume_time_interval =  tag_time_interval.querySelector(".bt_start_resume_time_interval");
    const tag_bt_pause_time_inverval =  tag_time_interval.querySelector(".bt_pause_time_interval");
    const tag_bt_cancel_time_inverval =  tag_time_interval.querySelector(".bt_cancel_time_interval");

    const tag_bt_remove_time_interval =  tag_time_interval.querySelector(".bt_remove_time_interval");
    const tag_bt_edit_time_inverval =  tag_time_interval.querySelector(".bt_edit_time_interval");

    const tag_box_tune_notification =  tag_time_interval.querySelector(".box_tune_notification");

    const tag_tune_time_inverval =  tag_time_interval.querySelector(".tune_time_interval");
     
    const tag_bt_finish_tune_notification =  tag_time_interval.querySelector(".bt_finish_tune_notification");


    var configuration_time_interval = [
        
        () => {

                tag_tune_time_inverval.loop = true;

                Set_element_txt(tag_remain_time_time_interval,"00:00:00");
                
                Set_element_disabled(tag_bt_start_resume_time_interval,false);
                Set_element_disabled(tag_bt_pause_time_inverval,true);
                Set_element_disabled(tag_bt_cancel_time_inverval,true);
                Set_element_disabled(tag_bt_finish_tune_notification,true);
            
                
                Add_class(tag_box_tune_notification,"display_none");
                Add_class(tag_bt_pause_time_inverval,"display_none");

                Remove_class(tag_bt_start_resume_time_interval,"display_none");
                Remove_class(tag_bt_remove_time_interval,"opacity_ten_percent");
                Remove_class(tag_bt_edit_time_inverval,"opacity_ten_percent");

                Set_element_txt(tag_bt_start_resume_time_interval,"Start");


                Set_element_attribute(tag_bt_remove_time_interval,"alt","Remove");
                Set_element_attribute(tag_bt_remove_time_interval,"title","Remove");

                Set_element_attribute(tag_bt_edit_time_inverval,"alt","Edit");
                Set_element_attribute(tag_bt_edit_time_inverval,"title","Edit");

                tag_bt_remove_time_interval.addEventListener("click",Engine_remove_time_interval);
                tag_bt_edit_time_inverval.addEventListener("click",Engine_edit_time_interval);
        
            

            }, 

        () => {
            

                Set_element_disabled(tag_bt_start_resume_time_interval,true);
                Set_element_disabled(tag_bt_pause_time_inverval,(time_intervals[index].tp == 0));
                Set_element_disabled(tag_bt_cancel_time_inverval,false);
                Set_element_disabled(tag_bt_finish_tune_notification,true);
            
                Add_class(tag_box_tune_notification,"display_none");
                Add_class(tag_bt_start_resume_time_interval,"display_none");
                Add_class(tag_bt_remove_time_interval,"opacity_ten_percent");
                Add_class(tag_bt_edit_time_inverval,"opacity_ten_percent");

                Remove_class(tag_bt_pause_time_inverval,"display_none");
            
                Remove_element_attribute(tag_bt_remove_time_interval,"alt");
                Remove_element_attribute(tag_bt_remove_time_interval,"title");

                Remove_element_attribute(tag_bt_edit_time_inverval,"alt");
                Remove_element_attribute(tag_bt_edit_time_inverval,"title");

                                                
                tag_bt_remove_time_interval.removeEventListener("click",Engine_remove_time_interval);
                tag_bt_edit_time_inverval.removeEventListener("click",Engine_edit_time_interval);  

            
            
                },

            () => {
                        Set_element_disabled(tag_bt_pause_time_inverval,true);
                        Set_element_disabled(tag_bt_cancel_time_inverval,true);
                        Set_element_disabled(tag_bt_finish_tune_notification,false);
                        
                        Remove_class(tag_box_tune_notification,"display_none");
                                                
                        Set_element_attribute(tag_tune_time_inverval,"loop",true);

                        tag_tune_time_inverval.volume = 1;
                        tag_tune_time_inverval.currentTime = 0;
                        tag_tune_time_inverval.play();
                    

                        if(time_intervals[index].automatic_interruption_raw_time)
                            time_intervals[index].automatic_interruption_end_time = time_intervals[index].automatic_interruption_raw_time;
                        
                                        

                },   
                
            () => {
            
                    Set_element_disabled(tag_bt_start_resume_time_interval,false);
                    Set_element_disabled(tag_bt_pause_time_inverval,true);

                    Set_element_txt(tag_bt_start_resume_time_interval,"Resume");
                
                    Add_class(tag_bt_pause_time_inverval,"display_none");
                    
                    Remove_class(tag_bt_start_resume_time_interval,"display_none");

                }       

];


    configuration_time_interval[time_intervals[index].status]();
    

}

// ================================================================================


async function Engine_remove_time_interval(ev)
{
   
    if(await Message.confirm_box("Are you sure that you want to remove this time interval?"))
    {
       
        const tag_time_interval = ev.target.parentElement.parentElement;
        var index_time_interval = Get_index_element_time_interval(Get_element_dataset(tag_time_interval,"unique_id"));    

        Remove_element(tag_time_interval); 

        time_intervals.splice(index_time_interval,1);

        if(time_intervals.length)
            local_storage_data_time_intervals.save(time_intervals.map(t_i => t_i.toJson()));
        else
        {
            local_storage_data_time_intervals.remove();
            Render_no_data_message();
        }
         
           
    } 

}

// =====================================================================================

function Engine_create_time_interval()
{

    mode = 0;
   
    Engine_open_input_data_menu();

}  

// =====================================================================================

function Engine_edit_time_interval(ev)
{
  
    const tag_time_interval = ev.target.parentElement.parentElement;
    var index_time_interval = Get_index_element_time_interval(Get_element_dataset(tag_time_interval,"unique_id"));  

    Fill_input_data_menu(time_intervals[index_time_interval]);

    mode = 1;

    Engine_open_input_data_menu();
}

// =====================================================================================




function  Engine_fill_tag_select(tag_select,max_value)
{

    for(var i = 0; i <= max_value; i++)
    {
        const tag_option = Create_element("option");
     
        const val = Add_zero(i);
        
        Set_element_value(tag_option,val);
        Set_element_txt(tag_option,val);

        Add_child(tag_select,tag_option);

    }

}

function Set_audio_preview_src()
{
    var index = +(Get_checked_elements_values(tags_tune_time_interval));

    Set_element_attribute(tag_audio_preview,"src",`media/${tunes[index]}`);

}


function Engine_Configure_Selected_label_visual(element)
{
  
    element.parentElement.parentElement.querySelectorAll("label").forEach((label) => {
            
        Remove_class(label,"selected_label");
    
    });
         
    Add_class(element.parentElement,"selected_label");
}

function Engine_reconfigure_tag_hours_time_interval(index)
{
    var hours = [23,99];

    var current_value = Get_element_value(tag_hours_time_interval);
   
    Remove_element_children(tag_hours_time_interval);

    Engine_fill_tag_select(tag_hours_time_interval,hours[+index]);

    if(current_value > hours[+index])
        Set_element_value(tag_hours_time_interval,hours[+index]);
    else
        Set_element_value(tag_hours_time_interval,current_value);    
    
}

// ===================================================================================

function Engine_open_input_data_menu()
{
    
    Set_element_txt(tag_title_input_data_menu, (mode) ? "Edit Time Interval" : "Add a New Time Interval"); 
    
    if(!(mode))
        Set_element_value(tag_name_time_interval,Compare_strings(Get_checked_elements_values(tags_tp_time_interval),"1") ? 
                                                                                                                     "New Timer" : 
                                                                                                                     "New Alarm Clock");
    Check_data_validity();
   
    Remove_class(tag_input_data_menu.parentElement,"visibility_hidden");
}

// ====================================================================================

function Open_box_credits()
{
    Remove_class(tag_box_credits.parentElement,"visibility_hidden");
}

// ====================================================================================

function Close_input_data_menu()
{
    Close_modal(tag_input_data_menu.parentElement);
    Clear_input_data_menu();
}

// ================================================================================

function Close_box_credits(ev)
{
    Close_modal(ev.target.parentElement);
}

// ================================================================================

function Close_modal(modal)
{
    Add_class(modal,"visibility_hidden");
}

// ================================================================================


function Check_data_validity()
{

if(Compare_strings(Get_element_value(tag_name_time_interval).trim(),""))
    Set_element_value(tag_name_time_interval,Get_element_value(tag_name_time_interval).trim());

Set_element_disabled(tag_bt_save_data,(!
                                         (            
                                            (tag_name_time_interval.checkValidity()) 
                                         )   
                                      )
                                      ||
                                      (
                                        Compare_strings(Get_checked_elements_values(tags_tp_time_interval),"1")
                                        &&
                                        Compare_strings(`${Get_element_value(tag_hours_time_interval)}:${Get_element_value(tag_minutes_time_interval)}:${Get_element_value(tag_seconds_time_interval)}`,"00:00:00")

                                      )
                  
                    );
}



// ==============================================================================

async function Engine_build_edit_time_interval()
{
 
    var time_interval = Create_new_time_interval();
    var default_time_interval = Create_new_time_interval();
    
   

    if(time_interval)
    {
              
        var index = Get_index_element_time_interval(time_interval.id); 
    
                            
        if(index == -1)
        {
            
            if(!(time_intervals.length))
                Remove_element_children(tag_box_time_intervals);


            Add_child(tag_box_time_intervals,Render_time_interval(time_interval));
          
            index = time_intervals.length;
                               
        }    
        else
        {
            ReplaceElements(tag_box_time_intervals,Render_time_interval(time_interval),tag_box_time_intervals.
                querySelectorAll(".time_interval")[index]); 
         
                
        }

        Close_input_data_menu();  

        time_intervals[index] = time_interval;

        Configure_time_intervals(index);
          
                
        if(time_intervals[index].automatic_start)
            time_intervals[index].set_time_interval_initial_configurations();


            if(!(countdown_time_intervals))
                Set_countdown_time_intervals();
       
       
                      
        local_storage_data_time_intervals.save(time_intervals.map(time_interval => time_interval.toJson()));

        if(default_time_interval)
        {
            default_time_interval.id = "-1";
            default_time_interval.name = "";

            local_storage_data_input_data_menu.save(default_time_interval.toJson(default_time_interval)); 
        }
                
        await Message.alert_box("Done!");
        
    }
    else
        await Message.alert_box("An error has occurred.");
        

   
   
    
}

// ==============================================================================

function Get_data_input_data_menu()
{

return [ 
            Compare_strings(Get_element_value(tag_id_time_interval),"-1") ? Generate_new_id() : Get_element_value(tag_id_time_interval),  
            Get_checked_elements_values(tags_tp_time_interval),   
            Get_element_value(tag_name_time_interval),  
            `${Get_element_value(tag_hours_time_interval)}:${Get_element_value(tag_minutes_time_interval)}:${Get_element_value(tag_seconds_time_interval)}`,
            Get_checked_elements_values(tags_tune_time_interval),
            Get_element_checked(tag_automatic_start_time_interval),
            Get_checked_elements_values(tags_time_automatic_interrupt_time_interval)
        ];
      

}

// ==============================================================================

function Fill_input_data_menu(time_interval)
{


    var [hours,minutes,seconds] = time_interval.raw_time.split(":");

    Engine_reconfigure_tag_hours_time_interval(time_interval.tp);

    Set_element_value(tag_id_time_interval,time_interval.id);
    Check_Element_by_value(tags_tp_time_interval,time_interval.tp);
    Set_element_value(tag_name_time_interval,time_interval.name);
    Set_element_value(tag_hours_time_interval,hours);
    Set_element_value(tag_minutes_time_interval,minutes);
    Set_element_value(tag_seconds_time_interval,seconds);
    Check_Element_by_value(tags_tune_time_interval,time_interval.tune);
    Set_element_checked(tag_automatic_start_time_interval,time_interval.automatic_start);
    Check_Element_by_value(tags_time_automatic_interrupt_time_interval,time_interval.automatic_interruption_raw_time);
  

    Engine_Configure_Selected_label_visual(Get_checked_element(tags_tp_time_interval));
    Engine_Configure_Selected_label_visual(Get_checked_element(tags_tune_time_interval));
    Engine_Configure_Selected_label_visual(Get_checked_element(tags_time_automatic_interrupt_time_interval));
  
}

// ==============================================================================

function Clear_input_data_menu()
{
    Set_element_value(tag_id_time_interval,"-1");
    Set_element_value(tag_name_time_interval,"");
}
// ==============================================================================

function Generate_new_id() 
{

  

    var generated_ids = time_intervals.map((t_i) =>{ return t_i.id; });
    var id;
             
    do
    {
        id = Generate_random_number(1,(time_intervals.length + 10000));

    }while(generated_ids.indexOf(id) != -1); 
    
 

    return id;
}

// ==============================================================================


function Create_new_time_interval()
{

    var time_interval_classes = [Alarm,Timer];
    
    var [
         id_time_interval,
         tp_time_interval,
         name_time_interval,
         raw_time_time_interval,
         tune_time_interval,
         automatic_start_time_interval,
         automatic_interruption_raw_time_time_interval
        ] = Get_data_input_data_menu();
      
 
                
    var time_interval = new time_interval_classes[+tp_time_interval](           
                                                                      id_time_interval,
                                                                      tp_time_interval,
                                                                      name_time_interval,
                                                                      raw_time_time_interval,
                                                                      tune_time_interval,
                                                                      automatic_start_time_interval,
                                                                      automatic_interruption_raw_time_time_interval          
                                                                      );  
                                                                             
     
    return time_interval;

}

// ==============================================================================


function Get_index_element_time_interval(id)
{
 

    var index = time_intervals.findIndex((t_i) => {
                                                                                            
        return ((t_i.id == id));   

    });

    return index;

}

// ==============================================================================

function Set_countdown_time_intervals()
{

        countdown_time_intervals = (time_intervals.some((time_interval) => { return (time_interval.status == 1 || time_interval.status == 2); }));
   
        if(countdown_time_intervals)
            window.setTimeout(Engine_countdown_time_intervals,1000);
}


// ==============================================================================

// Default Functions;

function Set_element_value(element,val)
{
    element.value = val;
}
    
// ==============================================================================

function Get_element_value(element)
{
    return element.value;
}
    
// ==============================================================================

function Set_element_disabled(element,status = false)
{
    element.disabled = status;
}
        
// =============================================================================


function Get_element_disabled(element)
{
    return element.disabled;
}
        
// =============================================================================

function Set_element_txt(element,txt)
{

    element.textContent = txt;

}

// =============================================================================

function Get_element_txt(element)
{

return element.textContent;

}


// =============================================================================


function Set_element_checked(element,checked)
{

    element.checked = checked;

}

// =============================================================================

function Get_element_checked(element)
{

    return element.checked;

}

// =============================================================================

function Set_element_inner_html(element,innerHtml)
{

    element.innerHTML = innerHtml;
    
}
    
// ============================================================================


function Add_class(element,cls)
{

    element.classList.add(cls);

}

// =======================================================================


function Remove_class(element,cls)
{

    element.classList.remove(cls);
    
}

// =========================================================================================

function Convert_to_uppercase(txt)
{

    return txt.toUpperCase();
}

// ========================================================================================

function Generate_random_number(val1,val2)
{
            
    var num = val1 + (Math.round(Math.random() * (val2 - val1)));
    
    return num;
    
}
    
// ========================================================================

function Call_function_helper(data,func)
{

    for(var i = 0; i < data.length; i++)
        func(data[i]);
    
}

// =============================================================================

function Create_event_helper(elements,event,func,param = null)
{
    for(const element of elements)
    {
                        
        if(param)
            element.addEventListener(event,() => { func(param);});
        else
            element.addEventListener(event,func);
          
     }
}

// =============================================================================

function Compare_strings(str1,str2)
{
    
    return (!(str1.localeCompare(str2)));

}

// ===============================================================================

function Create_element(element)
{

    return document.createElement(element);

}   

// ========================================================================================

function Verify_element_attribute(element,attr)
{
    return element.hasAttribute(attr);
}
    
// ===========================================================================================

function Set_element_attribute(element,attr,val)
{
    element.setAttribute(attr,val);
            
}
    
// ===========================================================================================

function Get_element_attribute(element,attr)
{
   return element.getAttribute(attr);
        
}
    
// ===========================================================================================

function Remove_element_attribute(element,attr)
{
    element.removeAttribute(attr);
}
    
// ===========================================================================================

function Add_child(element,child)
{

    element.appendChild(child);

}

// ========================================================================================

function Customize_element_validity(element,exp,msg_error)
{

    element.setCustomValidity(exp ? "" : msg_error);

}

// ========================================================================================

function Set_element_dataset(element,dataset_name,value)
{

    element.dataset[dataset_name] = value;

}

// ========================================================================================

function Get_element_dataset(element,dataset_name)
{

    return element.dataset[dataset_name];

}

// ========================================================================================


function Remove_element(element)
{

    element.remove(); 
    
}

// ========================================================================================

function Remove_element_children(element)
{

    while(element.childElementCount)
        Remove_element(element.lastElementChild);

}

// =======================================================================================

function Clone_element(element,clone_children_too = true)
{
    return element.cloneNode(clone_children_too);
}

// ========================================================================================


function Get_checked_elements_values(elements)
{

    var checked_elements = [];

    elements.forEach(element => {

        if(Get_element_checked(element))
            checked_elements.push(Get_element_value(element));
                        
    });

    if(checked_elements.length)
    {
        return (checked_elements.length == 1) ? checked_elements[0] : checked_elements;
    }
    else
        return null;
}

// ========================================================================================

function Check_Element_by_value(radio_elements,value)
{
    
    radio_elements.forEach(radio_element => {


        Set_element_checked(radio_element,Get_element_value(radio_element) == value);
       

        
    });
  
}

// ========================================================================================

function ReplaceElements(parent,element_in,element_out){

    parent.replaceChild(element_in,element_out);

}

// ========================================================================================

function Add_zero(n)
{
    if(n < 10)
        n = "0" + n;
    
    return n;
}

// ========================================================================================

function Get_checked_element(elements)
{

    var checked_element = null;

    elements.forEach((element) => { 

        if(Get_element_checked(element))
        {
            checked_element = element; 
        }

    });

    return checked_element;
} 

// ========================================================================================