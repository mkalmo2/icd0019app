import React, { Component } from 'react';
import FpAnalyserDao, { CommonResults } from "./FpAnalyserDao.ts";

const dao = new FpAnalyserDao();

interface FpAnalyserState {
    commonResults?: CommonResults;
    selectedCategory?: string;
    categoryResults?: number;
    startDate?: string;
    endDate?: string;
    dateRangeResults?: number;
}

export default class FpAnalyserInfoComp extends Component<{}, FpAnalyserState> {

    state: FpAnalyserState = {
        commonResults: {
            totalSales: 0,
            mostExpensive: '',
            categoryList: []
        },
        selectedCategory: '',
        categoryResults: 0,
        startDate: '',
        endDate: '',
        dateRangeResults: 0
    }

    async componentDidMount() {
        await this.loadCommonResults();
    }

    async loadCommonResults() {
        try {
            const commonResults = await dao.getCommonResults();
            const selectedCategory = commonResults.categoryList.length > 0 ? 
                commonResults.categoryList[0] : '';
            
            this.setState({ 
                commonResults,
                selectedCategory
            }, async () => {
                if (selectedCategory) {
                    await this.loadCategoryResults(selectedCategory);
                }
            });
        } catch (error) {
            console.error("Error loading common results:", error);
        }
    }

    async loadCategoryResults(category: string) {
        try {
            const categoryResults = await dao.getSalesByCategory(category);
            this.setState({ categoryResults, selectedCategory: category });
        } catch (error) {
            console.error("Error loading category results:", error);
        }
    }

    async loadDateRangeResults(start: string, end: string) {
        try {
            const dateRangeResults = await dao.getSalesBetweenDates(start, end);
            this.setState({ dateRangeResults, startDate: start, endDate: end });
        } catch (error) {
            console.error("Error loading date range results:", error);
        }
    }

    handleCategoryChange = (category: string) => {
        return this.loadCategoryResults(category);
    }

    handleStartDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const startDate = event.target.value;
        this.setState({ startDate }, () => {
            if (this.state.endDate) {
                this.loadDateRangeResults(startDate, this.state.endDate);
            }
        });
    }

    handleEndDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const endDate = event.target.value;
        this.setState({ endDate }, () => {
            if (this.state.startDate) {
                this.loadDateRangeResults(this.state.startDate, endDate);
            }
        });
    }

    render() {
        const { 
            commonResults, 
            selectedCategory, 
            categoryResults,
            startDate,
            endDate,
            dateRangeResults
        } = this.state;
        
        return (
            <>
                <div className="mb-4">
                    <h2>Sales Analysis</h2>
                    
                    <div className="row">
                        <div className="col-md-4">
                            <div className="card mb-3">
                                <div className="card-header">Total Sales</div>
                                <div className="card-body">
                                    <h3>${commonResults.totalSales.toFixed(2)}</h3>
                                </div>
                            </div>
                        </div>
                        
                        <div className="col-md-4">
                            <div className="card mb-3">
                                <div className="card-header">Most Expensive Products</div>
                                <div className="card-body">
                                    <h4>{commonResults.mostExpensive.split(", ")
                                        .map( e => <div>{e}</div> )}</h4>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mb-4">
                        <h3>Sales by Category</h3>
                        <div className="btn-group mb-3" role="group">
                            {commonResults.categoryList.map((category, index) => (
                                <button 
                                    key={index}
                                    type="button" 
                                    className={`btn ${selectedCategory === category ? 'btn-primary' : 'btn-outline-primary'}`}
                                    onClick={() => this.handleCategoryChange(category)}>
                                    {category}
                                </button>
                            ))}
                        </div>

                        {selectedCategory && (
                            <div className="card mb-3">
                                <div className="card-header">Sales for {selectedCategory}</div>
                                <div className="card-body">
                                    <h3>${categoryResults.toFixed(2)}</h3>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="mb-4">
                        <h3>Sales by Date Range</h3>
                        <div className="row mb-3">
                            <div className="col-md-3">
                                <label className="form-label">Start Date</label>
                                <input 
                                    type="date" 
                                    className="form-control"
                                    value={startDate}
                                    onChange={this.handleStartDateChange}
                                />
                            </div>
                            <div className="col-md-3">
                                <label className="form-label">End Date</label>
                                <input 
                                    type="date" 
                                    className="form-control"
                                    value={endDate}
                                    onChange={this.handleEndDateChange}
                                />
                            </div>
                        </div>

                        {startDate && endDate && (
                            <div className="card mb-3">
                                <div className="card-header">Sales between {startDate} and {endDate}</div>
                                <div className="card-body">
                                    <h3>${dateRangeResults.toFixed(2)}</h3>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </>
        );
    }
}