import React from "react";
import CanvasJSReact from "./canvasjs.react";

var CanvasJSChart = CanvasJSReact.CanvasJSChart;

class LineChart extends React.Component {
  toogleDataSeries = (e) => {
    if (typeof e.dataSeries.visible === "undefined" || e.dataSeries.visible) {
      e.dataSeries.visible = false;
    } else {
      e.dataSeries.visible = true;
    }
    e.chart.render();
  };

  render() {
    var tempDataPoints = [];
    var splits;
    var maxY = -50;
    var minY = 100;

    for (let i = 0; i < this.props.maxRoomNum; i++) {
      tempDataPoints[i] = [];
      // UTC -> Local Time
      for (var tempMsg of this.props.tempMsgs) {
        splits = tempMsg.topic.split("/");
        if (splits[1] === `room${i + 1}`) {
          tempDataPoints[i].push({
            x: new Date(tempMsg.date),
            y: parseFloat(tempMsg.value),
          });
          if (tempMsg.value > maxY) maxY = tempMsg.value;
          if (tempMsg.value < minY) minY = tempMsg.value;
        }
      }
    }

    maxY = Math.ceil(maxY) + 5;
    minY = Math.floor(minY) - 5;
    var dateStrs = this.props.dateStr.split("-");

    var dataPtrs = [];
    const colorTable = ["blue", "red", "green", "black", "orange"];
    for (let i = 0; i < this.props.maxRoomNum; i++) {
      dataPtrs.push({
        type: "line",
        showInLegend: true,
        name: `Room${i + 1}`,
        markerType: "square",
        xValueFormatString: "HH:mm",
        color: colorTable[i],
        //lineDashType: "dash",
        yValueFormatString: "#,##0",
        dataPoints: tempDataPoints[i],
      });
    }

    const options = {
      animationEnabled: true,
      theme: "light2", // "light1", "dark1", "dark2"
      title: {
        text: `Room Temperature (${dateStrs[1]}/${dateStrs[2]}/${dateStrs[0]})`,
      },
      axisY: {
        title: "Degree",
        suffix: " C",
        maximum: maxY,
        minimum: minY,
      },
      axisX: {
        valueFormatString: "HH:mm",
      },
      toolTip: {
        shared: true,
      },
      legend: {
        cursor: "pointer",
        verticalAlign: "bottom",
        horizontalAlign: "left",
        dockInsidePlotArea: true,
        itemclick: this.toogleDataSeries,
      },
      data: dataPtrs,
    };
    return (
      <div>
        <CanvasJSChart
          options={options}
          /* onRef={ref => this.chart = ref} */
        />
        {/*You can get reference to the chart instance as shown above using onRef. This allows you to access all chart properties and methods*/}
      </div>
    );
  }
}

export default LineChart;
