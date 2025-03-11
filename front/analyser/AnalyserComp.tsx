import React, { Component } from 'react';
import AnalyserDao from "./AnalyserDao.ts";
import AnalyserResult from "./AnalyserResult.ts";

const dao = new AnalyserDao();

interface AnalyserState {
    result: AnalyserResult;
    selectedRegion: string;
}

export default class AnalyserComp extends Component<{}, AnalyserState> {

    state: AnalyserState = {
        result: {
            totalSales: 0,
            top3PopularItems: [],
            largestTotalSalesAmountForSingleItem: 0
        },
        selectedRegion: "Estonia"
    }

    async componentDidMount() {
        await this.loadResults(this.state.selectedRegion);
    }

    async loadResults(region: string) {
        try {
            const result = await dao.getResults(region);
            this.setState({ result, selectedRegion: region });
        } catch (error) {
            console.error("Error loading analyser results:", error);
        }
    }

    handleRegionChange = (region: string) => {
        this.loadResults(region);
    }

    render() {
        const { result, selectedRegion } = this.state;
        
        return (
            <>
                <div className="mb-4">
                    <h2>Sales Analysis by Region</h2>
                    
                    <div className="btn-group mb-3" role="group">
                        <button 
                            type="button" 
                            className={`btn ${selectedRegion === 'Estonia' ? 'btn-primary' : 'btn-outline-primary'}`}
                            onClick={() => this.handleRegionChange('Estonia')}>
                            Estonia
                        </button>
                        <button 
                            type="button" 
                            className={`btn ${selectedRegion === 'Finland' ? 'btn-primary' : 'btn-outline-primary'}`}
                            onClick={() => this.handleRegionChange('Finland')}>
                            Finland
                        </button>
                        <button 
                            type="button" 
                            className={`btn ${selectedRegion === 'TaxFree' ? 'btn-primary' : 'btn-outline-primary'}`}
                            onClick={() => this.handleRegionChange('TaxFree')}>
                            Tax Free
                        </button>
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-4">
                        <div className="card mb-3">
                            <div className="card-header">Total Sales</div>
                            <div className="card-body">
                                <h3>${result.totalSales.toFixed(2)}</h3>
                            </div>
                        </div>
                    </div>
                    
                    <div className="col-md-4">
                        <div className="card mb-3">
                            <div className="card-header">Largest Sales for Single Item</div>
                            <div className="card-body">
                                <h3>${result.largestTotalSalesAmountForSingleItem.toFixed(2)}</h3>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card">
                    <div className="card-header">Top 3 Popular Items</div>
                    <div className="card-body">
                        <ul className="list-group">
                            {result.top3PopularItems.map((item, index) => (
                                <li key={index} className="list-group-item">
                                    {index + 1}. {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </>
        );
    }
}