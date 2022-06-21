
dta = "data" ;
cfg = "config";
dft = "dft";
hdp = "hdp";
map = "map";
org = "org";
fpt = "fpt";
kyf = "kyf";
lnk = "lnk";
nxs = "nxs";
til = "til";

lg_b = [0, 0, 0, 0];
lg_t = [0, 0];
lg_c = [];
lgi = 0;

sdiv = "";

//load data from config file
var fp = dta + "/" + cfg + "/" ;


var adft, anxs, ahdp, aorg, afpt, akyf, alnk, atil, tmp;
var svg, cmap, nxsInfo, span;

const svgns = "http://www.w3.org/2000/svg";
const svglk = "http://www.w3.org/1999/xlink";




window.addEventListener('load', function() {
    
	tmp = Math.floor(Date.now() / 1000);
	Promise.all(
		[
			fetchFile(fp + dft + ".csv?t=" + tmp).then(v => { if (!v) {return v;} else { adft = csvToKv(v); return true; }; }), 
			fetchFile(fp + hdp + ".csv?t=" + tmp).then(v => { if (!v) {return v;} else { ahdp = csvToKv(v); return true; }; }),
			fetchFile(fp + nxs + ".csv?t=" + tmp).then(v => { if (!v) {return v;} else { anxs = csvToObject(v, 'id'); return true; }; }), 
			fetchFile(fp + org + ".csv?t=" + tmp).then(v => { if (!v) {return v;} else { aorg = csvToObject(v, 'sigle'); return true; }; }),
			fetchFile(fp + fpt + ".csv?t=" + tmp).then(v => { if (!v) {return v;} else { afpt = csvToObject(v, 'id'); return true; }; }),
			fetchFile(fp + kyf + ".csv?t=" + tmp).then(v => { if (!v) {return v;} else { akyf = csvToObject(v, 'id'); return true; }; }),
			fetchFile(fp + lnk + ".csv?t=" + tmp).then(v => { if (!v) {return v;} else { alnk = csvToObject(v, 'id'); return true; }; }),
			fetchFile(fp + til + ".csv?t=" + tmp).then(v => { if (!v) {return v;} else { atil = csvToMObject(v, 'map'); return true; }; })
			
		]).then((a) => {
			
			v = a.reduce((o,n) => {return (n && o); }, true);
			if (v) {
				loadPortal(); 
				
				s = window.location.search.slice(1, window.location.search.length);
				s = s.split('&');
				for (let i = 0; i < s.length ; i++) {
					s[i] = s[i].split('=');
					if (s[i][0] == 's') {
						sdiv = s[i][1];
					}
				}
				if (sdiv != "") {
					l = dta + "/" + sdiv  + ".csv" ;
					tmp = Math.floor(Date.now() / 1000);
					fetchFile(l+"?t="+tmp).then(v => { 
						if (!v) {
						
						} else {
							
							d = csvGrpToKv(v); 
							clickAction(d);
						}; 
					});
				}
			}else alert("some files are not loaded properly !");
		});

	svg = document.getElementById('map');
	// svg2 = getSubDocument(svg);
	nxsInfo = document.getElementById('nxsInfo');
	span = document.getElementsByClassName("close")[0];
	
	span.onclick = function() {
		nxsInfo.style.display = "none";
	}
	
	window.onclick = function(event) {
		if (event.target == nxsInfo) {
			nxsInfo.style.display = "none";
		}
	} 

	svg.addEventListener("load", function() {
		loadHDP(document.getElementById('map').contentDocument);
	});
	
	

})

function loadPortal() {
	svg.setAttribute("data", fp + map + "/" + adft.maps);
	cmap = adft.maps;
}

function getSubDocument(d) {
	if (d.contentDocument)  {
		return d.contentDocument.documentElement;
	} 
	else  {
		var subdoc = null;
		try {
			subdoc = d.getSVGDocument();
		} catch(e) {}
		return subdoc.documentElement;
	}
}

