(function( $ )
{
  // This function formats a text field to a US 
  // phone number as the user types the information.
 
  $.fn.usphone = function() 
  {
    this.keyup(function() 
    {
     var curchrindex = this.value.length;
     var curval = $(this).val();
     var strvalidchars = "0123456789()-";
          
     for (i =0; i < this.value.length; i++)
     {
      var curchar = curval[i];
      if (strvalidchars.indexOf(curchar) == -1) 
      {
       //delete the character typed if this is not a valid character.
       $(this).val(curval.substring(0, i) + curval.substring(i+1, this.value.length));
      }
     }
     
     // Insert formatting at the right places
     if (curchrindex == 3) 
     {
      $(this).val("(" + curval + ")" + "-");
     }
     else if (curchrindex == 9)
     {
      $(this).val(curval + "-");
     }
     
     //Do not allow more than 15 characters including the brackets and the "-"
     if (curchrindex == 15) 
     {
      //delete the last character typed 
         $(this).val(curval.substring(0, this.value.length-1 ));
     }
     
    });
  };
})( jQuery );