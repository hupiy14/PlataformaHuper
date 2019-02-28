import React from 'react';
import { Button, Form, Icon, Modal, Segment, Dimmer, Loader, Message } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { nuevoUsuarios } from '../components/modules/chatBot/actions';
import { signOut, usuarioDetails } from '../actions';
import history from '../history';
import ingreso from './modules/ingreso';
import firebase from 'firebase';
import { Field, reduxForm } from 'redux-form';

//ingresa el usuario nuevo 
class FormIngresoHuper extends React.Component {

    //se crea las variables a utilizar
    state = {
        open: false, listaEmpresas: {}, formError: false, momento: 0, open2: false, open3: false, open4: false, mensajeCodigo: null,
        tipo: null, empresa: null, nombreUsuario: null, cargo: null, listaEquipos: {}, area: null, equipo: null, codigo: null, acepto: null,
        errorTipo: null, errorNombreUsuario: null, errorCargo: null, errorArea: null, errorEmpresa: null, errorEquipo: null, errorCodigo: null, errorAcepto: null,
        codigoUsSlack: null, tokenUsSlack: null, tokenBotUsSlack: null, canalGestorSlack: null, canalEquipoSlack: null, canalReportesSlack: null, canalNotifiacionesSlack: null,
        codigoWSdrive: null,
    }



    componentDidMount() {

        //se consulta todas las empresas
        const starCountRef = firebase.database().ref().child('empresa');
        starCountRef.on('value', (snapshot) => {
            this.setState({ listaEmpresas: snapshot.val() })
        });
    }


    handleAddition = (e, { value }) => {
        //se agrega un nuevo equipo
        const equipoNuevo = { nombreTeam: value };
        this.setState({
            listaEquipos: { equipoNuevo, ...this.state.listaEquipos }
        })
    }
    //popup completo
    show = dimmer => () => this.setState({ dimmer, open: true })
    close = () => this.setState({ open: false })
    //Crar usuario
    ingreso = () => {


        let error = false;
        if (this.state.equipo.trim() === '') {
            this.setState({ errorEquipo: true });
            error = true;
        }
        else {
            this.setState({ errorEquipo: false });
        }
        if (this.state.codigo.trim() === '') {
            this.setState({ errorCodigo: true });
            error = true;
        }
        else {
            this.setState({ errorCodigo: false });
        }

        if (this.state.acepto === false) {
            this.setState({ errorAcepto: true });
            error = true;
        }
        else {
            this.setState({ errorAcepto: false });
        }


        this.setState({ formError: error });
        if (!error) {

            const starCountRef = firebase.database().ref().child(`Codigo-Acceso/${this.state.codigo}`);
            starCountRef.on('value', (snapshot) => {
                const cod = snapshot.val();
                if (cod) {
                    if (cod.estado !== 'activo') {
                        //codigo usado
                        this.setState({ errorCodigo: true });
                        this.setState({ formError: true });
                        this.setState({ mensajeCodigo: { titulo: 'Codigo incorrecto', detalle: 'El codigo ya ha sido utilizado' } });

                    }
                    else {
                        this.close();
                        //this.props.signOut();
                        // this.props.nuevoUsuarios(false);
                        this.renderCrearUsuario(cod);
                        history.push('/dashboard');
                    }

                }
                else {
                    //codigo que no existe
                    this.setState({ errorCodigo: true });
                    this.setState({ formError: true });
                    this.setState({ mensajeCodigo: { titulo: 'Codigo incorrecto', detalle: 'No se tiene ninguna concidencia con el codigo escrito' } });

                }
            });


        }


    }

    //primer form 
    continuar = (e) => {
        e.preventDefault();
        let error = false;
        if (!this.state.tipo) {
            this.setState({ errorTipo: true });
            error = true;
        }
        else {
            this.setState({ errorTipo: false });
        }
        this.setState({ formError: error });
        console.log(this.state.tipo);
        this.setState({ momento: 1 });
    }

