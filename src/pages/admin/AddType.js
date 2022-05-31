import React from 'react';

export default class AddType extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            categories: [],
            landSports: 1,
            waterSports: 2,
            aeroSports: 3,
            selectedCategory: 1,
            newSubcategory: ''
        }

        this.fetchActivities = this.fetchActivities.bind(this)
        this.updateCategory = this.updateCategory.bind(this)
        this.updateNewSubcategory = this.updateNewSubcategory.bind(this)
        this.addSubcategory = this.addSubcategory.bind(this)
    }

    async componentDidMount() {
        await this.fetchActivities();
    }

    async fetchActivities() {
        await fetch("http://localhost:8080/categories/categoriesMap")
            .then(res => res.json())
            .then(res => this.setState({
                categories: res
            }))
            .catch(() => {
                console.warn("No categories found...")
            });
    }

    async updateCategory(event) {
        await this.setState({
            selectedCategory: event.target.value
        });
    }

    async updateNewSubcategory(event) {
        await this.setState({
            newSubcategory: event.target.value
        });
        console.log(this.state.newSubcategory)
    }

    checkExisting() {
        let check = undefined;
        if (this.state.newSubcategory === '') {
            alert("Please insert subcategory name!")
            check = "true";
        }
        this.state.categories.map(cat => {
            cat.subcategories.map(sub => {
                if (sub["subCatName"] === this.state.newSubcategory) {
                    alert("Subcategory: " + sub["subCatName"] + " already exists in category: " + cat["category"]["catName"]);
                    check = "true";
                }
            })
        })
        return check;
    }

    async addSubcategory() {
        const result = this.checkExisting();
        if (result === undefined) {
            fetch("http://localhost:8080/categories/addSubcategory/" + this.state.selectedCategory + "/" + this.state.newSubcategory)
                .catch(() => {
                    console.warn("Couldn't insert subcategory...")
                });
        }
    }

    render() {
        return (
            <div className="background">
                <div className="main">
                    <div style={{padding: '1rem', margin: '0 auto', maxWidth: 1000, height: '90%'}}>
                        <div className={"types"}>
                            <div className="input">
                                <label htmlFor="eventCategory">Land Sports</label>
                                <select className="category" placeholder="Choose category">
                                    {
                                        this.state.categories.map((obj, index) => {
                                            if (obj["category"]["catId"] === this.state.landSports) {
                                                return <optgroup id={obj["category"]["catId"]}
                                                                 label={obj["category"]["catName"]}>
                                                    {obj.subcategories.map((sub, index1) => {
                                                        return <option>{sub["subCatName"]}</option>
                                                    })}
                                                </optgroup>
                                            }
                                        })
                                    }
                                </select>
                            </div>
                            <div className="input">
                                <label htmlFor="eventCategory">Water Sports</label>
                                <select className="category" placeholder="Choose category">
                                    {
                                        this.state.categories.map((obj, index) => {
                                            if (obj["category"]["catId"] === this.state.waterSports) {
                                                return <optgroup id={obj["category"]["catId"]}
                                                                 label={obj["category"]["catName"]}>
                                                    {obj.subcategories.map((sub, index1) => {
                                                        return <option>{sub["subCatName"]}</option>
                                                    })}
                                                </optgroup>
                                            }
                                        })
                                    }
                                </select>
                            </div>
                            <div className="input">
                                <label htmlFor="eventCategory">Aero Sports</label>
                                <select className="category" placeholder="Choose category">
                                    {
                                        this.state.categories.map((obj, index) => {
                                            if (obj["category"]["catId"] === this.state.aeroSports) {
                                                return <optgroup id={obj["category"]["catId"]}
                                                                 label={obj["category"]["catName"]}>
                                                    {obj.subcategories.map((sub, index1) => {
                                                        return <option>{sub["subCatName"]}</option>
                                                    })}
                                                </optgroup>
                                            }
                                        })
                                    }
                                </select>
                            </div>
                        </div>
                        <div className="input">
                            <label htmlFor="eventCategory">Category Name<a className={"required"}>*</a></label>
                            <select className="category" placeholder="Choose category"
                                    onChange={this.updateCategory} required>
                                {
                                    this.state.categories.map((obj, index) => {
                                        return <option value={obj["category"]["catId"]} id={obj["category"]["catId"]}
                                                       label={obj["category"]["catName"]}>
                                        </option>
                                    })
                                }
                            </select>
                        </div>
                        <div className="input">
                            <label htmlFor="eventName">Subcategory Name<a className={"required"}>*</a></label>
                            <input type="text" name="name" id="name" placeholder="type..."
                                   onChange={this.updateNewSubcategory} required/>
                        </div>
                        <div className="input">
                            <input type="submit" name="name" id="name" value="Add Subcategory"
                                   onClick={this.addSubcategory}/>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}