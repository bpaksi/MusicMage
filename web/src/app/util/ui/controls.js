import TextField from "@material-ui/core/TextField";
import Select from "react-select";
import IconButton from "@material-ui/core/IconButton";

import { withCustomData } from "./withCustomData";
import { withTrackChanges } from "./trackChanges";

export const TextFieldWithChanges = withTrackChanges()(TextField);

export const IconButtonEx = withCustomData(e => e.target.value)(IconButton);

export const SelectEx = withCustomData()(Select);
export const SelectWithChanges = withTrackChanges()(SelectEx);
