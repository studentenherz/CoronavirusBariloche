google.charts.load('current', { packages: ['corechart'] });
google.charts.setOnLoadCallback(drawChart);

function drawChart() {
	var n = dataArray.length;

	// make accumulated sums
	for (var i = 1; i < dataArray.length; ++i) {
		if (dataArray[i][3] == null)
			dataArray[i][3] = dataArray[i - 1][3] + dataArray[i][2];
		if (dataArray[i][5] == null)
			dataArray[i][5] = dataArray[i - 1][5] + dataArray[i][4];

		// dataArray[i][5] = dataArray[i - 1][5] + dataArray[i][4];
		// dataArray[i][7] = dataArray[i - 1][7] + dataArray[i][6];
		// dataArray[i][8] = dataArray[i - 1][8] + dataArray[i][2] - dataArray[i][4] - dataArray[i][6];
	}

	// document.getElementById('day').innerHTML = dataArray[n - 1][0];
	document.getElementById('date').innerHTML = `${dataArray[n - 1][1].substring(
		0,
		5
	)}`;
	document.getElementById('total-cases').innerHTML = dataArray[n - 1][3];
	document.getElementById('active-cases').innerHTML = dataArray[n - 1][8];
	document.getElementById('recovered-cases').innerHTML = dataArray[n - 1][5];
	document.getElementById('death-cases').innerHTML = dataArray[n - 1][7];

	chartAccumDiv = document.getElementById('chartAccum');
	chartDayDiv = document.getElementById('chartDay');
	btnNewCases = document.getElementById('btn-new-cases');
	btnNewDeaths = document.getElementById('btn-new-deaths');
	btnNewRecovered = document.getElementById('btn-new-recovered');
	btnLog = document.getElementById('btn-log-scale');

	var dataAccum = new google.visualization.DataTable();
	dataAccum.addColumn('number', 'Día'); // 0
	dataAccum.addColumn('number', 'Casos Totales'); // 3
	dataAccum.addColumn('number', 'Recuperados'); // 5
	dataAccum.addColumn('number', 'Muertes'); // 7
	dataAccum.addColumn('number', 'Activos'); // 8
	dataAccum.addRows(getColumns(dataArray, [0, 3, 5, 7, 8]));
	var logScale = false;

	var dataDay = new google.visualization.DataTable();
	dataDay.addColumn('number', 'Día'); // 0
	dataDay.addColumn('number', 'Nuevos'); // 2
	dataDay.addColumn('number', 'Recuperados'); // 4
	dataDay.addColumn('number', 'Muertes'); // 6
	dataDay.addRows(getColumns(dataArray, [0, 2, 4, 6]));

	var viewAccum = new google.visualization.DataView(dataAccum);
	var viewDay = new google.visualization.DataView(dataDay);

	var nullFunc = (data, col) => {
		return null;
	};

	seriesAccum = [
		{
			visible: true,
			label: 'Casos Totales',
			type: 'number',
			color: '#3a79a6',
			activeColor: '#3a79a6',
			disabledColor: '#879aa8',
		},
		{
			visible: true,
			label: 'Recuperados',
			type: 'number',
			color: '#17960f',
			activeColor: '#17960f',
			disabledColor: '#8dc29b',
		},
		{
			visible: true,
			label: 'Muertes',
			type: 'number',
			color: '#000000',
			activeColor: '#000000',
			disabledColor: '#6e6e6e',
		},
		{
			visible: true,
			label: 'Activos',
			type: 'number',
			color: '#de1414',
			activeColor: '#de1414',
			disabledColor: '#c78181',
		},
	];

	seriesDay = [
		{
			visible: true,
			label: 'Nuevos',
			type: 'number',
			color: '#de1414',
			activeColor: '#de1414',
			disabledColor: '#c78181',
		},
		{
			visible: false,
			label: 'Recuperados',
			type: 'number',
			color: '#17960f',
			activeColor: '#17960f',
			disabledColor: '#8dc29b',
		},
		{
			visible: false,
			label: 'Muertes',
			type: 'number',
			color: '#000000',
			activeColor: '#000000',
			disabledColor: '#6e6e6e',
		},
	];

	var optionsAccum = {
		series: seriesAccum,
		fontName: 'Computer Modern',
		lineWidth: 1,
		pointSize: 3,
		legend: {
			position: 'top',
			alignment: 'center',
			maxLines: 2,
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
			title: 'Número de personas',
			titleTextStyle: {
				italic: false,
			},
		},
		hAxis: {
			viewWindow: {
				min: -1,
				max: dataArray[n - 1][0] + 1,
			},
			title: 'Día desde el inicio del brote en Bariloche (04/03/20)',
			titleTextStyle: {
				italic: false,
			},
		},
		// fontSize: 16,
	};

	var optionsDay = {
		// fontSize: 16,
		series: seriesDay,
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
		vAxis: {
			title: 'Número de personas',
			titleTextStyle: {
				italic: false,
			},
		},
		hAxis: {
			title: 'Día desde el inicio del brote en Bariloche (04/03/20)',
			titleTextStyle: {
				italic: false,
			},
		},
	};

	// var chart = new google.visualization.ScatterChart(chartDiv);
	var chartAccum = new google.visualization.ScatterChart(chartAccumDiv);
	var chartDay = new google.visualization.ColumnChart(chartDayDiv);

	// viewAccum.hideColumns([2, 3]);
	// viewDay.setColumns([0, 1]);

	chartAccum.draw(viewAccum, optionsAccum);
	chartDay.draw(viewDay, optionsDay);

	btnLog.onclick = evt => {
		if (optionsAccum.vAxis.scaleType == 'log') {
			optionsAccum.vAxis.scaleType = 'linear';
			evt.target.innerHTML = 'Ver escala logarítmica';
		} else {
			optionsAccum.vAxis.scaleType = 'log';
			evt.target.innerHTML = 'Ver escala lineal';
		}

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
			var col = sel[0].column - 1;
			seriesAccum[col].visible = !seriesAccum[col].visible;

			var visibleCols = [0];
			for (var i = 0; i < seriesAccum.length; i++) {
				if (seriesAccum[i].visible) {
					visibleCols.push(i + 1);
					optionsAccum.series[i].color = seriesAccum[i].activeColor;
				} else {
					optionsAccum.series[i].color = seriesAccum[i].disabledColor;
					visibleCols.push({
						calc: nullFunc,
						label: seriesAccum[i].label,
						type: seriesAccum[i].type,
					});
				}
			}

			console.log(optionsAccum);

			viewAccum.setColumns(visibleCols);
			chartAccum.draw(viewAccum, optionsAccum);
		}
	});

	var visibleCols = [0];
	for (var i = 0; i < seriesDay.length; i++) {
		if (seriesDay[i].visible) {
			visibleCols.push(i + 1);
			optionsDay.series[i].color = seriesDay[i].activeColor;
		} else {
			optionsDay.series[i].color = seriesDay[i].disabledColor;
			visibleCols.push({
				calc: nullFunc,
				label: seriesDay[i].label,
				type: seriesDay[i].type,
			});
		}
	}

	viewDay.setColumns(visibleCols);
	chartDay.draw(viewDay, optionsDay);

	/*
	Toggle visibility in daily data chart
	*/
	google.visualization.events.addListener(chartDay, 'select', function () {
		var sel = chartDay.getSelection();
		if (sel[0].row == undefined) {
			var col = sel[0].column - 1;
			if (!seriesDay[col].visible) {
				for (var i = 0; i < seriesDay.length; i++)
					seriesDay[i].visible = i == col ? true : false;

				var visibleCols = [0];
				for (var i = 0; i < seriesDay.length; i++) {
					if (seriesDay[i].visible) {
						visibleCols.push(i + 1);
						optionsDay.series[i].color = seriesDay[i].activeColor;
					} else {
						optionsDay.series[i].color = seriesDay[i].disabledColor;
						visibleCols.push({
							calc: nullFunc,
							label: seriesDay[i].label,
							type: seriesDay[i].type,
						});
					}
				}

				// console.log(visibleCols);

				viewDay.setColumns(visibleCols);
				chartDay.draw(viewDay, optionsDay);
			}
		}
	});

	function changeChartArea(mQuery) {
		if (mQuery.matches) {
			optionsAccum.chartArea.height = '65%';
			optionsDay.chartArea.height = '65%';
		} else {
			optionsAccum.chartArea.height = '80%';
			optionsDay.chartArea.height = '80%';
		}
		chartAccum.draw(viewAccum, optionsAccum);
		chartDay.draw(viewDay, optionsDay);
	}

	var mQuery = window.matchMedia('(max-width : 800px)');
	changeChartArea(mQuery);
	mQuery.addListener(changeChartArea);
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
	[0, '04 / 03 / 20', 0, 0, 0, 0, 0, 0, 0],
	[1, '04 / 03 / 20', 1, 1, 0, 0, 0, 0, 1],
	[2, '04 / 04 / 20', 3, 4, 0, 0, 0, 0, 4],
	[3, '04 / 05 / 20', 1, 5, 0, 0, 0, 0, 5],
	[4, '04 / 06 / 20', 1, 6, 0, 0, 0, 0, 6],
	[5, '04 / 07 / 20', 0, 6, 0, 0, 0, 0, 6],
	[6, '04 / 08 / 20', 4, 10, 0, 0, 0, 0, 10],
	[7, '04 / 09 / 20', 4, 14, 0, 0, 0, 0, 14],
	[8, '04 / 10 / 20', 10, 24, 0, 0, 0, 0, 24],
	[9, '04 / 11 / 20', 14, 38, 0, 0, 0, 0, 38],
	[10, '04 / 12 / 20', 0, 38, 0, 0, 0, 0, 38],
	[11, '04 / 13 / 20', 1, 39, 0, 0, 0, 0, 39],
	[12, '04 / 14 / 20', 10, 49, 0, 0, 0, 0, 49],
	[13, '04 / 15 / 20', 2, 51, 2, 2, 0, 0, 49],
	[14, '04 / 16 / 20', 3, 54, 2, 4, 0, 0, 50],
	[15, '04 / 17 / 20', 2, 56, 4, 8, 0, 0, 48],
	[16, '04 / 18 / 20', 2, 58, 0, 8, 0, 0, 50],
	[17, '04 / 19 / 20', 0, 58, 0, 8, 0, 0, 50],
	[18, '04 / 20 / 20', 4, 62, 0, 8, 0, 0, 54],
	[19, '04 / 21 / 20', 5, 67, 0, 8, 0, 0, 59],
	[20, '04 / 22 / 20', 1, 68, 1, 9, 0, 0, 59],
	[21, '04 / 23 / 20', 2, 70, 2, 11, 0, 0, 59],
	[22, '04 / 24 / 20', 0, 70, 2, 13, 0, 0, 57],
	[23, '04 / 25 / 20', 2, 72, 0, 13, 0, 0, 59],
	[24, '04 / 26 / 20', 2, 74, 0, 13, 0, 0, 61],
	[25, '04 / 27 / 20', 0, 74, 1, 14, 0, 0, 60],
	[26, '04 / 28 / 20', 0, 74, 13, 27, 0, 0, 47],
	[27, '04 / 29 / 20', 3, 77, 4, 31, 0, 0, 46],
	[28, '04 / 30 / 20', 0, 77, 10, 41, 0, 0, 36],
	[29, '05 / 01 / 20', 0, 77, 3, 44, 0, 0, 33],
	[30, '05 / 02 / 20', 0, 77, 8, 52, 0, 0, 25],
	[31, '05 / 03 / 20', 0, 77, 0, 52, 0, 0, 25],
	[32, '05 / 04 / 20', 1, 78, 12, 64, 0, 0, 14],
	[33, '05 / 05 / 20', 0, 78, 9, 73, 0, 0, 5],
	[34, '05 / 06 / 20', 1, 79, 0, 73, 0, 0, 6],
	[35, '05 / 07 / 20', 2, 81, 1, 74, 0, 0, 7],
	[36, '05 / 08 / 20', 1, 82, 0, 74, 0, 0, 8],
	[37, '05 / 09 / 20', 1, 83, 1, 75, 0, 0, 8],
	[38, '05 / 10 / 20', 0, 83, 0, 75, 0, 0, 8],
	[39, '05 / 11 / 20', 11, 94, 0, 75, 0, 0, 19],
	[40, '05 / 12 / 20', 1, 95, 0, 75, 0, 0, 20],
	[41, '05 / 13 / 20', 3, 98, 0, 75, 0, 0, 23],
	[42, '05 / 14 / 20', 4, 102, 0, 75, 0, 0, 27],
	[43, '05 / 15 / 20', 17, 119, 1, 76, 0, 0, 43],
	[44, '05 / 16 / 20', 1, 120, 0, 76, 0, 0, 44],
	[45, '05 / 17 / 20', 0, 120, 0, 76, 0, 0, 44],
	[46, '05 / 18 / 20', 1, 121, 0, 76, 0, 0, 45],
	[47, '05 / 19 / 20', 5, 126, 6, 82, 0, 0, 44],
	[48, '05 / 20 / 20', 2, 128, 1, 83, 0, 0, 45],
	[49, '05 / 21 / 20', 1, 129, 0, 83, 0, 0, 46],
	[50, '05 / 22 / 20', 2, 131, 4, 87, 0, 0, 44],
	[51, '05 / 23 / 20', 1, 132, 6, 93, 0, 0, 39],
	[52, '05 / 24 / 20', 0, 132, 0, 93, 0, 0, 39],
	[53, '05 / 25 / 20', 0, 132, 2, 95, 0, 0, 37],
	[54, '05 / 26 / 20', 2, 134, 3, 98, 0, 0, 36],
	[55, '05 / 27 / 20', 2, 136, 3, 101, 0, 0, 35],
	[56, '05 / 28 / 20', 3, 139, 9, 110, 0, 0, 29],
	[57, '05 / 29 / 20', 2, 141, 0, 110, 0, 0, 31],
	[58, '05 / 30 / 20', 0, 141, 3, 113, 0, 0, 28],
	[59, '05 / 31 / 20', 0, 141, 0, 113, 0, 0, 28],
	[60, '06 / 01 / 20', 4, 145, 5, 118, 0, 0, 27],
	[61, '06 / 02 / 20', 1, 146, 4, 122, 0, 0, 24],
	[62, '06 / 03 / 20', 2, 148, 1, 123, 1, 1, 25],
	[63, '06 / 04 / 20', 4, 152, 1, 124, 0, 1, 27],
	[64, '06 / 05 / 20', 1, 153, 1, 125, 0, 1, 27],
	[65, '06 / 06 / 20', 3, 156, 13, 138, 0, 1, 17],
	[66, '06 / 07 / 20', 2, 158, 0, 138, 0, 1, 19],
	[67, '06 / 08 / 20', 4, 162, 0, 138, 0, 1, 23],
	[68, '06 / 09 / 20', 0, 162, 0, 138, 0, 1, 23],
	[69, '06 / 10 / 20', 1, 163, 0, 138, 0, 1, 24],
	[70, '06 / 11 / 20', 6, 169, 1, 139, 0, 1, 29],
	[71, '06 / 12 / 20', 5, 174, 0, 139, 0, 1, 34],
	[72, '06 / 13 / 20', 5, 179, 0, 139, 0, 1, 39],
	[73, '06 / 14 / 20', 0, 179, 4, 143, 0, 1, 35],
	[74, '06 / 15 / 20', 2, 181, 0, 143, 0, 1, 37],
	[75, '06 / 16 / 20', 5, 186, 0, 143, 0, 1, 42],
	[76, '06 / 17 / 20', 3, 189, 3, 146, 1, 2, 41],
	[77, '06 / 18 / 20', 11, 200, 3, 149, 2, 4, 47],
	[78, '06 / 19 / 20', 6, 206, 1, 150, 1, 5, 51],
	[79, '06 / 20 / 20', 7, 213, 2, 152, 0, 5, 56],
	[80, '06 / 21 / 20', 7, 220, 6, 158, 0, 5, 57],
	[81, '06 / 22 / 20', 0, 220, 2, 160, 0, 5, 55],
	[82, '06 / 23 / 20', 3, 223, 2, 162, 2, 7, 54],
	[83, '06 / 24 / 20', 15, 238, 1, 163, 1, 8, 67],
	[84, '06 / 25 / 20', 19, 257, 8, 171, 0, 8, 78],
	[85, '06 / 26 / 20', 5, 262, 16, 187, 0, 8, 67],
	[86, '06 / 27 / 20', 3, 265, 4, 191, 0, 8, 66],
	[87, '06 / 28 / 20', 0, 265, 0, 191, 0, 8, 66],
	[88, '06 / 29 / 20', 2, 267, 13, 204, 0, 8, 55],
	[89, '06 / 30 / 20', 2, 269, 3, 207, 0, 8, 54],
	[90, '07 / 01 / 20', 6, 275, 6, 213, 0, 8, 54],
	[91, '07 / 02 / 20', 6, 281, 9, 222, 0, 8, 51],
	[92, '07 / 03 / 20', 4, 285, 12, 234, 0, 8, 43],
	[93, '07 / 04 / 20', 4, 289, 6, 240, 0, 8, 41],
	[94, '07 / 05 / 20', 0, 289, 0, 240, 0, 8, 41],
	[95, '07 / 06 / 20', 1, 290, 12, 252, 0, 8, 30],
	[96, '07 / 07 / 20', 5, 295, 7, 259, 1, 9, 27],
	[97, '07 / 08 / 20', 1, 296, 6, 265, 0, 9, 22],
	[98, '07 / 09 / 20', 5, 301, 6, 271, 1, 10, 20],
	[99, '07 / 10 / 20', 13, 314, 5, 276, 0, 10, 28],
	[100, '07 / 11 / 20', 16, 330, 1, 277, 1, 11, 42],
	[101, '07 / 12 / 20', 0, 330, 0, 277, 0, 11, 42],
	[102, '07 / 13 / 20', 0, 330, 0, 277, 0, 11, 42],
	[103, '07 / 14 / 20', 9, 339, 2, 279, 2, 13, 51],
	[104, '07 / 15 / 20', 12, 351, 8, 287, 0, 13, 51],
	[105, '07 / 16 / 20', 8, 359, 8, 295, 0, 13, 51],
	[106, '07 / 17 / 20', 15, 374, 6, 301, 1, 14, 59],
	[107, '07 / 18 / 20', 7, 375, 1, 295, 0, 14, 66],
	[108, '07 / 19 / 20', 0, 375, 11, 306, 0, 14, 55],
	[109, '07 / 20 / 20', 8, 383, 9, 315, 1, 15, 53],
	[110, '07 / 21 / 20', 14, 397, 3, 318, 0, 15, 64],
	[111, '07 / 22 / 20', 11, 408, 6, 324, 1, 16, 68],
	[112, '07 / 23 / 20', 10, 418, 12, 336, 0, 16, 66],
	[113, '07 / 24 / 20', 20, 438, 8, 344, 0, 16, 78],
	[114, '07 / 25 / 20', 11, 449, 7, 351, 0, 16, 83],
	[115, '07 / 26 / 20', 0, 449, 0, 351, 0, 16, 83],
	[116, '07 / 27 / 20', 19, 468, 8, 359, 0, 16, 94],
	[117, '07 / 28 / 20', 19, 487, 7, 366, 0, 16, 106],
	[118, '07 / 29 / 20', 28, 515, 9, 375, 1, 17, 125],
	[119, '07 / 30 / 20', 34, 549, 19, 393, 0, 17, 140],
	[120, '07 / 31 / 20', 68, 618, 11, 404, 1, 18, 198],
	[121, '08 / 01 / 20', 19, 637, 12, 416, 0, 18, 203],
	[122, '08 / 02 / 20', 32, 669, 12, 428, 0, 18, 223],
	[123, '08 / 03 / 20', 129, 798, 9, 437, 0, 18, 343],
	[124, '08 / 04 / 20', 33, 831, 0, 436, 0, 18, 376],
	[125, '08 / 05 / 20', 110, 946, 30, 466, 0, 18, 456],
	[126, '08 / 06 / 20', 51, 991, 16, 482, 0, 18, 491],
	[127, '08 / 07 / 20', 19, 1010, 22, 504, 0, 18, 488],
	[128, '08 / 08 / 20', 4, 1014, 24, 528, 0, 18, 468],
	[129, '08 / 09 / 20', 12, 1026, 24, 552, 0, 18, 456],
	[130, '08 / 10 / 20', 30, 1056, 28, 580, 1, 19, 457],
	[131, '08 / 11 / 20', 52, 1108, 38, 618, 0, 19, 472],
	[132, '08 / 12 / 20', 55, 1163, 60, 678, 0, 19, 467],
	[133, '08 / 13 / 20', 37, 1201, 82, 760, 0, 19, 422],
	[134, '08 / 14 / 20', 21, 1222, 25, 785, 4, 23, 414],
	[135, '08 / 15 / 20', 12, 1234, 48, 833, 0, 23, 378],
	[136, '08 / 16 / 20', 19, 1253, 20, 853, 1, 24, 376],
	[137, '08 / 17 / 20', 29, 1282, 8, 861, 1, 25, 396],
	[138, '08 / 18 / 20', 32, 1314, 30, 891, 2, 27, 396],
	[139, '08 / 19 / 20', 21, 1335, 31, 922, 0, 27, 386],
	[140, '08/20/20', 32, 1367, 14, 936, 0, 27, 404],
	[141, '08/21/20', 15, 1382, 11, 947, 0, 27, 408],
	[142, '08/22/20', 15, 1397, 21, 968, 0, 27, 402],
	[143, '08/23/20', 0, 1397, 12, 980, 0, 27, 390],
	[144, '08/24/20', 18, 1415, 24, 1004, 0, 27, 384],
	[145, '08/25/20', 26, 1441, 32, 1036, 0, 27, 378],
	[146, '08/26/20', 26, 1467, 31, 1067, 0, 27, 373],
	[147, '08/27/20', 34, 1501, 23, 1090, 1, 28, 385],
	[148, '08/28/20', 3, 1504, 47, 1137, 0, 28, 277],
	[149, '08/29/20', 23, 1527, 62, 1200, 0, 28, 290],
	[150, '08/30/20', 3, null, 10, 1210, 0, 28, 283],
	[151, '08/31/20', 37, null, 26, 1335, 1, 29, 237],
	[152, '09/01/20', 28, null, 21, 1358, 0, 29, 223],
	[153, '09/02/20', 32, null, 24, 1326, 1, 30, 225],
	[154, '09/03/20', 27, 1601, 25, 1351, 0, 32, 227],
	[155, '09/04/20', 46, 1656, 24, 1375, 0, 32, 249],
	[156, '09/05/20', 31, null, 14, 1389, 0, 32, 266],
	[157, '09/06/20', 5, null, 21, 1410, 0, 32, 250],
	[158, '09/07/20', 37, null, 27, 1437, 0, 32, 260],
	[159, '09/08/20', 87, null, 24, 1461, 1, 33, 322],
	[160, '09/09/20', 82, null, 20, 1481, 0, 33, 384],
	[161, '09/10/20', 42, 1940, 45, 1526, 0, 33, 381],
	[162, '09/11/20', 58, null, 20, 1546, 3, 36, 416],
	[163, '09/12/20', 51, 2049, 26, 1572, 0, 36, 441],
	[164, '09/13/20', 38, null, 0, 1572, 0, 36, 479],
	[165, '09/14/20', 52, null, 48, 1620, 0, 36, 483],
	[166, '09/15/20', 145, null, 26, 1646, 4, 40, 598],
	[167, '09/16/20', 55, null, 27, 1673, 3, 43, 623],
	[168, '09/17/20', 62, 2401, 58, 1731, 0, 43, 627],
	[169, '09/18/20', 61, 2462, 39, null, 4, 47, 645],
	[170, '09/19/20', 50, null, 34, 1804, 0, 47, 661],
	[171, '09/20/20', 13, null, 4, 1808, 0, 47, 670],
	[172, '09/21/20', 19, null, 135, 1943, 2, 49, 552],
	[173, '09/22/20', 56, null, 60, 2003, 1, 50, 547],
	[174, '09/23/20', 46, null, 66, 2069, 2, 52, 525],
	[175, '09/24/20', 50, 2696, 45, 2114, 1, 53, 529],
	[176, '09/25/20', 43, 2739, 60, 2174, 0, 53, 512],
	[177, '09/26/20', 43, null, 39, 2217, 0, 53, 516],
	[178, '09/27/20', 2, null, 20, 2233, 1, 54, 497],
	[179, '09/28/20', 41, null, 45, 2278, 0, 54, 493],
	[180, '09/29/20', 56, null, 44, 2322, 0, 54, 505],
	[181, '09/30/20', 38, null, 79, 2401, 0, 54, 464],
	[182, '10/01/20', 31, 2950, 35, 2436, 1, 55, 459],
	[183, '10/02/20', 41, 2991, 54, 2490, 0, 55, 446],
	[184, '10/03/20', 30, null, 45, 2535, 0, 55, 431],
	[185, '10/04/20', 17, null, 33, 2568, 1, 56, 414],
	[186, '10/05/20', 23, null, 45, 2613, 0, 56, 392],
	[187, '10/06/20', 93, null, 61, 2674, 0, 56, 424],
	[188, '10/07/20', 53, null, 39, 2713, 0, 56, 438],
	[189, '10/08/20', 43, 3250, 38, 2751, 1, 57, 442],
	[190, '10/09/20', 48, 3298, 34, 2785, 0, 57, 456],
	[191, '10/10/20', 68, null, 17, 2802, 0, 57, 507],
	[192, '10/11/20', 10, null, 0, 2802, 0, 57, 517],
	[193, '10/12/20', 34, null, 47, 2849, 0, 57, 504],
	[194, '10/13/20', 91, null, 52, 2901, 0, 57, 543],
	[195, '10/14/20', 59, null, 57, 2958, 0, 57, 545],
	[196, '10/15/20', 57, 3630, 80, 3039, 0, 57, 534],
	[197, '10/16/20', 56, null, 47, 3086, 1, 58, 542],
	[198, '10/17/20', null, null, null, null, 0, 58, null],
	[199, '10/18/20', 59, null, 64, 3150, 0, 58, 537],
	[200, '10/19/20', 49, null, 47, 3197, 0, 58, 539],
	[201, '10/20/20', 71, null, 41, 3238, 0, 58, 569],
	[202, '10/21/2020', 75, 3940, 43, 3281, 0, 58, 601],
	[203, '10/22/2020', 80, 4020, 51, 3332, 1, 59, 629],
	[204, '10/23/20', 56, 4076, 63, 3395, 1, 60, 621],
	[205, '10/24/20', 51, null, 60, 3455, 3, 63, 609],
	[206, '10/25/20', 59, null, 64, 3519, 0, 63, 604],
	[207, '10/26/20', 60, null, 22, 3541, 3, 66, 639],
	[208, '10/27/20', 81, null, 76, 3617, 2, 68, 642],
	[209, '10/28/20', 39, null, 54, 3671, 1, 69, 626],
	[210, '10/29/20', 105, 4471, 41, 3712, 2, 71, 688],
	[211, '10/30/20', 50, 4521, 54, 3766, 0, 71, 684],
	[212, '10/31/20', 79, null, 94, 3860, 0, 71, 669],
	[213, '11/01/20', 22, null, 97, 3957, 0, 71, 594],
	[214, '11/02/20', 61, null, 50, 4007, 1, 72, 604],
	[215, '11/03/20', 92, null, 69, 4076, 0, 72, 627],
	[216, '11/04/20', 92, null, 49, 4125, 0, 72, 670],
	[217, '11/05/20', 75, 4942, 58, 4183, 0, 72, 687],
	[218, '11/06/20', 86, 5028, 86, 4269, 0, 72, 687],
	[219, '11/07/20', 11, null, 13, 4282, 0, 72, 685],
	[220, '11/08/20', 41, null, 0, 4282, 0, 72, 726]
];
