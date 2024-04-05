const formConstant = (langLabel: Record<string, string>): FormConstantType => ({
  name: {
    empty: langLabel.register_form_name_required,
  },
  email: {
    empty: langLabel.register_form_email_required,
    format: langLabel.register_form_email_incorrect,
  },
  username: {
    format: langLabel.register_form_username_incorrect,
    tooltip: langLabel.register_form_username_valid,
  },
  password: {
    format: langLabel.register_form_password_incorrect,
    tooltip: langLabel.register_form_password_valid,
  },
});

export default formConstant;

type FormRuleConstant = {
  tooltip?: string;
  empty?: string;
  format?: string;
  whitespace?: string;
};

type FormConstantType = {
  name?: FormRuleConstant;
  email?: FormRuleConstant;
  username?: FormRuleConstant;
  password?: FormRuleConstant;
};