function loadHDP(O) {
	if (typeof ahdp !== undefined) {
		lg_b = [50, 400, 75, 10];
		lgi = 0;
		lg_c = [];
		Object.entries(ahdp).forEach(([k, v]) => {			
			if (k != "" && v != "") {
				cArea(O, k, v);
				cHover(O, k);
			}
		});
		aTiles(O.documentElement, cmap);
	}
}

function cArea(O, i, c) {
	var a = O.getElementById(i);
	if (typeof a === "object" && !Array.isArray(a) && a !== null) {
		// console.log(anxs[c].boxstyle);
		if ('style' in a  && typeof anxs[c].boxstyle !== undefined) {
			a.setAttribute("style", anxs[c].boxstyle);
			
			aLegend(O.documentElement, c);
		}
	}
}

function cHover(O, i) {
	f = dta + "/" + i  + ".csv" ;
	// alert(f);
	tmp = Math.floor(Date.now() / 1000);
	// tmp = time();
	fetchFile(f+"?t="+tmp).then(v => { 
		if (!v) {
		
		} else {
			var a = O.getElementById(i);
			
			if (a !== null ) {
			
				a.addEventListener("onmouseover", function() {
					mouseOverEffect
				});
				
				a.addEventListener("onmouseout", function() {
					mouseOutEffect
				});
				
				a.addEventListener("click", function() {
					d = csvGrpToKv(v); 
					clickAction(d);
				});
			
			}
		}; 
	});
}

function mouseOverEffect () {
	this.classList.add("area-highlight2");
};

function mouseOutEffect () {
	this.classList.remove("area-highlight2");
};

function clickAction (e) {
	// console.log(e);
	if ('maps' in e) {
		svg.setAttribute("data", fp + map + "/" + e.maps[0]);
		cmap = e.maps[0];
		
	} else {
		nxsInfo.style.display = "block";
		c = nxsInfo.querySelector('.modal-body');
		
		//Partners
		p = nxsInfo.querySelector('.org_list');
		pc = "";
		if ('org' in e) {
			for (i = 0; i < e.org.length ; i++){
				// pc += "<div>";
				pt = (aorg[e.org[i]].logo == "")?"":"<span><img height='50px' src=" + fp + org + "/" + aorg[e.org[i]].logo + " /></span>&nbsp;";
				pc += pt;
				pc += "<span>" + aorg[e.org[i]].sigle + "["+ aorg[e.org[i]].label + "]</span>&nbsp;";
				// pc += "</div>";
			}
			p.innerHTML = pc;
		}
		
		//Donors
		d = nxsInfo.querySelector('.don_list');
		dc = "";
		if ('don' in e) {
			for (i = 0; i < e.don.length ; i++){
				pt = (aorg[e.don[i]].logo == "")?"":"<span><img height='50px' src=" + fp + org + "/" + aorg[e.don[i]].logo + " /></span>&nbsp;" ;
				dc += pt;
dc += "<span>" + aorg[e.don[i]].sigle + "["+ aorg[e.don[i]].label + "]</span>&nbsp;&nbsp;&nbsp;";
			}
			d.innerHTML = dc;
		}
		
		//focal point
		f = nxsInfo.querySelector('.fpt_list');
		fc = "";
		if ('fpt' in e) {
			for (i = 0; i < e.fpt.length ; i++){
				fc += "<span>" + afpt[e.fpt[i]].name + ", "+ afpt[e.fpt[i]].org + " ["+ afpt[e.fpt[i]].email + " - "+ afpt[e.fpt[i]].phone + "] </span><br/>";
			}
			f.innerHTML = fc;
		}
		
		//link - Doc
		l = nxsInfo.querySelector('.lnk_list');
		lc = "";
		if ('lnk' in e) {
			for (i = 0; i < e.lnk.length ; i++) {
				u = (alnk[e.lnk[i]].lnk == 1) ? "http://" + alnk[e.lnk[i]].info : fp + lnk + "/" + alnk[e.lnk[i]].info;
				t = (alnk[e.lnk[i]].title === undefined || alnk[e.lnk[i]].title == "") ? alnk[e.lnk[i]].info : alnk[e.lnk[i]].title;
				lc += "<span><a href='" + u + "' target='_blank'>"+ t +"</a></span>&nbsp;&nbsp;";
			}
			l.innerHTML = lc;
		}
		
		//key data
		k = nxsInfo.querySelector('.kyf_list');
		kc = "";
		if ('kyf' in e) {
			for (i = 0; i < e.kyf.length ; i++){
				kc += "<img width='80%' src=" + fp + kyf + "/" + akyf[e.kyf[i]].img + " />&nbsp;&nbsp;&nbsp;<br/>";
			}
			k.innerHTML = kc;
		}
	}
};