    //segundo form
    continuar2 = () => {

        let error = false;
        if (this.state.nombreUsuario.trim() === '') {
            this.setState({ errorNombreUsuario: true });
            error = true;
        }
        else {
            this.setState({ errorNombreUsuario: false });
        }
        if (this.state.area.trim() === '') {
            this.setState({ errorArea: true });
            error = true;
        }
        else {
            this.setState({ errorArea: false });
        }

        if (this.state.cargo.trim() === '') {
            this.setState({ errorCargo: true });
            error = true;
        }
        else {
            this.setState({ errorCargo: false });
        }

        if (!this.state.empresa) {
            this.setState({ errorEmpresa: true });
            error = true;
        }
        else {
            this.setState({ errorEmpresa: false });
        }


        this.setState({ formError: error });
        if (!error)
            this.setState({ momento: 2 });

        console.log(this.state.empresa);
        if (this.state.empresa) {
            let keyEquipo;
            const Empresas = this.state.listaEmpresas;
            const sel = this.state.empresa;
            Object.keys(Empresas).map(function (key, index) {
                if (Empresas[key].industria === sel)
                    keyEquipo = key;
            });
            console.log(keyEquipo);
            const starCountRef = firebase.database().ref().child(`Empresa-Equipo/${keyEquipo}`);
            starCountRef.on('value', (snapshot) => {
                this.setState({ listaEquipos: snapshot.val() })
            });
        }

    }
    //cancelar todo el proceso
    cancelar = () => {
        this.close();
        this.props.signOut();
        this.props.nuevoUsuarios(false);
        history.push('/login');
    }

    renderCrearUsuario(cod) {

        let keyEquipo;
        const Empresas = this.state.listaEmpresas;
        const sel = this.state.empresa;
        Object.keys(Empresas).map(function (key, index) {
            if (Empresas[key].industria === sel)
                keyEquipo = key;
        });
        console.log(this.props.usuarioDetail);
        //Crea un nuevo equipo
        var newPostKey1 = firebase.database().ref().child('Empresa-Equipo').push().key;
        if (this.state.listaEquipos.equipoNuevo && this.state.listaEquipos.equipoNuevo.nombreTeam === this.state.equipo) {

            firebase.database().ref(`Empresa-Equipo/${keyEquipo}/${newPostKey1}`).set({
                cargo: this.state.cargo,
                fechaCreado: new Date().toString(),
                nombreTeam: this.state.equipo,
                responsable: this.state.nombreUsuario,
                idUsuario: this.props.usuarioDetail.usuarioNuevo.id,
                estado: 'activo',

            });
        }
        else {
            //Encuentra el identificador del equipo
            const Equipos = this.state.listaEquipos;
            const sel = this.state.equipo;
            Object.keys(Equipos).map(function (key, index) {
                if (Equipos[key].nombreTeam === sel)
                    newPostKey1 = key;
            });

        }

        //crea el espacio de trabajo
        if (this.state.codigoWSdrive) {
            firebase.database().ref(`Usuario-WS/${keyEquipo}/${newPostKey1}/${this.props.usuarioDetail.usuarioNuevo.id}`).set({
                fechaCreado: new Date().toString(),
                linkWs: this.state.codigoWSdrive,
            });
        }
        //crea el usuario slack
        if (this.state.codigoUsSlack) {
            firebase.database().ref(`Usuario-Slack/${this.props.usuarioDetail.usuarioNuevo.id}`).set({
                tokenP: this.state.tokenUsSlack,
                tokenB: this.state.tokenBotUsSlack,
                usuarioSlack: this.state.codigoUsSlack,
                usuario: this.state.nombreUsuario,
                gestor: this.state.canalGestorSlack,
                equipo: this.state.canalEquipoSlack,
                reporting: this.state.canalReportesSlack,
                notificaciones: this.state.canalNotifiacionesSlack,
                fechaCreado: new Date().toString(),
            });
        }



        //crear usuario perfil
        if (this.state.tipo === 'Huper') {
            firebase.database().ref(`Usuario-Perfil/1/${this.props.usuarioDetail.usuarioNuevo.id}`).set({
                estado: 'activo',
            });
            //crear usuario rol
            firebase.database().ref(`Usuario-Rol/${this.props.usuarioDetail.usuarioNuevo.id}`).set({
                Rol: '3',
            });
        }
        else if (this.state.tipo === 'Gestor') {
            firebase.database().ref(`Usuario-Perfil/3/${this.props.usuarioDetail.usuarioNuevo.id}`).set({
                estado: 'activo',
            });
            //crear usuario rol
            firebase.database().ref(`Usuario-Rol/${this.props.usuarioDetail.usuarioNuevo.id}`).set({
                Rol: '2',
            });
        }

        //crear empresa- usuario

        firebase.database().ref(`empresa-Usuario/${keyEquipo}/${this.props.usuarioDetail.usuarioNuevo.id}`).set({
            estado: 'activo',
        });


        //crea usuario
        firebase.database().ref(`Usuario/${this.props.usuarioDetail.usuarioNuevo.id}`).set({
            area: this.state.area,
            cargo: this.state.cargo,
            canalSlack: this.state.codigoUsSlack,
            email: this.props.usuarioDetail.usuarioNuevo.correo,
            empresa: keyEquipo,
            equipo: newPostKey1,
            usuario: this.state.nombreUsuario,
            wsCompartida: this.state.codigoWSdrive,
            fechaCreado: new Date().toString(),
            codigo: this.state.codigo,
            estado: 'activo',

        });

        // gener  la primera formacion 
        firebase.database().ref(`Usuario-Formcion/${this.props.usuarioDetail.usuarioNuevo.id}/-LYWrWd_8M174-vlIkwv`).set({
            fecha: new Date().toString(),
            concepto: "El método de la Caja de Eisenhower para impulsar tu productividad",
            detalle: "Aprende a diferencias tus actividades urgentes de las importantes",
            estado: 'activo',
            link: "mfN_JVLHlbQ",
        });

        cod.estado = 'En Uso';

        firebase.database().ref(`Codigo-Acceso/${this.state.codigo}`).set({
            ...cod,
            fechaUso: new Date().toString(),

        })

    }

