import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import './ConfirmDialog.scss';

const ConfirmDialog = props => {

  return (
    <div>
      <Dialog
        open={props.open}
        onClose={props.onClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        className="dialog-container"
        disableBackdropClick={props.disableBackdropClick}
        disableEscapeKeyDown={props.disableEscapeKeyDown}
      >
        <DialogTitle id="alert-dialog-title">{ props.title }</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            { props.description }
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          { !props.alert ?
            <React.Fragment>
              <Button onClick={ () => props.click( false ) } className="dialog-button-no">
                Não
              </Button>
              <Button onClick={ () => props.click( true ) } className="dialog-button-yes" autoFocus>
                Sim
              </Button>
            </React.Fragment>
            :
            <Button onClick={ props.click } className="dialog-button-ok" autoFocus>
              Ok
            </Button>
          }
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default ConfirmDialog;