function aTiles(o, m) {
	if (atil[m] !== undefined) {
		
		for (let i = 0; i < atil[m].length; i++) {
			
			//Create Box
			e = document.createElementNS(svgns, 'rect');
			e.setAttributeNS(null, 'x', atil[m][i].x);
			e.setAttributeNS(null, 'y', atil[m][i].y);
			e.setAttributeNS(null, 'width', atil[m][i].w);
			e.setAttributeNS(null, 'height', atil[m][i].h);
			e.setAttributeNS(null, 'style', atil[m][i].boxstyle);
			o.appendChild(e);
				
			//Create title
			e = document.createElementNS(svgns, 'text');
			e.setAttributeNS(null, 'x', parseInt(atil[m][i].x) + 3);
			e.setAttributeNS(null, 'y', parseInt(atil[m][i].y) + 15);
			s = (atil[m][i].titlestyle === undefined)?adft.textstyle:atil[m][i].titlestyle;
			e.setAttributeNS(null, 'style', s);
			t = document.createTextNode(atil[m][i].title);
			e.appendChild(t);
			o.appendChild(e);
			
			//Create Facilitateur
			e = document.createElementNS(svgns, 'text');
			e.setAttributeNS(null, 'x', parseInt(atil[m][i].x) + 3);
			e.setAttributeNS(null, 'y', parseInt(atil[m][i].y) + 25);
			s = adft.textstyle;
			e.setAttributeNS(null, 'style', s);
			t = document.createTextNode("Facilitateurs: ");
			e.appendChild(t);
			o.appendChild(e);
			e = document.createElementNS(svgns, 'text');
			e.setAttributeNS(null, 'x', parseInt(atil[m][i].x) + 68);
			e.setAttributeNS(null, 'y', parseInt(atil[m][i].y) + 25);
			s = (atil[m][i].facilitateurstyle === undefined)?adft.textstyle:atil[m][i].facilitateurstyle
			e.setAttributeNS(null, 'style', s);
			t = document.createTextNode(atil[m][i].facilitateur);
			e.appendChild(t);
			o.appendChild(e);
			
			// //Create Email
			e = document.createElementNS(svgns, 'text');
			e.setAttributeNS(null, 'x', parseInt(atil[m][i].x) + 3);
			e.setAttributeNS(null, 'y', parseInt(atil[m][i].y) + 35);
			s = adft.textstyle;
			e.setAttributeNS(null, 'style', s);
			t = document.createTextNode("Contact: ");
			e.appendChild(t);
			o.appendChild(e);
			e = document.createElementNS(svgns, 'text');
			e.setAttributeNS(null, 'x', parseInt(atil[m][i].x) + 48);
			e.setAttributeNS(null, 'y', parseInt(atil[m][i].y) + 35);
			s = (atil[m][i].emailstyle === undefined)?adft.textstyle:atil[m][i].emailstyle;
			e.setAttributeNS(null, 'style', s);
			t = document.createTextNode(atil[m][i].email);
			e.appendChild(t);
			o.appendChild(e);
		}
	}
}

