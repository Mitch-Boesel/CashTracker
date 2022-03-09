import React from "react";
import axios from "axios";
import PieChart from "../Charts/PieChart";
import BreakdownChart from "../Charts/BreakdownChart";
import { Tabs, Tab, TabList, TabPanel } from "react-tabs";
import "./MonthlyStatistics.css";
import Data, { SpendingGroups } from "../configuration.json";

class MonthlyStatistics extends React.Component {
    constructor(props) {
        super(props);
        var d = new Date();

        this.state = {
            MonthlySpendingData: {},
            MonthlySpendingPoints: [],
            MonthlyBreakdownData: [],
            MonthlyPurchases: [],
            MonthlyGroupTotals: [],
            Month: d.getMonth() + 1,
            Year: d.getFullYear(),
            dctMonthToNum: {
                "January": 1, "February": 2, "March": 3, "April": 4, "May": 5, "June": 6,
                "July": 7, "August": 8, "September": 9, "October": 10, "November": 11, "December": 12
            },
            dctNumToMonth: {
                1: "January", 2: "February", 3: "March", 4: "April", 5: "May", 6: "June",
                7: "July", 8: "August", 9: "September", 10: "October", 11: "November", 12: "December"
            }
        }

        this.HTTPGetMonthlySpending = this.HTTPGetMonthlySpending.bind(this);
        this.SpendingToPieChartPoints = this.SpendingToPieChartPoints.bind(this);
        this.HttpGetMonthlyPurchases = this.HttpGetMonthlyPurchases.bind(this);
        this.onMonthChange = this.onMonthChange.bind(this);
        this.GetGroupTotals = this.GetGroupTotals.bind(this);
    }

    async GetGroupTotals() {
        const baseURL = this.props.BACKEND_URL + "api/ct/monthly/groups/defined/" + (this.state.Month) + "/" + this.state.Year + "/";
        var groupList = []

        var totalAllocated = 0.00;
        var totalSpent = 0.00;
        var groupString = "";
        for (const [key, value] of Object.entries(SpendingGroups)) {
            var categories = "";
            var spent = 0.00;
            var allocated = value.Allocated;
            var name = key;

            if (value.HTTP) {
                categories += "'";
                categories += value.Categories.join("','");
                categories += "'";
                groupString += categories + ","
                const URL = baseURL + categories;
                spent = await this.HTTPGetGroupTotals(URL);
            }
            else
                spent = allocated;

            totalSpent += spent;
            totalAllocated += allocated;
            const dct = { "Group": name, "Spent": spent.toFixed(2), "Allocated": allocated.toFixed(2), "Remaining": (allocated - spent).toFixed(2) }
            groupList.push(dct)
        }

        // Handle everything else
        const playUrl = this.props.BACKEND_URL + "api/ct/monthly/groups/undefined/" + (this.state.Month) + "/" + this.state.Year + "/" + groupString.substring(0, groupString.length - 1);
        var playSpent = await this.HTTPGetGroupTotals(playUrl);
        totalSpent += playSpent;
        const playAllocated = Data.MonthlyIncome - totalAllocated

        groupList.push({ "Group": "Play Money", "Spent": playSpent.toFixed(2), "Allocated": playAllocated.toFixed(2), "Remaining": (playAllocated - playSpent).toFixed(2) })
        groupList.push({ "Group": "Total", "Spent": totalSpent.toFixed(2), "Allocated": Data.MonthlyIncome.toFixed(2), "Remaining": (Data.MonthlyIncome - totalSpent).toFixed(2) })
        return groupList;
    }

    async HTTPGetGroupTotals(URL) {
        var moneySpent = ""
        await axios.get(URL)
            .then((resp) => moneySpent = parseFloat(resp.data))
            .catch(() => alert("GetGroupTotals() Failed:("));
        return moneySpent;
    }

    async HTTPGetMonthlySpending() {
        const url = this.props.BACKEND_URL + "api/ct/monthly/totals/all/" + (this.state.Month) + "/" + this.state.Year;

        await axios.get(url)
            .then((resp) => this.state.MonthlySpendingData = resp.data.data)
            .catch(() => alert("GetMontlySpending() Failed:("));
    }

    async HTTPGetMonthlyBreakdown() {
        const url = this.props.BACKEND_URL + "api/ct/monthly/breakdown/" + (this.state.Month) + "/" + this.state.Year;
        var list = [];
        await axios.get(url)
            .then((resp) => list = resp.data.data)
            .catch(() => alert("HTTPGetMontlyBreakdown() Failed:("));
        //await axios.get(url)
        //    .then((resp) => bdata = resp.data.data)
        //    .catch(() => alert("HTTPGetMontlyBreakdown() Failed:("));
        return list;
    }

