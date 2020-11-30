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
	stupidSort: {
		title: "Stupid sort",
		sort: (m)=>{
			let result = [1];
			return result;
		},
		description: "",
		step: (m, colors)=>{
			if (check(m)){
				return colorsArray(m.length, 'lime');
			}
			let i=sorts.stupidSort.i;
			colors = colorsArray(m.length);
			colors[i] = 'yellow';
			colors[i+1] = 'yellow';
			if (m[i]>m[i+1]){
				[m[i], m[i+1]] = [m[i+1], m[i]];
			}
			sorts.stupidSort.i++;
			if (sorts.stupidSort.i==m.length-sorts.stupidSort.n) {
				sorts.stupidSort.i=0;
				sorts.stupidSort.n++;
			}
			for (var j=0; j<sorts.stupidSort.n; j++) {
				colors[m.length-1-j] = 'lime';
			}
			return colors;
		},
		i: 0,
		n: 0,
		reset: ()=>{
			sorts.stupidSort.i=0;
			sorts.stupidSort.n=0;
		}
	}
}

function main() {
	let n = 20;
	let currentSort = sorts.stupidSort;
	let array = randomArray(n);
	let timer;
	let colors = colorsArray(n);
	update();
	
	last_name.oninput = function () {
		clearInterval(timer);
		n = parseInt(last_name.value)+1;
		array = randomArray(n);
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
			colors = colorsArray(n);
			currentSort.reset();
			for (const [key, sort] of Object.entries(sorts)){
				if (sort.title===elem.innerHTML)
					currentSort = sort;	
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