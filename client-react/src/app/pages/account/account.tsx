import { Button } from "evergreen-ui";
import React from "react";
import "./account.scss";

interface AccountProps {}

const Account: React.FC<AccountProps> = (props: AccountProps) => {
  return (
    <div className="container__account">
      <h1>Account</h1>
    </div>
  );
};

export default Account;
