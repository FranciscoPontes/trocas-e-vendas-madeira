import React from 'react';
import Snackbar from '@material-ui/core/Snackbar';

const SimpleSnackbar = props => {

  return (
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        open={props.open}
        autoHideDuration={3000}
        onClose={props.closeSnackbar}   
        message={props.message}
        className={props.className}
      />
  );
}

export default SimpleSnackbar;