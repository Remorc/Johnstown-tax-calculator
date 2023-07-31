function disableInputs(workOutside, taxRate, income) {
	document.getElementById("submit").disabled = true
	workOutside.disabled = true
	taxRate.disabled = true
	income.disabled = true
}

function onWorkOutsideChange() {
	const workOutside = document.getElementById("work-outside").value
	const taxRate = document.getElementById("tax-rate")
	
	if (workOutside === 'yes') {
		taxRate.disabled = false
	} else {
		taxRate.value = null
		taxRate.disabled = true
	}	
}

function calculateCurrentTaxes(workOutside, taxRate, income) {
	const CURRENT_TAX_RATE = .01
	const johnstownTaxes = income * CURRENT_TAX_RATE
	let placeOfWorkTaxes = 0
	
	if (workOutside) {
		placeOfWorkTaxes = income * taxRate	
	}
	
	return johnstownTaxes + placeOfWorkTaxes
}

function calculateProposedTaxes(workOutside, taxRate, income) {
	const PROPOSED_TAX_RATE = .0225
	let placeOfWorkTaxes = 0
	let taxCredit = 0
	
	if (workOutside) {
		placeOfWorkTaxes = income * taxRate
		taxCredit = income * Math.min(taxRate, PROPOSED_TAX_RATE) * 0.75
	}

	const johnstownTaxes = income * PROPOSED_TAX_RATE
	
	return johnstownTaxes + placeOfWorkTaxes - taxCredit
}

function calculateTaxes(workOutside, taxRate, income) {
	const currentTaxes = Math.trunc(calculateCurrentTaxes(workOutside, taxRate, income))
	const proposedTaxes = Math.trunc(calculateProposedTaxes(workOutside, taxRate, income))
	const calculatedDifference = Math.trunc(currentTaxes - proposedTaxes)
	const difference = document.getElementById("difference")
	
	document.getElementById("current-taxes-due").innerHTML = `$${currentTaxes}`
	document.getElementById("proposed-taxes-due").innerHTML = `$${proposedTaxes}`
	difference.innerHTML = `$${calculatedDifference}`
	difference.classList.remove("red")
	difference.classList.remove("green")
	
	console.log(calculatedDifference)
	if (calculatedDifference > 0) {
		difference.classList.add("green")
	}
	else if (calculatedDifference < 0) {
		difference.classList.add("red")
	}
}

function onSubmit() {
	const workOutside = document.getElementById("work-outside")
	const taxRate = document.getElementById("tax-rate")
	const income = document.getElementById("income")
	let missingFieldsErrorText = []
	
	if (workOutside.value === "yes" && !taxRate.value) {
		missingFieldsErrorText.push("tax rate")
	}
	
	if (!income.value) {
		missingFieldsErrorText.push("income")
	}

	if (missingFieldsErrorText.length > 0) {
		alert(`Missing fields: ${missingFieldsErrorText.join(", ")}`)
		return false;
	}
	
	document.getElementById("outputs").classList.remove("hidden")
	disableInputs(workOutside, taxRate, income)
	calculateTaxes(workOutside.value === "yes", taxRate.value * .01, income.value)

	return false
}

function onEdit() {
	const workOutside = document.getElementById("work-outside")
	document.getElementById("outputs").classList.add("hidden")
	workOutside.disabled = false
	document.getElementById("tax-rate").disabled = workOutside.value !== "yes"
	document.getElementById("income").disabled = false
	document.getElementById("submit").disabled = false
}
