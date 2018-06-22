import CurveControl from "./curve-control";
import Chart from "./chart";

const minDomainInput = document.getElementById("minDomain");
const maxDomainInput = document.getElementById("maxDomain");
const fxInput = document.getElementById("fx");
const fyInput = document.getElementById("fy");
const fzInput = document.getElementById("fz");
const tInput = document.getElementById("tValue");
const tSlider = document.getElementById("tSlider");
const tControls = document.getElementById("tControls");
const moveCameraInput = document.getElementById("moveCamera");
let mode = "1";

let chart1 = new Chart({
	targetDiv: document.getElementById("firstGraphDiv")
});

let curveControl;

document.getElementById("mechanicsLink").addEventListener("click", () => {
	document.getElementById("descriptionMechanics").classList.remove("hidden");
	document.getElementById("descriptionCinematics").classList.add("hidden");
	mode = "1";
	chart1.clear("a");
	chart1.clear("aT");
	chart1.clear("aCpta");
})

document.getElementById("cinematicsLink").addEventListener("click", () => {
	document.getElementById("descriptionCinematics").classList.remove("hidden");
	document.getElementById("descriptionMechanics").classList.add("hidden");
	mode = "2";
	chart1.clear("T");
	chart1.clear("N");
	chart1.clear("B");
});

document.getElementById("geometryLink").addEventListener("click", () => {
	mode = "3";
})

window.addEventListener("resize", function (event) {
	chart1.resize();
})

document.getElementById("mainForm").addEventListener("submit", function (event) {
	event.preventDefault();
	initialize();
});

tSlider.addEventListener("input", function () {
	tInput.value = tSlider.value;
	drawVectors(parseFloat(tSlider.value));
});

tInput.addEventListener("input", function () {
	tSlider.value = parseFloat(tInput.value);
	drawVectors(parseFloat(tInput.value));
})

const drawGraph = () => {
	chart1.clear("function");
	chart1.clear("T");
	chart1.clear("N");
	chart1.clear("B");
	chart1.clear("a");
	chart1.clear("aT");
	chart1.clear("aCpta");
	chart1.clear("particle");

	let minDomain = parseFloat(minDomainInput.value);
	let maxDomain = parseFloat(maxDomainInput.value);

	curveControl = new CurveControl(fxInput.value, fyInput.value, fzInput.value);
	
	let epsilon = 0.05;
	
	for (let t = minDomain; t < maxDomain; t = t + epsilon) {
		let pointTI = curveControl.getPoint(t);
		let pointTF = curveControl.getPoint(t + epsilon);
		chart1.drawLine(chart1.defaultMaterial, pointTI, pointTF, "function");
	}
}

const drawVectors = (t) => {
	let datasetTI = curveControl.getDataset(t);
	chart1.drawParticle(datasetTI.r);

	if (mode === "1") {
		drawVector(chart1, datasetTI.r, datasetTI.T, "T", 0xff0055);
		drawVector(chart1, datasetTI.r, datasetTI.N, "N", 0x0033cc);
		drawVector(chart1, datasetTI.r, datasetTI.B, "B", 0x009933);
	} else if (mode === "2") {
		drawVector(chart1, datasetTI.r, datasetTI.a, "a", 0x82437f);
		drawVector(chart1, datasetTI.r, datasetTI.aT, "aT", 0xcc0066);
		drawVector(chart1, datasetTI.r, datasetTI.aCpta, "aCpta", 0xff6600);
	}

	if (moveCameraInput.checked === true)
		chart1.updateCamera([datasetTI.r[0] + 10, datasetTI.r[1] + 2, datasetTI.r[2] + 5], datasetTI.r);
}


const drawVector = (chart, i, f, name, color) => {
	chart.clear(name);
	chart.drawVector(color, i, f, name);
}

const initialize = () => {
	/* submitButton.innerHTML = "Carregando...";
	submitButton.setAttribute("disabled", "true"); */

	tControls.classList.remove("hidden");
	tSlider.setAttribute("max", maxDomainInput.value);
	tSlider.setAttribute("min", minDomainInput.value);
	tSlider.value = tInput.value = (parseFloat(minDomainInput.value) + parseFloat(maxDomainInput.value)) / 2;

	drawGraph();

	/* drawGraph().then(() => {
		submitButton.innerHTML = "Gerar gráfico";
		submitButton.removeAttribute("disabled");
	}); */
}

initialize();
