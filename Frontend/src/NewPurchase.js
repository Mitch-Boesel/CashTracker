import React from "react";
import axios from "axios";

class NewPurchase extends React.Component {
  constructor(props) {
    super(props);
    this.state = { business: "", purchase_date: "", price: "", category: "", category_list: [] };
    this.onSubmit = this.onSubmit.bind(this);
    //this.handleChange = this.handleChange.bind(this);
    this.handleBusinessChange = this.handleBusinessChange.bind(this);
    this.handleCategoryChange = this.handleCategoryChange.bind(this);
    this.handlePriceChange = this.handlePriceChange.bind(this);
    this.handlePurchDateChange = this.handlePurchDateChange.bind(this);
    this.buildPostDataJson = this.buildPostDataJson.bind(this);
    this.HttpGetCategories = this.HttpGetCategories.bind(this);
    this.DisplayCategories = this.DisplayCategories.bind(this);
  }

  async HttpGetCategories() {
    const url = "https://localhost:5001/api/ct/newpurchase/categories";
    var list = []
    await axios.get(url)
      .then((resp) => list = resp.data.data)
      .catch(() => alert("HttpGetCategories() Failed:("));

    return list;
  }

  DisplayCategories() {
    const c_list = this.state.category_list;
    return c_list.map((category) => {
      return <option>{category}</option>
    })
  }

  onSubmit = e => {
    e.preventDefault();
    const postUrl = "https://localhost:5001/api/ct/newpurchase/data";
    const bodyData = this.buildPostDataJson();
    const response = axios.post(postUrl, bodyData, {
      headers: { 'Content-Type': 'application/json' }//, 'Content-Length': JSON.stringify(bodyData).length }
    });
    alert(response.data);
    console.log(response.data);
  }

  buildPostDataJson() {
    const json = {
      "price": this.state.price.toString(),
      "purchasedate": this.state.purchase_date.toString(),
      "category": this.state.category.toString(),
      "business": this.state.business.toString()
    }
    return json;
  }

  handleBusinessChange(event) {
    this.setState({ business: event.target.value });
  }

  handlePurchDateChange(event) {
    this.setState({ purchase_date: event.target.value });
  }

  handlePriceChange(event) {
    this.setState({ price: event.target.value });
  }

  handleCategoryChange(event) {
    this.setState({ category: event.target.value });
  }


  async componentDidMount() {
    const c_list = await this.HttpGetCategories();
    debugger;
    this.setState({
      category_list: c_list
    });

    console.log(this.state.category_list);
  }

  render() {
    return (
      <div>
        <h1>Welcome to Cash Tracker!</h1>
        <form onSubmit={this.onSubmit}>
          <label>
            Business:{" "}
            <input
              type="text"
              value={this.state.business}
              onChange={this.handleBusinessChange}
            />
          </label>
          <label>
            Purchase Date:{" "}
            <input
              input="text"
              value={this.state.purchase_date}
              onChange={this.handlePurchDateChange}
            ></input>
          </label>
          <label>
            Price:{" "}
            <input
              input="text"
              value={this.state.price}
              onChange={this.handlePriceChange}
            ></input>
          </label>
          <label>
            Category:{" "}
            <select
              value={this.state.category}
              onChange={this.handleCategoryChange}>
              {this.DisplayCategories()}
            </select>
          </label>
          <input type="submit" value="Submit" />
        </form>
      </div >
    );
  }
}

export default NewPurchase;
