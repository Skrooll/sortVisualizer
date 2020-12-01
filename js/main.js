window.addEventListener('load', main, false);
const sorts = {
	randomSort: {
		title: "Random sort",
		sort: (m)=>{
			while (!check(m)) {
				shuffle(m);
			}
		},
		step: (m, colors)=>{
			if (check(m)){
				return colorsArray(m.length, 'lime');
			}
			shuffle(m);
			return colors;
		},
		description: "Bless RNG.",
		reset: ()=>{},
	},
	bubleSort: {
		title: "Buble sort",
		sort: (m)=>{
			let result = [1];
			return result;
		},
		description: "Bubble sort, sometimes referred to as sinking sort, is a simple sorting algorithm that repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order. The pass through the list is repeated until the list is sorted. The algorithm, which is a comparison sort, is named for the way smaller or larger elements \"bubble\" to the top of the list.",
		step: (m, colors)=>{
			if (check(m)){
				return colorsArray(m.length, 'lime');
			}
			let i=sorts.bubleSort.i;
			colors = colorsArray(m.length);
			colors[i] = 'yellow';
			colors[i+1] = 'yellow';
			if (m[i]>m[i+1]){
				[m[i], m[i+1]] = [m[i+1], m[i]];
			}
			sorts.bubleSort.i++;
			if (sorts.bubleSort.i==m.length-sorts.bubleSort.n) {
				sorts.bubleSort.i=0;
				sorts.bubleSort.n++;
			}
			for (var j=0; j<sorts.bubleSort.n; j++) {
				colors[m.length-1-j] = 'lime';
			}
			return colors;
		},
		i: 0,
		n: 0,
		reset: ()=>{
			sorts.bubleSort.i=0;
			sorts.bubleSort.n=0;
		}
	},
	shakerSort: {
		title: "Shaker sort",
		step: (m, colors)=>{
			if (check(m))
				return colorsArray(m.length, 'lime');
			let i=sorts.shakerSort.i;
			if (sorts.shakerSort.forward) {
				let i=sorts.shakerSort.i;
				colors = colorsArray(m.length);
				colors[i] = 'yellow';
				colors[i+1] = 'yellow';
				if (m[i]>m[i+1]){
					[m[i], m[i+1]] = [m[i+1], m[i]];
				}
				sorts.shakerSort.i++;
				if (sorts.shakerSort.i==m.length-Math.round(sorts.shakerSort.n/2)) {
					sorts.shakerSort.n++;
					sorts.shakerSort.forward = false;
				}
				for (let j=0; j<Math.round(sorts.shakerSort.n/2); j++) {
					colors[m.length-1-j] = 'lime';
				}
				for (let j=0; j<sorts.shakerSort.n-Math.round(sorts.shakerSort.n/2); j++) {
					colors[j] = 'lime';
				}
				return colors;
			}
			else {
				let i=sorts.shakerSort.i;
				colors = colorsArray(m.length);
				colors[i] = 'yellow';
				colors[i-1] = 'yellow';
				if (m[i]<m[i-1]){
					[m[i], m[i-1]] = [m[i-1], m[i]];
				}
				sorts.shakerSort.i--;
				if (sorts.shakerSort.i==sorts.shakerSort.n-Math.round(sorts.shakerSort.n/2)) {
					sorts.shakerSort.n++;
					sorts.shakerSort.forward = true;
					
				}
				for (let j=0; j<Math.round(sorts.shakerSort.n/2); j++) {
					colors[m.length-1-j] = 'lime';
				}
				for (let j=0; j<sorts.shakerSort.n-Math.round(sorts.shakerSort.n/2); j++) {
					colors[j] = 'lime';
				}
				return colors;
			}
		},
		forward: true,
		i: 0,
		n: 0,
		reset: ()=>{
			sorts.shakerSort.i = 0;
			sorts.shakerSort.n = 0;
			sorts.shakerSort.forward = true;
		}
	}
}

function main() {
	M.AutoInit();
	let n = 20;
	let currentSort = sorts.bubleSort;
	theory.innerHTML = currentSort.description;
	let array = randomArray(n);
	//let array = range(1, n).reverse();
	let timer;
	let colors = colorsArray(n);
	update();
	
	last_name.oninput = function () {
		clearInterval(timer);
		n = parseInt(last_name.value)+1;
		array = randomArray(n);
		//array = range(1, n).reverse();
		colors = colorsArray(n);
		currentSort.reset();
		timer = setInterval(()=>{
			draw();
			colors = currentSort.step(array, colors);
		}, 1000/n);
	}
	
	for (const [key, sort] of Object.entries(sorts)) {
		dropdown1.innerHTML+=`<li><span class="black-text chooseSort">${sort.title}</span></li>`;
	}
	let list = document.getElementsByClassName('chooseSort');
	for (let elem of list){
		elem.onclick = ()=>{
			dropdown.innerHTML = elem.innerHTML;
			array = randomArray(n);
			//array = range(1, n).reverse();
			colors = colorsArray(n);
			currentSort.reset();
			for (const [key, sort] of Object.entries(sorts)){
				if (sort.title===elem.innerHTML)
					currentSort = sort;	
					theory.innerHTML = currentSort.description;
			}
		}
	}
	let ctx = c.getContext('2d');
	let w = c.width;
	let h = c.height;
	
	timer = setInterval(()=>{
		draw();
		colors = currentSort.step(array, colors);
	}, 1000/n);
	function draw() {
		ctx.clearRect(0, 0, w, h);
		let hmax = Math.max.apply(null, array);
		let xmax = array.length;
		let hscale = h/hmax;
		let xscale = w/xmax;
		for (let i=0; i<array.length; i++) {
			ctx.fillStyle = colors[i];
			ctx.fillRect(i*xscale, 0, xscale, hscale*array[i]);
			ctx.strokeRect(i*xscale, 0, xscale, hscale*array[i]);
		}
	}
	
	function update() {
		dropdown.innerHTML = currentSort.title;
	}
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function check(array) {
	for (let i = 0; i<array.length-1; i++) {
		if (array[i]>array[i+1]) {
			return false;
		}
	}
	return true;
}
function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}
function range(start, stop, step=1) {
	let array = [];
	for (let i=start; i<stop; i+=step) {
		array.push(i);
	}
	return array;
}
function randomArray(n){
	let array = range(1, n);
	shuffle(array);
	return array;
}
function colorsArray(n, color='blue'){
	let array = [];
	for (let i=0; i<n; i++){
		array.push(color);
	}
	return array;
}