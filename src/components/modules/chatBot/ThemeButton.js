
import React from 'react';
//import ChatHuper from './connecteApp';
import { setTheme, setColorTheme } from './actions';
import { connect } from 'react-redux';
//import { renderComponent } from 'recompose';


class ThemeButton extends React.Component{

    onColorClick = () => {
        this.props.setTheme(this.props.color);
        this.props.setColorTheme(this.props.color);
    };
    render() {
        return (
            <button
                className={"theme-button-ch " + this.props.color}
                onClick={this.onColorClick}
            ></button>
        );
    }
};
const mapStateToProps = (state) => {
    return { isColorTheme: state.chatReducer.isColorTheme };
};

export default connect( mapStateToProps, {setTheme, setColorTheme})(ThemeButton);

