import React from "react";
import axios from "axios";
import PieChart from "./PieChart";
import BreakdownChart from "./BreakdownChart";
import { Tabs, Tab, TabList, TabPanel } from "react-tabs";

class YearlyStatistics extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            YearlySpendingData: {},
            YearlySpendingPoints: [],
            YearlyBreakdownData: [],
        }

        this.HTTPGetYearlySpending = this.HTTPGetYearlySpending.bind(this);
        this.SpendingToPieChartPoints = this.SpendingToPieChartPoints.bind(this);
    }


    async HTTPGetYearlySpending() {
        const today = new Date();
        const url = "https://localhost:5001/api/ct/yearly/totals/" + today.getFullYear();

        await axios.get(url)
            .then((resp) => this.state.YearlySpendingData = resp.data.data)
            .catch(() => alert("GetYearlySpending() Failed:("));
    }

    // dont have this route wrtitten yet
    async HTTPGetYearlyBreakdown() {
        const today = new Date();
        const url = "https://localhost:5001/api/ct/Yearly/breakdown/" + today.getFullYear();
        var list = [];
        await axios.get(url)
            .then((resp) => list = resp.data.data)
            .catch(() => alert("HTTPGetMontlyBreakdown() Failed:("));
        //await axios.get(url)
        //    .then((resp) => bdata = resp.data.data)
        //    .catch(() => alert("HTTPGetMontlyBreakdown() Failed:("));
        return list;
    }

    SpendingToPieChartPoints() {
        const dict = this.state.YearlySpendingData;
        var points = [];
        for (var key in dict) {
            var point = { y: parseFloat(dict[key]), label: key }
            points.push(point);
            //if (key != "Zyns") {
            //    var point = { y: parseFloat(dict[key]), label: key }
            //    points.push(point);
            //}
            // { y: 49, label: "Organic Search" }
        }

        return points;
    }

    async componentDidMount() {
        await this.HTTPGetYearlySpending();
        const bdown_list = await this.HTTPGetYearlyBreakdown();

        this.setState({
            YearlySpendingPoints: this.SpendingToPieChartPoints(),
            YearlyBreakdownData: bdown_list,
        });

        //this.setState(() => ({ YearlySpendingPoints: [{ y: 84, label: "hi" }, { y: 12, label: "bye" }, { y: 43.21, label: "woah" }] }));
        console.log(this.state.YearlySpendingPoints);
        console.log(this.state.YearlyBreakdownData);
    }

    render() {
        const points = this.state.YearlySpendingPoints;
        const breakdownData = this.state.YearlyBreakdownData;
        const date = new Date();
        return (
            <Tabs>
                <TabList>
                    <Tab id="YSTab1">
                        <div>Spending Chart</div>
                    </Tab>
                    <Tab id='YSTab2'>
                        <div>Breakdown Table</div>
                    </Tab>
                    <Tab id="YSTab3">Month-By-Month Spending</Tab>
                </TabList>
                <TabPanel>
                    <PieChart data={points} title="This Years's Spending" />
                </TabPanel>
                <TabPanel>
                    <BreakdownChart data={breakdownData} month={date.getMonth() + 1} />
                </TabPanel>
                <TabPanel>
                    <h2>Soon to have a line chart!</h2>
                </TabPanel>
            </Tabs>
        );
    }
}

export default YearlyStatistics;