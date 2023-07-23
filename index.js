function disableInputs(workOutside, taxRate, income) {
	document.getElementById("submit").disabled = true
	workOutside.disabled = true
	taxRate.disabled = true
	income.disabled = true
}

function calculateTaxes(workOutside, taxRate, income) {
	const currentTaxes = Math.trunc(workOutside ? income * taxRate : income * 0.001)
	const proposedTaxes = Math.trunc(workOutside ? income * taxRate * 0.75 : income * 0.010)
	const calculatedDifference = Math.trunc(currentTaxes - proposedTaxes)
	const difference = document.getElementById("difference")
	
	document.getElementById("current-taxes-due").innerHTML = `$${currentTaxes}`
	document.getElementById("proposed-taxes-due").innerHTML = `$${proposedTaxes}`
	difference.innerHTML = `$${calculatedDifference}`
	difference.classList.remove(["green", "red"])
	
	if (difference > 0) {
		difference.classList.add("green")
	}
	else if (difference < 0) {
		difference.classList.add("red")
	}
}

function onSubmit() {
	const workOutside = document.getElementById("work-outside")
	const taxRate = document.getElementById("tax-rate")
	const income = document.getElementById("income")

	if (!taxRate.value || !income.value) {
		alert("Missing fields")
		return false;
	}
	
	document.getElementById("outputs").classList.remove("hidden")
	disableInputs(workOutside, taxRate, income)
	calculateTaxes(workOutside.value, taxRate.value, income.value)

	return false
}

function onEdit() {
	document.getElementById("outputs").classList.add("hidden")
	document.getElementById("work-outside").disabled = false
	document.getElementById("tax-rate").disabled = false
	document.getElementById("income").disabled = false
	document.getElementById("submit").disabled = false
}