    renderOpcionesEmpresa() {
        const listaX = this.state.listaEmpresas;
        let lista = {};

        const opciones = Object.keys(listaX).map(function (key, index) {
            lista = { ...lista, key: key, text: listaX[key].industria, value: listaX[key].industria };
            return lista;
        });
        return opciones;

    }
    renderFormulario() {
        let formM;
        if (this.state.momento === 0) {
            formM = this.renderFormularioTipo();
        }
        else if (this.state.momento === 1) {
            formM = this.renderFormularioPersona();
        }
        else if (this.state.momento === 2) {
            formM = this.renderFormularioPersona2();

        }
        return formM;
    }

    renderBt() {
        let formM;
        if (this.state.momento === 0) {
            formM = <Button

                color="purple"
                icon='arrow right'
                labelPosition='right'
                content="Comenzar"
                onClick={this.continuar}
                disabled={!this.state.tipo}
            />
        }
        else if (this.state.momento === 1) {
            if (this.state.tipo !== 'Observador')
                formM = <Button
                    color="purple"
                    icon='arrow right'
                    labelPosition='right'
                    content="Un paso Mas"
                    onClick={this.continuar2}
                    disabled={!this.state.nombreUsuario || !this.state.empresa || !this.state.cargo || !this.state.area}
                />
        }
        else if (this.state.momento === 2) {
            formM = <Button
                color="purple"
                icon='checkmark'
                labelPosition='right'
                content="Crear"
                onClick={this.ingreso}
                disabled={!this.state.codigo || !this.state.equipo || !this.state.acepto}
            />

        }
        return formM;
    }

    renderFormularioPersona() {
        //formulario de observar por construir
        if (this.state.tipo === 'Observador') {
            return (
                <Segment>
                    <Dimmer active inverted>
                        <Loader size='medium'> Lo estamos construyendo para ti</Loader>
                    </Dimmer>
                </Segment>
            );
        }

        return (
            <Form error={this.state.formError}>

                <Form.Input label='Nombre Usuario' placeholder='Cual es tu nombre?'
                    value={this.state.nombreUsuario}
                    onChange={e => this.setState({ nombreUsuario: e.target.value })}
                    error={this.state.errorNombreUsuario}
                />
                <Form.Select label='Empresa' options={this.renderOpcionesEmpresa()} placeholder='Cual es tu Empresa?'
                    search
                    onChange={(e, { value }) => this.setState({ empresa: value })}
                    value={this.state.empresa}
                    error={this.state.errorEmpresa}
                />
                <Form.Input label='Cargo' placeholder='Que cargo tienes?'
                    value={this.state.cargo}
                    onChange={e => this.setState({ cargo: e.target.value })}
                    error={this.state.errorCargo}
                />

                <Form.Input label='Area' placeholder='¿En qué departamento de la empresa laboras? '
                    value={this.state.area}
                    onChange={e => this.setState({ area: e.target.value })}
                    error={this.state.errorArea}
                />

                <Message
                    error
                    header='Falta campos por llenar'
                    content='Debes diligenciar todos los campos'
                />
            </Form>
        );
    }
    renderOpcionesEmpresaEquipo() {
        const listaX = this.state.listaEquipos;
        let lista = {};
        console.log(listaX);
        if (!this.state.listaEquipos) return;
        const opciones = Object.keys(listaX).map(function (key, index) {
            //  console.log(listaX[key]);
            lista = { ...lista, key: key, text: listaX[key].nombreTeam, value: listaX[key].nombreTeam };
            return lista;
            //return cconsulta[key].concepto;
        });
        console.log(opciones);
        return opciones;

    }


