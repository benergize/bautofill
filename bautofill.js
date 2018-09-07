
$( document ).ready(function() {

	
	//Create lists underneath the text elements
	if(document.getElementsByClassName('bautoCompleteInput').length > 0) {

	

		var autoCompletes = document.getElementsByClassName('bautoCompleteInput');
		
		for(var v = 0; v < autoCompletes.length; v++) {
		
		
		
			var bautoCompleteList = document.createElement("ul");
			bautoCompleteList.className = 'bautoCompleteList';
			bautoCompleteList.id = autoCompletes[v].id + "-list";
			
			bautoCompleteList.style['margin-left'] = autoCompletes[v].offsetLeft-8+autoCompletes[v].scrollLeft;
			bautoCompleteList.style['width'] = autoCompletes[v].clientWidth
			
			autoCompletes[v].insertAdjacentHTML("afterend",bautoCompleteList.outerHTML)
		}
	}

	

	menuHasFocus = false;
	 
	$(".bautoCompleteInput").keydown(function(e) { displayMenu(this,e); });
	$(".bautoCompleteInput").keyup(function(e) { displayMenu(this,e); }); 
	$(".bautoCompleteInput").focusout(function(e) { closeTheMenu(this); } );
	 

	function closeTheMenu(element) {
		if(menuHasFocus == false) { 
			document.getElementById(element.id+"-list").innerHTML = ""; 
			document.getElementById(element.id+"-list").style["visibility"] = "hidden"; 
		}
		
	}
	 
	function displayMenu(selectedTextBox,ev) {
		
		var thisDataSet = selectedTextBox.dataset['filler']; 
		autoCompleteData = JSON.parse(thisDataSet); 
		

		//Exit the field if the user pressed enter
		var keycode = (ev.keyCode ? ev.keyCode : ev.which);
		if(keycode == '13'){ ev.preventDefault(); closeTheMenu(selectedTextBox); return true; }


		var fieldValue = selectedTextBox.value;
		var thisList = document.getElementById(selectedTextBox.id + "-list");
		thisList.style["visibility"] = "visible";
		
		
		thisList.innerHTML = "";
		
		for(var v = 0; v < autoCompleteData.length; v++) {
		
		
			if(autoCompleteData[v].toLowerCase().indexOf(fieldValue.toLowerCase()) != -1 && fieldValue != "") {
				
				
				var newNode = document.createElement("li");

				newNode.name = autoCompleteData[v];
				newNode.className = "bautoCompleteItem"; 
				newNode.style['width'] = selectedTextBox.style['width'];

				newNode.onclick = function(){
					
					selectedTextBox.focus(); 
					selectedTextBox.value = this.name; 
					
					for(var v = 0; v < document.getElementsByClassName("bautoCompleteList").length; v++) {
						document.getElementsByClassName("bautoCompleteList")[v].innerHTML = "";
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