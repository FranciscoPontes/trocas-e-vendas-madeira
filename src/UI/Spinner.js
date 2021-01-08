import CircularProgress from '@material-ui/core/CircularProgress';
import './Spinner.scss';

const Spinner = props => <CircularProgress className={props.className + ' spinner-default'} />

export default Spinner;