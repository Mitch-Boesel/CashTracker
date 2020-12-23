import React from "react";
import axios from "axios";
import PieChart from "../Charts/PieChart";
import BreakdownChart from "../Charts/BreakdownChart";
import { Tabs, Tab, TabList, TabPanel } from "react-tabs";
import LineChart from "../Charts/LineChart";

class YearlyStatistics extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            YearlySpendingData: {},
            YearlyBreakdownData: [],
            YearlyMonthTotals: []
        }

        this.HTTPGetYearlySpending = this.HTTPGetYearlySpending.bind(this);
        this.SpendingToPieChartPoints = this.SpendingToPieChartPoints.bind(this);
        this.SpendingToLineChartPoints = this.SpendingToLineChartPoints.bind(this);
    }


    async HTTPGetYearlySpending() {
        const today = new Date();
        var dict = {};
        const url = "https://localhost:5001/api/ct/yearly/totals/" + today.getFullYear();

        await axios.get(url)
            .then((resp) => dict = resp.data.data)
            .catch(() => alert("GetYearlySpending() Failed:("));

        return dict;
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

    async HTTPGetYearlyMonthTotals() {
        const today = new Date();
        const url = "https://localhost:5001/api/ct/yearly/monthly/totals/" + today.getFullYear();
        var list = []
        await axios.get(url)
            .then((resp) => list = resp.data.data)
            .catch(() => alert("HTTPGetYearlyMonthTotals() failed :("));
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

    SpendingToLineChartPoints() {
        const dict = this.state.YearlyMonthTotals;
        var points = [];
        for (var i = 0; i < dict.length; i++) {
            points.push({ x: parseInt(dict[i]["Month"]), y: parseFloat(dict[i]["Total"]) })
        }

        return points;
    }

    async componentDidMount() {
        const spending_dict = await this.HTTPGetYearlySpending();
        const bdown_list = await this.HTTPGetYearlyBreakdown();
        const month_list = await this.HTTPGetYearlyMonthTotals();

        this.setState({
            YearlySpendingData: spending_dict,
            YearlyBreakdownData: bdown_list,
            YearlyMonthTotals: month_list
        });

        //this.setState(() => ({ YearlySpendingPoints: [{ y: 84, label: "hi" }, { y: 12, label: "bye" }, { y: 43.21, label: "woah" }] }));
    }

    render() {
        const points = this.SpendingToPieChartPoints();
        const breakdownData = this.state.YearlyBreakdownData;
        const linechartData = this.SpendingToLineChartPoints();
        const date = new Date();

        const tuquiose = { backgroundColor: "rgb(121, 241, 209)" };
        const lightOrange = { backgroundColor: "rgb(253, 197, 124)" };
        const mediumOrchid = { backgroundColor: "rgb(196, 145, 251)" };
        return (
            <Tabs>
                <TabList>
                    <Tab id="YSTab1" style={tuquiose}>
                        <div>Spending Chart</div>
                    </Tab>
                    <Tab id='YSTab2' style={lightOrange}>
                        <div>Breakdown Table</div>
                    </Tab>
                    <Tab id="YSTab3" style={mediumOrchid}>Month-By-Month Spending</Tab>
                </TabList>
                <TabPanel>
                    <PieChart data={points} title="This Years's Spending" />
                </TabPanel>
                <TabPanel>
                    <BreakdownChart data={breakdownData} month={date.getMonth() + 1} />
                </TabPanel>
                <TabPanel>
                    <LineChart data={linechartData} title="This Year's Spending By Month" />
                </TabPanel>
            </Tabs>
        );
    }
}

export default YearlyStatistics;