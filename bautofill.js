function bautofill_doDrop(el) {
	
	let items = [];
	
	try {
		items = JSON.parse(el.dataset.items);
	}
	catch(e) {
		console.error("Malformed JSON, couldn't populate list.");
		return false;
	}
	
	let foundMatch = false; 
	let oldDropdown = document.getElementById("bautofill_dropDown");
	
	if(oldDropdown !== null) { oldDropdown.remove(); }
	
	let dropDownArea = document.createElement("div");
	dropDownArea.id = "bautofill_dropDown";
	dropDownArea.style.position = "absolute";
	dropDownArea.style.top = el.offsetTop + el.offsetHeight + "px";
	dropDownArea.style.left = el.offsetLeft + "px";
	dropDownArea.style.width = el.offsetWidth-2 + "px"; 
	
	let dropDownList = document.createElement("ul");
	dropDownList.classList.add("bautofill_dropDownList");
	dropDownArea.appendChild(dropDownList);

	items.forEach(item => {
	
		if(item.indexOf(el.value) !== -1 && item !== el.value) {
		
			foundMatch = true;
			
			let listItem = document.createElement("li");
			listItem.innerHTML = item; 
			listItem.classList.add("bautofill_listItem");
			listItem.addEventListener("mousedown", ev => {
			
				el.value = item;
			});
			
			dropDownArea.getElementsByTagName("ul")[0].appendChild(listItem);
		}
	}); 
	
	if(foundMatch) {
	
		document.body.appendChild(dropDownArea);
	}
}

Array.from(document.getElementsByClassName('bautofill')).forEach(el => {
	
	
	el.addEventListener("keydown", ev => { bautofill_doDrop(el); });
	el.addEventListener("keyup", ev => { bautofill_doDrop(el); }); 
	el.addEventListener("focus", ev => { bautofill_doDrop(el); });
	
	el.addEventListener("blur", ev => {
		
		let oldDropdown = document.getElementById("bautofill_dropDown");
		if(oldDropdown !== null) { oldDropdown.remove(); }
	});
	
	
});
