
import React from 'react';
import ChatHuper from './connecteApp';
import { setTheme } from './actions';
import { connect } from 'react-redux';
import { renderComponent } from 'recompose';


class ThemeButton extends React.Component{
    render() {
        return (
            <button
                className={"theme-button-ch " + this.props.color}
                onClick={() => { this.props.setTheme(this.props.color) }}
            ></button>
        );
    }
};

export default connect( null, {setTheme})(ThemeButton);

