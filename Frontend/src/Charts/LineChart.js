import React from "react";
import CanvasJSReact from "../canvasjs.react"
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

class LineChart extends React.Component {
    constructor(props) {
        super(props);
        // FIgure out how to make the props into state
        this.state = {
            data: props.data,
            title: props.title
        };
    }

    render() {
        const options = {
            exportEnabled: true,
            animationEnabled: true,
            title: {
                text: this.props.title
            },
            axisY: {
                title: "Total Spent",
                prefix: "$"
            },
            axisX: {
                title: "Month",
                interval: 1
            },
            data: [{
                type: "line",
                startAngle: 75,
                indexLabelFontSize: 16,
                indexLabel: "{label} ${y}",
                dataPoints: this.props.data
            }]
        }
        return (
            <div>
                <CanvasJSChart options={options} />
            </div>
        );
    }
}

export default LineChart;