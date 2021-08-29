import { FunctionComponent } from "react";
import "./sidebar.scss";
import Logo from "../../../../assets/images/logo-white.png";
import { useHistory } from "react-router-dom";
import { IconButton, HomeIcon, LogOutIcon, PanelTableIcon } from "evergreen-ui";

interface SideBarProps {}

export const SideBar: FunctionComponent<SideBarProps> = () => {
  const history = useHistory();
  return (
    <div className="sidebar">
      <nav className="navbar" role="navigation" aria-label="sidebar">
        <div>
          <img width={50} height={50} src={Logo} alt="logo" />
          <div className="nav__icon">
            <IconButton
              className="icon__button"
              appearance="minimal"
              color="white"
              height={50}
              icon={HomeIcon}
              onClick={() => history.push("/")}
            />
            <IconButton
              className="icon__button"
              appearance="minimal"
              height={50}
              icon={PanelTableIcon}
              onClick={() => history.push("/responses")}
            />
          </div>
        </div>
        <IconButton
          className="icon__button"
          appearance="minimal"
          height={50}
          icon={LogOutIcon}
        />
      </nav>
    </div>
  );
};