function aLegend(O, c) {
	
	if (parseInt(adft.legend) == 1 && !lg_c.includes(c)) {
		
		lg_c.push(c);
		
		x = parseInt(anxs[c].lgi_x) || 0;
		y = parseInt(anxs[c].lgi_y) || 0;
		h = parseInt(anxs[c].lgi_h) || 0;
		w = parseInt(anxs[c].lgi_w) || 0;
		
		lx = parseInt(anxs[c].lgl_x) || 0;
		ly = parseInt(anxs[c].lgl_y) || 0;
		
		d = false;
		
		
		if (lgi == 0 ) {
			
			if (x != 0 && y != 0 && h != 0 && w != 0 && lx != 0 && ly != 0) {
				lg_b[0] = x;
				lg_b[1] = y;
				lg_b[2] = h;
				lg_b[3] = w;
				
				lg_t[0] = lx;
				lg_t[1] = ly;
				
				lgi++;
				d = true;
			}
			
		} else {
			
			if (x != 0 && y != 0 && h != 0 && w != 0 && lx != 0 && ly != 0) {
				
				x = lg_b[0];
				y = lg_b[1] + (lg_b[2] + 3)*lgi ;
				h = lg_b[2];
				w = lg_b[3];
				
				lx = lg_t[0];
				ly = lg_t[1] + (lg_b[2] + 3)*lgi ;

				lgi++;
				d = true;
			}
		}
		
		if (d) {
		
			if (anxs[c].imges != "") {
				i = document.createElementNS(svgns, 'image');
				i.setAttributeNS(svglk, 'href', "../../../" + fp + nxs + "/"+ anxs[c].imges);
				i.setAttributeNS(null, 'x', x);
				i.setAttributeNS(null, 'y', y);
				i.setAttributeNS(null, 'height', h);
				i.setAttributeNS(null, 'visibility', 'visible');
				O.appendChild(i);
			} else {
				i = document.createElementNS(svgns, 'rect');
				i.setAttributeNS(null, 'x', x);
				i.setAttributeNS(null, 'y', y);
				i.setAttributeNS(null, 'width', w);
				i.setAttributeNS(null, 'height', h);
			
				i.setAttributeNS(null, 'style', anxs[c].boxstyle);
				O.appendChild(i);
			}
			
			if (anxs[c].label != "") {
				i = document.createElementNS(svgns, 'text');
				i.setAttributeNS(null, 'x', lx);
				i.setAttributeNS(null, 'y', ly);
				i.setAttributeNS(null, 'style', anxs[c].textstyle);
				t = document.createTextNode(anxs[c].label);
				
				i.appendChild(t);
				O.appendChild(i);
			}
		}	
	}
}

async function fetchFile(f) {
    try {
        let r = await fetch(f);
		return (r.status === 200)?await r.text() : false;
    } catch (error) {
        console.log(error);
    }
}

function csvToArray(s, d = ",") {
	const hd = s.slice(0, s.indexOf("\r")).split(d);
	const r = s.slice(s.indexOf("\n") + 1).split("\r\n");
	const arr = r.map(function (row) {
		const v = row.split(d);
		const el = hd.reduce(function (o, h, i) {
			o[h] = v[i];
			return o;
		}, {});
		return el;
	});
	// arr.shift();
	return arr;
}

function csvToObject(s, i, d = ",") {
	const t = csvToArray(s);
	return t.reduce((o, a) =>{
		const e = new Object();
		e[a[i]] = a;
		return { ...e, ...o};
	}, {});
}

function csvToMObject(s, i, d = ",") {
	const t = csvToArray(s);
	return t.reduce((o, a) =>{
		if (o[a[i]] === undefined) {
			o[a[i]] = [];
			o[a[i]][0] = a;
		} else {
			o[a[i]][o[a[i]].length] = a;
		}
		return o;
	}, {});
}

function csvToKv(s, d = ",") {
	const r = s.split("\r\n");
	const arr = r.reduce(function (a, rw) {
		const v = rw.split(d);
		const e = new Object();
		e[v[0]] = v[1];
		return (v[1] === undefined || v[0] == "")? a : {...a, ...e};
	}, {});
	return arr;
}

function csvGrpToKv(s, d = ",") {
	const r = s.split("\r\n");
	const arr = r.reduce(function (a, rw) {
		const v = rw.split(d);
		if (v[0] in a) {
			a[v[0]].push(v[1]);
			return a;
		} else {
			const e = new Object();
			e[v[0]] = [v[1]];
			return (v[1] === undefined || v[0] == "")? a : {...a, ...e};
		}
	}, {});
	return arr;
}