google.charts.load('current', { packages: ['corechart'] });
google.charts.setOnLoadCallback(drawChart);

function drawChart() {
	chartAccumDiv = document.getElementById('chartAccum');
	chartDayDiv = document.getElementById('chartDay');
	btnNewCases = document.getElementById('btn-new-cases');
	btnNewDeaths = document.getElementById('btn-new-deaths');
	btnNewRecovered = document.getElementById('btn-new-recovered');
	btnLog = document.getElementById('btn-log-scale');

	var dataAccum = new google.visualization.DataTable();
	dataAccum.addColumn('number', 'Tiempo'); // 0
	dataAccum.addColumn('number', 'Casos Acumulados'); // 2
	dataAccum.addColumn('number', 'Recuperados Acumulados'); // 4
	dataAccum.addColumn('number', 'Muertes Acumuladas'); // 6
	dataAccum.addColumn('number', 'Casos Activos'); // 7
	dataAccum.addRows(getColumns(dataArray, [0, 2, 4, 6, 7]));
	var logScale = false;

	var dataDay = new google.visualization.DataTable();
	dataDay.addColumn('number', 'Tiempo'); // 0
	dataDay.addColumn('number', 'Casos Diarios'); // 1
	dataDay.addColumn('number', 'Recuperados Diarios'); // 3
	dataDay.addColumn('number', 'Muertes Diarias'); // 5
	dataDay.addRows(getColumns(dataArray, [0, 1, 3, 5]));

	var viewAccum = new google.visualization.DataView(dataAccum);
	var viewDay = new google.visualization.DataView(dataDay);

	var nullFunc = (data, col) => {
		return null;
	};

	seriesAccum = [
		null,
		{ visible: true, label: 'Casos Acumulados', type: 'number' },
		{ visible: true, label: 'Recuperados Acumulados', type: 'number' },
		{ visible: true, label: 'Muertes Acumuladas', type: 'number' },
		{ visible: true, label: 'Casos Activos', type: 'number' },
	];

	seriesDay = [
		null,
		{ visible: true, label: 'Casos Diarios', type: 'number' },
		{ visible: false, label: 'Recuperados Diarios', type: 'number' },
		{ visible: false, label: 'Muertes Diarias', type: 'number' },
	];

	var optionsAccum = {
		series: seriesAccum,
		fontName: 'Computer Modern',
		lineWidth: 1,
		pointSize: 2,
		legend: {
			position: 'top',
			alignment: 'center',
			maxLines: 4,
		},
		chartArea: {
			top: 50,
			height: '80%',
			width: '80%',
			backgroundColor: {
				stroke: 'black',
				strokeWidth: 1,
			},
		},
		vAxis: {
			scaleType: 'linear',
		},
		axes: {
			x: {
				0: { side: 'bottom', label: 'my x axis' },
				1: { side: 'top' },
			},
		},
		// fontSize: 16,
	};

	var optionsDay = {
		// fontSize: 16,
		fontName: 'Computer Modern',
		lineWidth: 1,
		pointSize: 2,
		legend: {
			position: 'top',
			alignment: 'center',
		},
		chartArea: {
			height: '80%',
			width: '80%',
			backgroundColor: {
				stroke: 'black',
				strokeWidth: 1,
			},
		},
		bar: {
			groupWidth: '80%',
		},
		isStacked: true,
	};

	// var chart = new google.visualization.ScatterChart(chartDiv);
	var chartAccum = new google.visualization.ScatterChart(chartAccumDiv);
	var chartDay = new google.visualization.ColumnChart(chartDayDiv);

	// viewAccum.hideColumns([2, 3]);
	// viewDay.setColumns([0, 1]);

	chartAccum.draw(viewAccum, optionsAccum);
	chartDay.draw(viewDay, optionsDay);

	btnLog.onclick = evt => {
		if (optionsAccum.vAxis.scaleType == 'log')
			optionsAccum.vAxis.scaleType = 'linear';
		else optionsAccum.vAxis.scaleType = 'log';

		chartAccum.draw(viewAccum, optionsAccum);
	};

	window.addEventListener('resize', evt => {
		chartAccum.draw(viewAccum, optionsAccum);
		chartDay.draw(viewDay, optionsDay);
	});

	/*
	Toggle visibility in accumulated data chart
	*/
	google.visualization.events.addListener(chartAccum, 'select', function () {
		var sel = chartAccum.getSelection();
		if (sel[0].row == undefined) {
			var col = sel[0].column;
			seriesAccum[col].visible = !seriesAccum[col].visible;

			var visibleCols = [0];
			for (var i = 1; i < seriesAccum.length; i++) {
				if (seriesAccum[i].visible) visibleCols.push(i);
				else
					visibleCols.push({
						calc: nullFunc,
						label: seriesAccum[i].label,
						type: seriesAccum[i].type,
					});
			}

			// console.log(visibleCols);

			viewAccum.setColumns(visibleCols);
			chartAccum.draw(viewAccum, optionsAccum);
		}
	});

	var visibleCols = [0];
	for (var i = 1; i < seriesDay.length; i++) {
		if (seriesDay[i].visible) visibleCols.push(i);
		else
			visibleCols.push({
				calc: nullFunc,
				label: seriesDay[i].label,
				type: seriesDay[i].type,
			});
	}

	// console.log(visibleCols);

	viewDay.setColumns(visibleCols);
	chartDay.draw(viewDay, optionsDay);

	/*
	Toggle visibility in daily data chart
	*/
	google.visualization.events.addListener(chartDay, 'select', function () {
		var sel = chartDay.getSelection();
		if (sel[0].row == undefined) {
			var col = sel[0].column;
			if (!seriesDay[col].visible) {
				for (var i = 1; i < seriesDay.length; i++)
					seriesDay[i].visible = i == col ? true : false;

				var visibleCols = [0];
				for (var i = 1; i < seriesDay.length; i++) {
					if (seriesDay[i].visible) visibleCols.push(i);
					else
						visibleCols.push({
							calc: nullFunc,
							label: seriesDay[i].label,
							type: seriesDay[i].type,
						});
				}

				// console.log(visibleCols);

				viewDay.setColumns(visibleCols);
				chartDay.draw(viewDay, optionsDay);
			}
		}
	});
}

