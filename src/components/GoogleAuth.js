import React from 'react';
import { connect } from 'react-redux';
import { signIn, signOut, userRolIn, nombreUsuario, usuarioDetails } from '../actions';
import history from '../history';
import '../components/styles/ingresoHupity.css';
import firebase from 'firebase';




class GoogleAuth extends React.Component {
    state = { selectedFile: null, loaded: 0 }
    componentDidMount() {

        //Conectar a google  con el drive,
        window.gapi.load('client:auth2', () => {
            window.gapi.client.init({
                clientId: '114346141609-03hh8319khfkq8o3fc6m2o02vr4v14m3.apps.googleusercontent.com',
                //scope: 'email'
                apiKey: 'AIzaSyBc8xwjAd9W_52aa26QpuztTx3BXjHFKsM',
                discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"],
                scope: 'https://www.googleapis.com/auth/drive'
            }).then(() => {
                this.auth = window.gapi.auth2.getAuthInstance();

                this.onAuthChange(this.auth.isSignedIn.get());

                this.auth.isSignedIn.listen(this.onAuthChange);
                //   console.log(this.auth.currentUser.get().getId());
            });
        });




    }

    onAuthChange = isSignedIn => {
        if (this.auth.currentUser.get().w3)
            this.props.nombreUsuario(this.auth.currentUser.get().w3.ofa);
        //console.log(this.auth.currentUser.get().w3.ig);

        let x;

        if (isSignedIn) {

            //Encuentra el Rol,
            const nameRef = firebase.database().ref().child('Usuario').child(this.auth.currentUser.get().getId());
            nameRef.on('value', (snapshot) => {

                if (snapshot.val()) {
                    const Usuario = snapshot.val();
                
                    const nameRef3 = firebase.database().ref().child(`Usuario-WS/${Usuario.empresa}/${Usuario.equipo}/${this.auth.currentUser.get().getId()}`)
                    nameRef3.on('value', (snapshot3) => {
                      this.props.usuarioDetails({ usuario: Usuario, idUsuario: this.auth.currentUser.get().getId(), linkws: snapshot3.val().linkWs });
                    });


                    const nameRef2 = firebase.database().ref().child('Usuario-Rol').child(this.auth.currentUser.get().getId());
                    nameRef2.on('value', (snapshot2) => {

                        this.props.userRolIn(snapshot2.val().Rol);
                    });
                }
                else {
                    this.auth.signOut();
                }

            })


            this.props.signIn(this.auth.currentUser.get().getId());
        } else {
            this.props.signOut();
        }


        if (x)
            this.props.signOut();

    };







    onSignInClick = () => {
        this.auth.signIn();
    };
    onSignOutClick = () => {
        this.auth.signOut();
    };

    renderAuthButton() {
        //click entra o sale
        if (this.props.isSignedIn === null) {
            return null;
        } else if (this.props.isSignedIn) {
            history.push('/dashboard');
            return (
                <button onClick={this.onSignOutClick} className="ui red google button bar-top">
                    <i className="google icon" />
                    Sing Out
            </button>
            );
        } else {
            history.push('/login');
            return (
                <button onClick={this.onSignInClick} className="ui red google button">
                    <i className="google icon" />
                    Sing In with Google
          </button>

            );
        }
    }



    /*
        handleUpload = () => {
            //data
            const data = new FormData()
            data.append('file', this.state.selectedFile, this.state.selectedFile.name)
            console.log(this.state.selectedFile);
            console.log('lo hizo');
            // valorFs(this.state);
    
    
        }
    
        handleselectedFile = event => {
    
    
            /// carga el objeto
            /*  console.log(event.target.files[0]);
              this.setState({
                  selectedFile: event.target.files[0],
                  loaded: 0,
              })
      
              let reader = new FileReader();
              reader.readAsDataURL(event.target.files[0]);
      
              const file = event.target.files[0];
              reader.onload = (e) => {
                  console.warn("img Data", e.target.result);
      
                  var fileMetadata = {
                      'name': file.name,
                      'mimeType': 'application/vnd.google-apps.spreadsheet'
                  };
                  var media = {
                      mimeType: file.type,
                      file: e.target.result
                  };
                  window.gapi.client.drive.files.create({
                      resource: { name: file.name, },
                     media: {
                          mimeType: file.type,
                          body: e.target.result
                      }
      
                      //  stream: e.target.result
                      //   fields: 'id'
                  })
                      .then(function (response) {
                          // Handle the results here (response.result has the parsed body).
                          console.log("Response", response);
                      },
                          function (err) { console.error("Execute error", err); });
              }
      */

    //}

    /*
        onFilesChange = (files) => {
            console.log(files);
            //   console.log(rstream);
    
            /*  fs.readFile(files , (err, data) => {
                  res.end(data)
                  console.log(data);
                })
      */
    //  }//


    renderButt(the) {
        //  this.compare();




        /*
        
                var fileMetadata = {
                    name: 'Prueba',
                    //  'mimeType': 'application/vnd.google-apps.folder'
                };
                window.gapi.client.drive.files.create({
                    name: 'Invoices',
                    mimeType: 'application/vnd.google-apps.folder'
                    //fields: 'id'
                }).then(function (response) {
                    // Handle the results here (response.result has the parsed body).
                    console.log("Response", response);
                    console.log( response.result.id);
                },
                    function (err) { console.error("Execute error", err); });*/

        /*  const file = {
              uri: '../images/hupityNewlogo.png',             // e.g. 'file:///path/to/file/image123.jpg'
              name: the.state.selectedFile.name,            // e.g. 'image123.jpg',
              type: the.state.selectedFile.type             // e.g. 'image/jpg'
          }
  
        
        
          /*  const body = new FormData()
            body.append(the.state.selectedFile)
            console.log(body);*/

        /*
                var fileMetadata = {
                    name: the.state.selectedFile.name
                };
                var media = {
                    mimeType: the.state.selectedFile.type,
                    body
                };
                window.gapi.client.drive.files.create({
                    // resource: fileMetadata,
                    // media: media,
                    body
                    //fields: 'id'
                }).then(function (err, file) {
                    if (err) {
                        // Handle error
                        console.error(err);
                    } else {
                        console.log('File Id: ', file.id);
                    }
                });
        */


        /*     
      Eliminar
            window.gapi.client.drive.files.delete({
              'fileId': '1P1pv2WGdYZr1evxXCdsTUPX4oPLvh0dn'
            //  "supportsTeamDrives": false
            })
            .then(function(response) {
                    // Handle the results here (response.result has the parsed body).
                    console.log("Response", response);
                  },
                  function(err) { console.error("Execute error", err); });
      */



        //Lista
        /*   window.gapi.client.drive.files.list({
               // 'corpus': 'domain',
               'pageSize': 10,
               'fields': "nextPageToken, files(id, name, mimeType)"
           }).then(function (response) {
               console.log('Files:');
               var files = response.result.files;
               if (files && files.length > 0) {
                   for (var i = 0; i < files.length; i++) {
                       var file = files[i];
                       console.log(file);
                   }
               } else {
                   console.log('No files found.');
               }
           });
   
   */


    }


    render() {
        return <div>

            {this.renderAuthButton()}</div>
    }
};

const mapStateToProps = (state) => {
    return {
     //   usuarioDetail: state.chatReducer.usuarioDetail,
        isSignedIn: state.auth.isSignedIn
    };
};

export default connect(mapStateToProps, { signIn, signOut, userRolIn, nombreUsuario, usuarioDetails })(GoogleAuth);