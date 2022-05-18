import {
  BooleanInput,
  Edit,
  SaveButton,
  SimpleForm,
  Toolbar,
  required,
  translate,
} from "react-admin";

import Button from "@material-ui/core/Button";
import React from "react";
import PropTypes from "prop-types";

const TagEditToolbar = translate(({ onCancel, translate, ...props }) => (
  <Toolbar {...props}>
    <SaveButton />
    <Button onClick={onCancel}>{translate("ra.action.cancel")}</Button>
  </Toolbar>
));

const TagEdit = ({ onCancel, ...props }) => {
  console.log({ props });
  return (
    <Edit title=" " {...props}>
      <SimpleForm toolbar={<TagEditToolbar onCancel={onCancel} />}>
        <BooleanInput label="Live" source="is_live" validate={required()} />
      </SimpleForm>
    </Edit>
  );
};

TagEdit.propTypes = {
  onCancel: PropTypes.func,
};

export default TagEdit;
