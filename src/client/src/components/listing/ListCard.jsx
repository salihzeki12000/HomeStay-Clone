import React, { Component } from 'react'
import { connect } from 'react-redux'
import './SearchBar.css'

export class ListCard extends Component {

        constructor(props){
            super(props)
        }

    render() {
        console.log(this.props.data)
        const {data} = this.props
        return (
            <>
            <div className="col-6 ">
              <div className="card">
                <div className="card-body ">
                <div className="row no-gutters">
                  <div class="col-md-4 bg">
                    <div className="ml-5 profile float-right bg" style={{backgroundPosition:"0 50%",backgroundSize: "cover",backgroundRepeat:"no-repeat", backgroundImage : ("https://www.homestay.com/assets/small-review-score-img-c68dbe08abd3620cb7ae9b367952c1caac5322eb67c4d65ecfcafd83fba88dda.svg")}}>
                    
                    <img className="img img-fluid " src="data:image/jpeg;base64,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" class="card-img img-fluid" alt="Image"/>
                    </div>
                    </div>
                    <div class="col-md-8">
                    <div class="card-body">
                        <h5 class="card-title">{data.user_name}</h5>
                        <div style={{display:"block",maxWidth:"100%"}}><img src="https://www.homestay.com/assets/small-review-score-img-c68dbe08abd3620cb7ae9b367952c1caac5322eb67c4d65ecfcafd83fba88dda.svg"></img></div>
                          <p class="card-text">{this.props.data.description}</p>
                          <h3 className="text-success"> ${this.props.data.price_per_night}</h3>
                        <p class="card-text"><small class="text-muted">Last updated 3 mins ago</small></p>
                    </div>
                    </div>
                </div>
              
                </div>
              </div>
            </div>
            
            </>
        )
    }
}

const mapStateToProps = (state) => ({
    
})

const mapDispatchToProps = {
    
}

export default connect(mapStateToProps, mapDispatchToProps)(ListCard)
