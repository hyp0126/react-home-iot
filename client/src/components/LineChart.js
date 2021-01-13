import React from "react";
import CanvasJSReact from './canvasjs.react';

var CanvasJSChart = CanvasJSReact.CanvasJSChart;

class LineChart extends React.Component {
    
    toogleDataSeries = (e) => {
        if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
            e.dataSeries.visible = false;
        } else {
            e.dataSeries.visible = true;
        }
        e.chart.render();
    }

    render() {
        var tempDataPoints = [];
        tempDataPoints[0] = [];
        tempDataPoints[1] = [];
        var splits;

        for (var tempMsg of this.props.tempMsgs) {
            splits = tempMsg.topic.split('/');
            if (splits[1] === 'room1') {
                tempDataPoints[0].push({
                    x: new Date(tempMsg.date),
                    y: parseFloat(tempMsg.value)
                });
            } else if (splits[1] === 'room2') {
                tempDataPoints[1].push({
                    x: new Date(tempMsg.date),
                    y: parseFloat(tempMsg.value)
                });
            }
        }

        var dateStrs = this.props.dateStr.split('-');

		const options = {
			animationEnabled: true,
			theme: "light2", // "light1", "dark1", "dark2"
			title:{
				text: `Room Temperature (${dateStrs[1]}/${dateStrs[2]}/${dateStrs[0]})`
			},
			axisY: {
                title: "Degree",
                suffix: " C",
                minimum: 0
			},
			axisX: {
				valueFormatString: "HH:mm"
            },
            toolTip: {
                shared: true
            },
            legend: {
                cursor: "pointer",
                verticalAlign: "bottom",
                horizontalAlign: "left",
                dockInsidePlotArea: true,
                itemclick: this.toogleDataSeries
            },
            data: [{
                type: "line",
                showInLegend: true,
                name: "Room1",
                markerType: "square",
                xValueFormatString: "HH:mm",
                color: "#F08080",
                yValueFormatString: "#,##0",
                dataPoints: tempDataPoints[0]
            },
            {
                type: "line",
                showInLegend: true,
                name: "Room2",
                lineDashType: "dash",
                yValueFormatString: "#,##0",
                dataPoints: tempDataPoints[1]
            }]
		}
		return (
		<div>
			<CanvasJSChart options = {options}
				/* onRef={ref => this.chart = ref} */
			/>
			{/*You can get reference to the chart instance as shown above using onRef. This allows you to access all chart properties and methods*/}
		</div>
		);
	}
}

export default LineChart;