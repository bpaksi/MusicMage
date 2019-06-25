import TextField from "@material-ui/core/TextField";
import Select from '@material-ui/core/Select';
import IconButton from "@material-ui/core/IconButton";

import { withCustomData } from "./withCustomData";
import { withTrackChanges } from "./trackChanges";

export const TextFieldEx = withCustomData(e => e.target.value)(TextField);
export const TextFieldWithChanges = withTrackChanges()(TextFieldEx);

export const IconButtonEx = withCustomData(e => e.target.value)(IconButton);

export const SelectEx = withCustomData(e => e.target.value)(Select);
export const SelectWithChanges = withTrackChanges()(SelectEx);
