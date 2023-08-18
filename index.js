function disableInputs(workOutside, taxRate, income) {
	workOutside.disabled = true
	taxRate.disabled = true
	income.disabled = true
}

function formatToDollar(input) {
	return `$${input.toLocaleString("en-US")}`
}

function onWorkOutsideChange() {
	const workOutside = document.getElementById("work-outside").value
	
	if (workOutside === 'yes') {
		document.getElementById("tax-rate-row").classList.remove("hidden")//disabled = false
		document.getElementById("employment-taxes-row").classList.remove("hidden")
		document.getElementById("current-employment-taxes-row").classList.remove("hidden")
	} else {
		document.getElementById("tax-rate").value = null
		document.getElementById("tax-rate-row").classList.add("hidden")//disabled = false
		document.getElementById("employment-taxes-row").classList.add("hidden")
		document.getElementById("current-employment-taxes-row").classList.add("hidden")
	}	
}

function calculateCurrentTaxes(taxRate, income) {
	const CURRENT_TAX_RATE = .01
	const placeOfWorkTaxes = Math.trunc(income * taxRate)
	const johnstownTaxes = Math.trunc(income * CURRENT_TAX_RATE)
	
	return {
		placeOfWorkTaxes,
		johnstownTaxes,
		total: johnstownTaxes + placeOfWorkTaxes
	}
}

function calculateProposedTaxes(taxRate, income) {
	const PROPOSED_TAX_RATE = .0225
	const placeOfWorkTaxes = Math.trunc(income * taxRate)
	const johnstownTaxes = Math.trunc(income * PROPOSED_TAX_RATE)
	const credit = Math.trunc(income * Math.min(taxRate, PROPOSED_TAX_RATE) * 0.75)

	return {
		placeOfWorkTaxes,
		johnstownTaxes,
		credit,
		grossTotal: placeOfWorkTaxes + johnstownTaxes,
		total: placeOfWorkTaxes + johnstownTaxes - credit
	}
}

function calculateTaxes(taxRate, income) {
	const currentTaxes = calculateCurrentTaxes(taxRate, income)
	const proposedTaxes = calculateProposedTaxes(taxRate, income)

	document.getElementById("current-employment-taxes-due").innerHTML = formatToDollar(currentTaxes.placeOfWorkTaxes)
	document.getElementById("current-johnstown-taxes-due").innerHTML = formatToDollar(currentTaxes.johnstownTaxes)
	document.getElementById("current-gross-taxes-due").innerHTML = formatToDollar(currentTaxes.total)

	document.getElementById("employment-taxes-due").innerHTML = formatToDollar(proposedTaxes.placeOfWorkTaxes)
	document.getElementById("johnstown-taxes-due").innerHTML = formatToDollar(proposedTaxes.johnstownTaxes)
	document.getElementById("gross-taxes-due").innerHTML = formatToDollar(proposedTaxes.grossTotal)
	document.getElementById("johnstown-tax-credit").innerHTML = formatToDollar(proposedTaxes.credit)
	document.getElementById("total-taxes-due").innerHTML = formatToDollar(proposedTaxes.total)

	const difference = document.getElementById("savings")
	const calculatedDifference = currentTaxes.total - proposedTaxes.total

	difference.innerHTML = `$${calculatedDifference}`
	difference.classList.remove("red")
	difference.classList.remove("green")
	
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
	
	document.getElementById("proposed-outputs").classList.remove("hidden")
	document.getElementById("current-outputs").classList.remove("hidden")
	disableInputs(workOutside, taxRate, income)
	calculateTaxes(taxRate.value * .01, income.value)
	document.getElementById("submit").classList.add("hidden")
	document.getElementById("edit").classList.remove("hidden")
	document.getElementById("tax-table").classList.add("hidden")

	return false
}

function onEdit() {
	document.getElementById("proposed-outputs").classList.add("hidden")
	document.getElementById("current-outputs").classList.add("hidden")
	document.getElementById("edit").classList.add("hidden")
	document.getElementById("submit").classList.remove("hidden")
	document.getElementById("tax-table").classList.remove("hidden")
	document.getElementById("work-outside").disabled = false
	document.getElementById("tax-rate").disabled = false
	document.getElementById("income").disabled = false
}