/* 
Get only some columns
*/
function getColumns(data, cols) {
	var newData = [];
	for (var i = 0; i < data.length; ++i) {
		var newRow = [];
		for (var j = 0; j < cols.length; ++j) {
			newRow.push(data[i][cols[j]]);
		}
		newData.push(newRow);
	}
	return newData;
}

const dataArray = [
	[0, 0, 0, 0, 0, 0, 0, 0],
	[1, 1, 1, 0, 0, 0, 0, 1],
	[2, 3, 4, 0, 0, 0, 0, 4],
	[3, 1, 5, 0, 0, 0, 0, 5],
	[4, 1, 6, 0, 0, 0, 0, 6],
	[5, 0, 6, 0, 0, 0, 0, 6],
	[6, 4, 10, 0, 0, 0, 0, 10],
	[7, 4, 14, 0, 0, 0, 0, 14],
	[8, 10, 24, 0, 0, 0, 0, 24],
	[9, 14, 38, 0, 0, 0, 0, 38],
	[10, 0, 38, 0, 0, 0, 0, 38],
	[11, 1, 39, 0, 0, 0, 0, 39],
	[12, 10, 49, 0, 0, 0, 0, 49],
	[13, 2, 51, 2, 2, 0, 0, 49],
	[14, 3, 54, 2, 4, 0, 0, 50],
	[15, 2, 56, 4, 8, 0, 0, 48],
	[16, 2, 58, 0, 8, 0, 0, 50],
	[17, 0, 58, 0, 8, 0, 0, 50],
	[18, 4, 62, 0, 8, 0, 0, 54],
	[19, 5, 67, 0, 8, 0, 0, 59],
	[20, 1, 68, 1, 9, 0, 0, 59],
	[21, 2, 70, 2, 11, 0, 0, 59],
	[22, 0, 70, 2, 13, 0, 0, 57],
	[23, 2, 72, 0, 13, 0, 0, 59],
	[24, 2, 74, 0, 13, 0, 0, 61],
	[25, 0, 74, 1, 14, 0, 0, 60],
	[26, 0, 74, 13, 27, 0, 0, 47],
	[27, 3, 77, 4, 31, 0, 0, 46],
	[28, 0, 77, 10, 41, 0, 0, 36],
	[29, 0, 77, 3, 44, 0, 0, 33],
	[30, 0, 77, 8, 52, 0, 0, 25],
	[31, 0, 77, 0, 52, 0, 0, 25],
	[32, 1, 78, 12, 64, 0, 0, 14],
	[33, 0, 78, 9, 73, 0, 0, 5],
	[34, 1, 79, 0, 73, 0, 0, 6],
	[35, 2, 81, 1, 74, 0, 0, 7],
	[36, 1, 82, 0, 74, 0, 0, 8],
	[37, 1, 83, 1, 75, 0, 0, 8],
	[38, 0, 83, 0, 75, 0, 0, 8],
	[39, 11, 94, 0, 75, 0, 0, 19],
	[40, 1, 95, 0, 75, 0, 0, 20],
	[41, 3, 98, 0, 75, 0, 0, 23],
	[42, 4, 102, 0, 75, 0, 0, 27],
	[43, 17, 119, 1, 76, 0, 0, 43],
	[44, 1, 120, 0, 76, 0, 0, 44],
	[45, 0, 120, 0, 76, 0, 0, 44],
	[46, 1, 121, 0, 76, 0, 0, 45],
	[47, 5, 126, 6, 82, 0, 0, 44],
	[48, 2, 128, 1, 83, 0, 0, 45],
	[49, 1, 129, 0, 83, 0, 0, 46],
	[50, 2, 131, 4, 87, 0, 0, 44],
	[51, 1, 132, 6, 93, 0, 0, 39],
	[52, 0, 132, 0, 93, 0, 0, 39],
	[53, 0, 132, 2, 95, 0, 0, 37],
	[54, 2, 134, 3, 98, 0, 0, 36],
	[55, 2, 136, 3, 101, 0, 0, 35],
	[56, 3, 139, 9, 110, 0, 0, 29],
	[57, 2, 141, 0, 110, 0, 0, 31],
	[58, 0, 141, 3, 113, 0, 0, 28],
	[59, 0, 141, 0, 113, 0, 0, 28],
	[60, 4, 145, 5, 118, 0, 0, 27],
	[61, 1, 146, 4, 122, 0, 0, 24],
	[62, 2, 148, 1, 123, 1, 1, 25],
	[63, 4, 152, 1, 124, 0, 1, 27],
	[64, 1, 153, 1, 125, 0, 1, 27],
	[65, 3, 156, 13, 138, 0, 1, 17],
	[66, 2, 158, 0, 138, 0, 1, 19],
	[67, 4, 162, 0, 138, 0, 1, 23],
	[68, 0, 162, 0, 138, 0, 1, 23],
	[69, 1, 163, 0, 138, 0, 1, 24],
	[70, 6, 169, 1, 139, 0, 1, 29],
	[71, 5, 174, 0, 139, 0, 1, 34],
	[72, 5, 179, 0, 139, 0, 1, 39],
	[73, 0, 179, 4, 143, 0, 1, 35],
	[74, 2, 181, 0, 143, 0, 1, 37],
	[75, 5, 186, 0, 143, 0, 1, 42],
	[76, 3, 189, 3, 146, 1, 2, 41],
	[77, 11, 200, 3, 149, 2, 4, 47],
	[78, 6, 206, 1, 150, 1, 5, 51],
	[79, 7, 213, 2, 152, 0, 5, 56],
	[80, 7, 220, 6, 158, 0, 5, 57],
	[81, 0, 220, 2, 160, 0, 5, 55],
	[82, 3, 223, 2, 162, 2, 7, 54],
	[83, 15, 238, 1, 163, 1, 8, 67],
	[84, 19, 257, 8, 171, 0, 8, 78],
	[85, 5, 262, 16, 187, 0, 8, 67],
	[86, 3, 265, 4, 191, 0, 8, 66],
	[87, 0, 265, 0, 191, 0, 8, 66],
	[88, 2, 267, 13, 204, 0, 8, 55],
	[89, 2, 269, 3, 207, 0, 8, 54],
	[90, 6, 275, 6, 213, 0, 8, 54],
	[91, 6, 281, 9, 222, 0, 8, 51],
	[92, 4, 285, 12, 234, 0, 8, 43],
	[93, 4, 289, 6, 240, 0, 8, 41],
	[94, 0, 289, 0, 240, 0, 8, 41],
	[95, 1, 290, 12, 252, 0, 8, 30],
	[96, 5, 295, 7, 259, 1, 9, 27],
	[97, 1, 296, 6, 265, 0, 9, 22],
	[98, 5, 301, 6, 271, 1, 10, 20],
	[99, 13, 314, 5, 276, 0, 10, 28],
	[100, 16, 330, 1, 277, 1, 11, 42],
	[101, 0, 330, 0, 277, 0, 11, 42],
	[102, 0, 330, 0, 277, 0, 11, 42],
	[103, 9, 339, 2, 279, 2, 13, 51],
	[104, 12, 351, 8, 287, 0, 13, 51],
	[105, 8, 359, 8, 295, 0, 13, 51],
	[106, 15, 374, 6, 301, 1, 14, 59],
	[107, 7, 381, 1, 302, 0, 14, 66],
	[108, 0, 381, 11, 313, 0, 14, 55],
	[109, 8, 389, 9, 322, 1, 15, 53],
	[110, 14, 403, 3, 325, 0, 15, 64],
	[111, 11, 414, 6, 331, 1, 16, 68],
	[112, 10, 424, 12, 343, 0, 16, 66],
	[113, 20, 444, 8, 351, 0, 16, 78],
	[114, 11, 455, 7, 358, 0, 16, 83],
	[115, 0, 455, 0, 358, 0, 16, 83],
	[116, 19, 474, 8, 366, 0, 16, 94],
	[117, 19, 493, 7, 373, 0, 16, 106],
	[118, 28, 521, 9, 382, 1, 17, 125],
	[119, 34, 555, 19, 401, 0, 17, 140],
	[120, 68, 623, 11, 412, 1, 18, 198],
	[121, 19, 642, 12, 424, 0, 18, 203],
	[122, 32, 674, 12, 436, 0, 18, 223],
	[123, 129, 803, 9, 445, 0, 18, 343],
	[124, 33, 836, 0, 445, 0, 18, 376],
	[125, 110, 946, 30, 475, 0, 18, 456],
	[126, 51, 997, 16, 491, 0, 18, 491],
	[127, 19, 1016, 22, 513, 0, 18, 488],
	[128, 4, 1020, 24, 537, 0, 18, 468],
	[129, 12, 1032, 24, 561, 0, 18, 456],
	[130, 30, 1062, 28, 589, 1, 19, 457],
	[131, 52, 1108, 38, 618, 0, 19, 472],
	[132, 55, 1163, 60, 678, 0, 19, 467],
	[133, 37, 1201, 82, 760, 0, 19, 422],
	[134, 21, 1222, 25, 785, 4, 23, 414],
	[135, 12, 1234, 48, 833, 0, 23, 378],
	[136, 19, 1253, 20, 853, 1, 24, 376],
	[137, 29, 1282, 8, 861, 1, 25, 396],
	[138, 32, 1314, 30, 891, 2, 27, 396],
	[139, 21, 1335, 31, 922, 0, 27, 386],
	[140, 32, 1367, 14, 936, 0, 27, 404],
];