    show2 = size => () => this.setState({ size, open2: true })
    close2 = () => this.setState({ open2: false })

    show3 = size => () => this.setState({ size, open3: true })
    close3 = () => this.setState({ open3: false })

    show4 = size => () => this.setState({ size, open4: true })
    close4 = () => this.setState({ open4: false })

    renderFormularioPersona2() {
        const { open2, open3, open4 } = this.state

        let propiedad;
        let activado = false;
        if (this.state.tipo === 'Gestor') {
            propiedad = this.handleAddition;
            activado = true;
        }

        const equipo = <Form.Select label='Equipo de Trabajo' options={this.renderOpcionesEmpresaEquipo()} placeholder='Cual es tu equipo de trabajo en la empresa selecciona'
            search
            allowAdditions={activado}
            onAddItem={propiedad}
            value={this.state.equipo}
            onChange={(e, { value }) => this.setState({ equipo: value })}
            error={this.state.errorEquipo}

        />
        return (
            <Form error={this.state.formError}>
                {equipo}


                <Form.Input label='Codigo de acceso' fluid placeholder='Escribe el codigo de acceso dado por Hupity' error={this.state.errorCodigo}
                    value={this.state.codigo}
                    onChange={e => this.setState({ codigo: e.target.value })}
                />


                <h3>Para termiar sincroniza tus herramientas</h3>
                <Form.Group widths={3}>

                    <button className="ui button teal" onClick={this.show3('mini')} >Drive
                      <i className="google drive icon prueba-xx"> </i>
                    </button>
                    <button className="ui button purple " onClick={this.show2('mini')}>Slack
                      <i className="slack icon prueba-xx "> </i>
                    </button>
                    <button className="ui button yellow " onClick={this.show4('mini')} >Goolge Calendar
                      <i className="calendar alternate outline icon prueba-xx "> </i>
                    </button>

                </Form.Group>
                <Form.Checkbox label='Esta de acuedo con los terminos y condiciones'
                    error={this.state.errorAcepto}
                    value={this.state.acepto}
                    onChange={(e, { checked }) => this.setState({ acepto: checked })}
                />

                {this.renderModalSlack(open2)}
                {this.renderModalDrive(open3)}
                {this.renderModalCalendar(open4)}
                <Message
                    error
                    header={this.state.mensajeCodigo ? this.state.mensajeCodigo.titulo : 'Falta campos por llenar'}
                    content={this.state.mensajeCodigo ? this.state.mensajeCodigo.detalle : 'Debes diligenciar todos los campos'}
                />
            </Form>
        );
    }

    renderModalCalendar(open4) {
        return (
            <Modal size='mini' open={open4} onClose={this.close}>
                <Modal.Header>Sincroniza tu calendario</Modal.Header>
                <Modal.Content>
                    <Form >

                        <Segment>
                            <Dimmer active inverted>
                                <Loader size='medium'> Lo estamos construyendo para ti</Loader>
                            </Dimmer>
                        </Segment>

                    </Form>
                </Modal.Content>
                <Modal.Actions>
                    <Button color="yellow" icon='calendar alternate outline' labelPosition='right' content='Listo' onClick={() => { this.close4() }} />
                </Modal.Actions>
            </Modal>
        );
    }

    renderModalDrive(open3) {
        return (
            <Modal size='mini' open={open3} onClose={this.close}>
                <Modal.Header>Sincroniza tu carpeta de el Drive</Modal.Header>
                <Modal.Content>
                    <Form >

                        <Form.Input label='Codigo de tu espacio de trabajo (carpeta)' placeholder='1J45vud1Mkb6mxfWYrVjHki_AO21...'
                            value={this.state.codigoWSdrive}
                            onChange={e => this.setState({ codigoWSdrive: e.target.value })}
                        />

                    </Form>
                </Modal.Content>
                <Modal.Actions>
                    <Button color="yellow" icon='google drive' labelPosition='right' content='Listo' onClick={() => { this.close3() }} />
                </Modal.Actions>
            </Modal>
        );
    }

