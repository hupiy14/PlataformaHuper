import React from 'react';
import { setUbicacion } from './actions';
import { connect } from 'react-redux';
import history from '../../../history';

class Menu extends React.Component {


    onSlider = () => {
        this.props.setUbicacion('settings');
    };
    onHome = () => {
        this.props.setUbicacion('chats');
    };
    onUsers = () => {
        this.props.setUbicacion('contacs');
    };
    onEye = () => {
        this.props.setUbicacion('profile');
    };

    render() {
        return (
            <div className="menu-ch">

                <ul className="menu-items">
                    <li>
                        <i className="users icon" onClick={this.onUsers} />
                    </li>
                    <li>
                        <i className="home icon" onClick={this.onHome} />

                    </li>
                    <li>
                        <button>
                            <i className="plus icon"
                                aria-hidden="true"
                            ></i>
                        </button>
                    </li>
                    <li>
                        <i className="eye icon" onClick={this.onEye} />
                    </li>
                    <li>
                        <i className="sliders icon" onClick={this.onSlider} />
                    </li>
                </ul>
            </div>
        );
    }
};

const mapStateToProps = (state) => {
    return { isChatUbi: state.chatReducer.isChatUbi };
};

export default connect(mapStateToProps, { setUbicacion })(Menu);

