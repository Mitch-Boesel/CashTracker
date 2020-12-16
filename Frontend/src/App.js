import React from "react";
import "./App.css";
import NewPurchase from "./NewPurchase";
import { Tabs, Tab, TabList, TabPanel } from "react-tabs";
import MonthlyStatistics from "./MontlhyStatistics";
import YearlyStatistics from "./YearlyStatistics";
import CompareMonths from "./CompareMonths";

function App() {
  return (
    <div className="App">
      <Tabs>
        <TabList>
          <Tab id="Tab1">
            <div>New Purchase</div>
          </Tab>
          <Tab id="Tab2">
            <div>Monthly Statistics</div>
          </Tab>
          <Tab id="Tab3">
            <div>Yearly Statistics</div>
          </Tab>
          <Tab id="Tab4">
            <div>Compare Months</div>
          </Tab>
        </TabList>

        <TabPanel>
          <NewPurchase />
        </TabPanel>
        <TabPanel>
          <MonthlyStatistics />
        </TabPanel>
        <TabPanel>
          <YearlyStatistics />
        </TabPanel>
        <TabPanel>
          <CompareMonths></CompareMonths>
        </TabPanel>
      </Tabs>
    </div>
  );
}

export default App;
