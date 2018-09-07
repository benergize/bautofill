
$( document ).ready(function() {

	
	//Create lists underneath the text elements
	if(document.getElementsByClassName('autoCompleteInput').length > 0) {

	

		var autoCompletes = document.getElementsByClassName('autoCompleteInput');
		
		for(var v = 0; v < autoCompletes.length; v++) {
		
		
		
			var autoCompleteList = document.createElement("ul");
			autoCompleteList.className = 'autoCompleteList';
			autoCompleteList.id = autoCompletes[v].id + "-list";
			
			autoCompletes[v].insertAdjacentHTML("afterend",autoCompleteList.outerHTML)
		}
	}

	

	menuHasFocus = false;
	 
	$(".autoCompleteInput").keydown(function(e) { displayMenu(this,e); });
	$(".autoCompleteInput").keyup(function(e) { displayMenu(this,e); }); 
	$(".autoCompleteInput").focusout(function(e) { closeTheMenu(this); } );
	 

	function closeTheMenu(element) {
		if(menuHasFocus == false) { document.getElementById(element.id+"-list").innerHTML = "";  }
		
	}
	 
	function displayMenu(selectedTextBox,ev) {
		
		autoCompleteData = JSON.parse(selectedTextBox.dataset['filler']); 

		//Exit the field if the user pressed enter
		var keycode = (ev.keyCode ? ev.keyCode : ev.which);
		if(keycode == '13'){ ev.preventDefault(); closeTheMenu(selectedTextBox); return true; }


		var fieldValue = selectedTextBox.value;
		var thisList = document.getElementById(selectedTextBox.id + "-list");
		
		
		thisList.innerHTML = "";
		
		for(var v = 0; v < autoCompleteData.length; v++) {
		
		
			if(autoCompleteData[v].toLowerCase().indexOf(fieldValue.toLowerCase()) != -1 && fieldValue != "") {
				
				
				var newNode = document.createElement("li");

				newNode.name = autoCompleteData[v];
				newNode.className = "well well-sm autoCompleteItem"; 
				newNode.style['width'] = selectedTextBox.style['width'];

				newNode.onclick = function(){
					
					selectedTextBox.focus(); 
					selectedTextBox.value = this.name; 
					
					for(var v = 0; v < document.getElementsByClassName("autoCompleteList").length; v++) {
						document.getElementsByClassName("autoCompleteList")[v].innerHTML = "";
					}
				} 
				
				
				newNode.onmouseover = function() { menuHasFocus = selectedTextBox; }
				newNode.onmouseout = function() { menuHasFocus = false; }
				
				
				var textNode = document.createTextNode(autoCompleteData[v]);
				newNode.appendChild(textNode);
				
				thisList.appendChild(newNode);
			}
		}
	}
});