    async HttpGetMonthlyPurchases() {
        const url = this.props.BACKEND_URL + "api/ct/monthly/purchases/" + (this.state.Month) + "/" + this.state.Year;
        var list = []
        await axios.get(url)
            .then((resp) => list = resp.data.data)
            .catch(() => alert("HttpGetMonthlyPurchases() Failed:("));
        return list
    }

    SpendingToPieChartPoints() {
        const dict = this.state.MonthlySpendingData;
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
        await this.HTTPGetMonthlySpending();
        const bdown_list = await this.HTTPGetMonthlyBreakdown();
        const purch_list = await this.HttpGetMonthlyPurchases();
        const group_list = await this.GetGroupTotals();

        this.setState({
            MonthlySpendingPoints: this.SpendingToPieChartPoints(),
            MonthlyBreakdownData: bdown_list,
            MonthlyPurchases: purch_list,
            MonthlyGroupTotals: group_list
        });

        //this.setState(() => ({ MonthlySpendingPoints: [{ y: 84, label: "hi" }, { y: 12, label: "bye" }, { y: 43.21, label: "woah" }] }));
        console.log(this.state.MonthlySpendingPoints);
        console.log(this.state.MonthlyBreakdownData);
    }

    async onMonthChange(e) {
        debugger;

        this.state.Month = this.state.dctMonthToNum[e.target.value];
        await this.HTTPGetMonthlySpending();
        const bdown_list = await this.HTTPGetMonthlyBreakdown();
        const purch_list = await this.HttpGetMonthlyPurchases();
        const group_list = await this.GetGroupTotals();


        this.setState({
            MonthlySpendingPoints: this.SpendingToPieChartPoints(),
            MonthlyBreakdownData: bdown_list,
            MonthlyPurchases: purch_list,
            MonthlyGroupTotals: group_list
        });

        //this.forceUpdate();

        //this.setState(() => ({ MonthlySpendingPoints: [{ y: 84, label: "hi" }, { y: 12, label: "bye" }, { y: 43.21, label: "woah" }] }));
    }

    render() {
        const points = this.state.MonthlySpendingPoints;
        const breakdownData = this.state.MonthlyBreakdownData;
        const purchases = this.state.MonthlyPurchases;
        const groups = this.state.MonthlyGroupTotals;

        const turquiose = { backgroundColor: "rgb(121, 241, 209)" };
        const lightOrange = { backgroundColor: "rgb(253, 197, 124)" };
        const mediumOrchid = { backgroundColor: "rgb(196, 145, 251)" };
        return (
            <div>
                <div>
                    <form onSubmit={this.onSubmit} className="compare-form">
                        <label className="month-select">
                            Month : {" "}
                            <select value={this.state.dctNumToMonth[this.state.Month]} onChange={this.onMonthChange}>
                                <option value="January">January</option>
                                <option value="February">February</option>
                                <option value="March">March</option>
                                <option value="April">April</option>
                                <option value="May">May</option>
                                <option value="June">June</option>
                                <option value="July">July</option>
                                <option value="August">August</option>
                                <option value="September">September</option>
                                <option value="October">October</option>
                                <option value="November">November</option>
                                <option value="December">December</option>
                            </select>
                        </label>
                    </form>
                </div>
                <Tabs>
                    <TabList>
                        <Tab id="MSTab1" style={turquiose}>
                            <div>Spending Chart</div>
                        </Tab>
                        <Tab id='MSTab2' style={lightOrange}>
                            <div>Breakdown Table</div>
                        </Tab>
                        <Tab id="MSTab3" style={mediumOrchid}>Purchase List</Tab>
                        <Tab id="MSTab4" style={turquiose}>How I'm Doing</Tab>
                    </TabList>
                    <TabPanel className="pie-chart">
                        <PieChart data={points} title="This Month's Spending" />
                    </TabPanel>
                    <TabPanel>
                        <BreakdownChart data={breakdownData} />
                    </TabPanel>
                    <TabPanel>
                        <BreakdownChart data={purchases} />
                    </TabPanel>
                    <TabPanel>
                        <BreakdownChart data={groups} />
                    </TabPanel>
                </Tabs>
            </div>
        );
    }
}

export default MonthlyStatistics;