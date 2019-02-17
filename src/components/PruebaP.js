import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { Button, Form, Icon, Modal, Segment, Dimmer, Loader } from 'semantic-ui-react';
import history from '../history';

class pruebaP extends React.Component {


    show = dimmer => () => this.setState({ dimmer, open: true })
    close = () => this.setState({ open: false })
    cancelar = () => {
        this.close();
        this.props.signOut();
        this.props.nuevoUsuarios(false);
        history.push('/login');
    }


    renderError({ error, touched }) {
        if (touched && error) {
            return (
                <div className="ui error message">
                    <div className="header">
                        {error}
                    </div>
                </div>
            );
        }
    }


    renderInput = ({ input, label, meta }) => {
        const className = `field ${meta.error && meta.touched ? 'error' : ''}`;

        // console.log(input);
        return (
            <div className={className}>
                <label>{label}</label>
                <input
                    {...input}
                    autoComplete="off" />
                {this.renderError(meta)}
            </div>

        );
    };
    onSubmit = (formValues) => {
        this.props.onSubmit(formValues);
    }
    render() {
        return (


            <div>

                <Modal size='tiny' open='true' onClose={this.close}>
                    <Modal.Header>Bienvenido a hupity</Modal.Header>
                    <Modal.Content image>
                        <Modal.Description>
                            <form onSubmit={this.props.handleSubmit(this.onSubmit)} className="ui form error" >
                                <Field name="title" component={this.renderInput} label="Enter Title" />
                                <Field name="description" component={this.renderInput} label="Enter Description" />
                                <button className="ui button primary">Submit</button>
                            </form>

                        </Modal.Description>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button color='black' onClick={this.cancelar}>
                            Cancelar
</Button>


                    </Modal.Actions>
                </Modal>
            </div>


        );

    }
}

const validate = (formValues) => {
    const errors = {};
    if (!formValues.title) {
        errors.title = 'You must enter a title';
    }
    if (!formValues.description) {
        errors.description = 'You must enter a description';
    }
    return errors;
};

const mapStateToProps = (state) => {
    return {
        //   usuarioDetail: state.chatReducer.usuarioDetail,
        usuarioDetail: state.chatReducer.usuarioDetail,
        isSignedIn: state.auth.isSignedIn,
        nuevoUsuario: state.chatReducer.nuevoUsuario,
    };
};

export default reduxForm({mapStateToProps,
    form: 'streamForm',
    validate
})(pruebaP);



