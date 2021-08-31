import React, { FunctionComponent } from "react";
import "./sidebar.scss";
import Logo from "../../../../assets/images/logo-white.png";
import { useHistory } from "react-router-dom";
import {
  IconButton,
  HomeIcon,
  LogOutIcon,
  NewLinkIcon,
  PathSearchIcon,
  Tooltip,
  BankAccountIcon,
} from "evergreen-ui";

interface SideBarProps {}

export const SideBar: FunctionComponent<SideBarProps> = () => {
  const history = useHistory();
  return (
    <div className="sidebar">
      <nav className="navbar" role="navigation" aria-label="sidebar">
        <div>
          <img width={50} height={50} src={Logo} alt="logo" />
          <div className="nav__icon">
            <Tooltip position="right" content="Home">
              <IconButton
                className="icon__button"
                appearance="minimal"
                color="white"
                height={50}
                icon={HomeIcon}
                onClick={() => history.push("/")}
              />
            </Tooltip>
            <Tooltip position="right" content="Find ride">
              <IconButton
                className="icon__button"
                appearance="minimal"
                height={50}
                icon={PathSearchIcon}
                onClick={() => history.push("/ride")}
              />
            </Tooltip>
            <Tooltip position="right" content="Offer ride">
              <IconButton
                className="icon__button"
                appearance="minimal"
                height={50}
                icon={NewLinkIcon}
                onClick={() => history.push("/offer")}
              />
            </Tooltip>
            <Tooltip position="right" content="Account">
              <IconButton
                className="icon__button"
                appearance="minimal"
                height={50}
                icon={BankAccountIcon}
                onClick={() => history.push("/account")}
              />
            </Tooltip>
          </div>
        </div>
        {/* <IconButton
          className="icon__button"
          appearance="minimal"
          height={50}
          icon={LogOutIcon}
        /> */}
      </nav>
    </div>
  );
};
