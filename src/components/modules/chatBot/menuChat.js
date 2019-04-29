import React from 'react';
import { setUbicacion } from './actions';
import { connect } from 'react-redux';


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

        let seguimientoUsuario = null;
        let styleUsers = null;
        if (this.props.userRol === '2') {
            seguimientoUsuario = <i className="eye icon" onClick={this.onEye} />;
        }
        else if (this.props.userRol === '3')
        {
            styleUsers = {left: '-50px', position: 'relative'};
        }
        return (
            <div className="menu-ch">

                <ul className="menu-items">
                    <li>
                        <i className="users icon" onClick={this.onUsers} style={{...styleUsers}} />
                    </li>
                    <li>
                        <i className="home icon" onClick={this.onHome}  />
                    </li>
                    <li>
                        {seguimientoUsuario}
                    </li>

                </ul>
            </div>
        );
    }
};

/*

 <li>
                        <button>
                            <i className="plus icon"
                                aria-hidden="true"
                            ></i>
                        </button>
                    </li>
<li>
<i className="sliders icon" onClick={this.onSlider} />
</li>
*/
const mapStateToProps = (state) => {
    return {
        isChatUbi: state.chatReducer.isChatUbi,
        userRol: state.chatReducer.userRol,
    };
};

export default connect(mapStateToProps, { setUbicacion })(Menu);