    renderModalSlack(open2) {
        let visible = false;
        if (this.state.tipo === 'Gestor') {

            visible = true;
        }
        return (
            <Modal size='mini' open={open2} onClose={this.close}>
                <Modal.Header>Sincroniza tu slack</Modal.Header>
                <Modal.Content>
                    <Form >

                        <Form.Input label='Codigo de Usuario Slack' placeholder='UEA8D0S...'
                            value={this.state.codigoUsSlack}
                            onChange={e => this.setState({ codigoUsSlack: e.target.value })}
                        />
                        <Form.Input label='Token Usuario Slack' placeholder='xoxp-482555533539-486285033681...'
                            value={this.state.tokenUsSlack}
                            onChange={e => this.setState({ tokenUsSlack: e.target.value })}
                        />
                        <Form.Input label='Token bot Usuario Slack' placeholder='xoxb-482555533539-532878166725...'
                            value={this.state.tokenBotUsSlack}
                            onChange={e => this.setState({ tokenBotUsSlack: e.target.value })}
                        />
                        <Form.Input label='Canal del Gestor' placeholder='CE61KKZ...'
                            value={this.state.canalGestorSlack}
                            onChange={e => this.setState({ canalGestorSlack: e.target.value })}
                            disabled={visible}

                        />

                        <h3>Añade otros canales que uses </h3>
                        <Form.Input label='Canal del Equipo' placeholder='CE61KKZ...'
                            value={this.state.canalEquipoSlack}
                            onChange={e => this.setState({ canalEquipoSlack: e.target.value })}
                        />
                        <Form.Input label='Canal del Reportes' placeholder='CE61KKZ...'
                            value={this.state.canalReportesSlack}
                            onChange={e => this.setState({ canalReportesSlack: e.target.value })}
                        />
                        <Form.Input label='Canal del Notificaciones' placeholder='CE61KKZ...'
                            value={this.state.canalNotifiacionesSlack}
                            onChange={e => this.setState({ canalNotifiacionesSlack: e.target.value })}
                        />

                    </Form>
                </Modal.Content>
                <Modal.Actions>
                    <Button color="yellow" icon='slack' labelPosition='right' content='Listo' onClick={() => { this.close2() }} />
                </Modal.Actions>
            </Modal>
        );
    }






    renderOpcionesTipo() {
        return [
            { key: 'H', text: 'Huper', value: 'Huper' },
            { key: 'G', text: 'Gestor', value: 'Gestor' },
            { key: 'O', text: 'Observador', value: 'Observador' },
        ];
    }


    renderFormularioTipo() {

        return (
            <Form error={this.state.formError}>

                <Form.Select label='Que rol tienes' options={this.renderOpcionesTipo()} placeholder='Selecciona un rol'
                    value={this.props.tipo}
                    onChange={(e, { value }) => this.setState({ tipo: value })}
                    error={this.state.errorTipo}
                />
                <Message

                    error
                    header='Error al seleccionar el rol del usuario'
                    content='Debes seleccionar un rol para continuar'
                />

            </Form>
        );
    }



    render() {
        const { open, dimmer } = this.state
        let abrir = true;
        //  console.log(this.props.nuevoUsuario);

        return (
            <div>

                <Modal size='tiny' open={abrir} onClose={this.close}>
                    <Modal.Header>Bienvenido a hupity</Modal.Header>
                    <Modal.Content image>
                        <Modal.Description>
                            {this.renderFormulario()}

                        </Modal.Description>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button color='grey' onClick={this.cancelar}>
                            Cancelar
              </Button>
                        {this.renderBt()}

                    </Modal.Actions>
                </Modal>
            </div>
        )
    }
}




const mapStateToProps = (state) => {
    return {
        //   usuarioDetail: state.chatReducer.usuarioDetail,
        usuarioDetail: state.chatReducer.usuarioDetail,
        isSignedIn: state.auth.isSignedIn,
        nuevoUsuario: state.chatReducer.nuevoUsuario,
    };
};
export default
    connect(mapStateToProps, { nuevoUsuarios, signOut, usuarioDetails })

        (FormIngresoHuper);