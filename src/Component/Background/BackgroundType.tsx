import React, { Component } from "react";
import BackgroundSelection from './BackgroundSelection';
import Scene3 from './images/scene3.jpg';
import { string } from "prop-types";

class BackgroundType extends Component {
    state = {
        backgroundType: string
    };

    handleColorMenu = () => {    
        this.props.toggleOptionsMenu();
    }
    
    handleImageMenu = () => {
        this.props.toggleImageMenu(); 
    }
    props: any;

    

    render() : JSX.Element {
    
        return (
            <div className={this.props.changeBackground ? "background-menu-main background-menu-main-show" : "background-menu-main background-menu-main-hide"}>
            <BackgroundSelection 
                colorMenu={this.props.colorMenu} 
                imageMenu={this.props.imageMenu}
                backgroundType={this.state.backgroundType}
                handleBackgroundChange={this.props.handleBackgroundChange}
                />    
            <div className="background-types">
                    <div className="background-types--wrapper"><div onClick={this.handleColorMenu} className="background-menu background-menu--colors"></div><h3>Colors</h3></div>
                    <div className="background-types--wrapper"><div onClick={this.handleImageMenu} className="background-menu background-menu--images" style={{backgroundImage: `url(${Scene3})`}}></div><h3>Photos</h3></div>
                </div>
            </div>
        )
    }
}

export default BackgroundType;