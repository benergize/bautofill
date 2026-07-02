window.bautofill = {

	option: function(text,value) {
		return {"text": text, "value": value};
	},

	openMenu: -1,

	hooks: [],

	registry: {},

	init: function() {

		var autoCompletes = Array.from(document.querySelectorAll('bautoCompleteInput, [data-bautofill]'));
		
		for(var v = 0; v < autoCompletes.length; v++) { 
			
			bautofill.bind(autoCompletes[v]);
		}

		bautofill.menuHasFocus = false;

		window.addEventListener("click",function(e) {
			if(bautofill.openMenu != -1) {
				let target = e.target;
				for(let v = 0; v < 5; v++) {
					if(target.id == bautofill.openMenu || target.id == bautofill.openMenu + "-list") {
						return;
					}
					else {
						if(target.parentNode) { target = target.parentNode; }
					}
				}
				
				bautofill.closeTheMenu(document.getElementById(bautofill.openMenu), true);
			}
		});
	},

	//reqwuire or dont require valid entry, set data-value to innerhtml if not in list, or obviously, id if found
	bind: function(element, overrideOptions=false) {

		if(element.id == "") { element.id = "bautofill-id-auto-" + Object.keys(bautofill.registry).length + 1; }

		if(typeof bautofill.registry[element.id] == "undefined") { bautofill.registry[element.id] = []; }

		if(overrideOptions !== false) {
			bautofill.registry[element.id] = bautofill.registry[element.id].concat(overrideOptions);
		}
		if(typeof element.dataset.list != "undefined" && element.dataset.list != null) {

			let list = document.querySelector("#" + element.dataset.list);

			if(list) {
				Array.from(list.children).forEach(child=>{ bautofill.registry[element.id].push(bautofill.option(child.innerHTML,child.value)); });
				element.dataset.list = null;
			}
			
		}
		else {
			let autoCompleteData = JSON.parse(element.dataset['filler']||"[]").concat(JSON.parse(element.dataset['bautofill'])); 
			autoCompleteData.forEach(data=>{ bautofill.registry[element.id].push(bautofill.option(data,data)); });
		}
		
		var bautoCompleteList = document.createElement("ul");
		bautoCompleteList.className = 'bautoCompleteList';
		bautoCompleteList.id = element.id + "-list";
		
		bautoCompleteList.style['margin-left'] = element.offsetLeft-8+element.scrollLeft;
		bautoCompleteList.style['width'] = element.offsetWidth + "px";
		bautoCompleteList.style['margin-top'] = element.offsetHeight + "px";
		
		element.insertAdjacentHTML("afterend", bautoCompleteList.outerHTML)

		element.addEventListener("keydown",(function(e) { bautofill.displayMenu(this,e); }));
		element.addEventListener("keyup",(function(e) { bautofill.displayMenu(this,e); }));
		element.addEventListener("focus",(function(e) { bautofill.displayMenu(this,e); }));
		element.addEventListener("click",(function(e) { bautofill.displayMenu(this,e); }));
		
	},

	closeTheMenu: function(element, force=false) {

		if(bautofill.menuHasFocus == false || document.querySelector("#" + element.id + "-list").children.length==0 || force) { 
			bautofill.openMenu = -1;
			document.getElementById(element.id+"-list").innerHTML = ""; 
			document.getElementById(element.id+"-list").style["visibility"] = "hidden";
			
			if(bautofill.registry[element.id].map(el=>{ return el.text }).indexOf(element.value) == -1) {

				element.value = "";
				element.dataset.value = "";
			}
			else {
				element.dataset.value = bautofill.registry[element.id].filter(el=>{return el.text == element.value})[0].value;
			}
		}
		
	},
		
	displayMenu: function(selectedTextBox,ev) {
		
		bautofill.openMenu = selectedTextBox.id;

		//Exit the field if the user pressed enter
		var keycode = (ev.keyCode ? ev.keyCode : ev.which);
		if(keycode == '13'){ ev.preventDefault(); bautofill.closeTheMenu(selectedTextBox); return true; }


		var fieldValue = selectedTextBox.value;
		var thisList = document.getElementById(selectedTextBox.id + "-list");
		
		thisList.style['margin-left'] = selectedTextBox.offsetLeft-8+selectedTextBox.scrollLeft;
		thisList.style['width'] = selectedTextBox.offsetWidth + "px";
		thisList.style['margin-top'] = selectedTextBox.offsetHeight + "px";

		thisList.style["visibility"] = "visible";
		
		
		thisList.innerHTML = "";

		let autoCompleteData = bautofill.registry[selectedTextBox.id];
		
		for(var v = 0; v < autoCompleteData.length; v++) {
		
		
			if(autoCompleteData[v]['text'].toLowerCase().indexOf(fieldValue.toLowerCase()) != -1 || fieldValue == "") {
				
				
				var newNode = document.createElement("li");

				newNode.name = autoCompleteData[v]['text'];
				newNode.dataset.value = autoCompleteData[v]['value'];
				newNode.className = "bautoCompleteItem  dropdown-item"; 
				newNode.style['width'] = selectedTextBox.style['width'];

				newNode.onclick = function(){
					
					selectedTextBox.focus(); 
					selectedTextBox.value = this.name; 
					selectedTextBox.dataset.value = this.dataset.value; 
					
					for(var v = 0; v < document.getElementsByClassName("bautoCompleteList").length; v++) {
						document.getElementsByClassName("bautoCompleteList")[v].innerHTML = "";
						document.getElementsByClassName("bautoCompleteList")[v].style['visibility'] = "hidden";
					}

					bautofill.hooks.forEach(hook=>{hook();});
				} 
				
				
				newNode.onmouseover = function() { bautofill.menuHasFocus = selectedTextBox; }
				newNode.onmouseout = function() { bautofill.menuHasFocus = false; }
				
				
				var textNode = document.createTextNode(autoCompleteData[v]['text']);
				newNode.appendChild(textNode);
				
				thisList.appendChild(newNode);
			}
		}
	}
	
}

document.addEventListener("DOMContentLoaded",function() { bautofill.init(); });