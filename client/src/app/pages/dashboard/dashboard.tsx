import React from "react";
import { useShareRide } from "../../web3/provider";
import { SideBar } from "./components/sidebar";
import "./dashboard.scss";
import LoadingModal from "./loadingModal";

export const Dashboard: React.FC = ({ children }) => {
  const { tokenAccount, loadingText } = useShareRide();
  return (
    <div>
      <SideBar />
      <LoadingModal isShown={!!loadingText} loadingText={loadingText} />
      <div className="main">
        <div className="topBar">
          <div className="card">
            <div className="card__icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="20"
                viewBox="0 0 22 20"
              >
                <path
                  id="Graph"
                  d="M15.717,20a.723.723,0,0,1-.749-.694V11.687a.671.671,0,0,1,.22-.491L18.3,8.312a.791.791,0,0,1,.815-.151.7.7,0,0,1,.462.642v10.5a.722.722,0,0,1-.748.694ZM9.5,20a.722.722,0,0,1-.748-.694V8.8a.7.7,0,0,1,.462-.642.791.791,0,0,1,.815.151L13.136,11.2a.67.67,0,0,1,.219.491v7.619a.722.722,0,0,1-.748.694ZM3.279,20a.722.722,0,0,1-.748-.694V11.687A.67.67,0,0,1,2.75,11.2l3.11-2.884a.792.792,0,0,1,.815-.151.7.7,0,0,1,.462.642v10.5A.722.722,0,0,1,6.388,20ZM.22,9.293a.658.658,0,0,1,0-.981L7.414,1.638A.79.79,0,0,1,8.427,1.6l5.845,4.592L19.3,1.523l-1.427.1a.733.733,0,0,1-.8-.642.713.713,0,0,1,.692-.742L21.2,0a.786.786,0,0,1,.587.2A.668.668,0,0,1,22,.752l-.282,3.157a.729.729,0,0,1-.745.636l-.063,0a.713.713,0,0,1-.684-.75l.113-1.271-5.493,5.1a.793.793,0,0,1-1.013.04L7.985,3.072,1.277,9.293a.774.774,0,0,1-.528.2A.774.774,0,0,1,.22,9.293Z"
                  transform="translate(0 0)"
                  fill="#fff"
                />
              </svg>
            </div>
            <div className="card__info">
              <p className="card__info-price">
                <p className="token__heading">Token Balance</p>{" "}
                <p>
                  <span className="token__balance">
                    {tokenAccount?.amount.toNumber() || "0.00"}
                  </span>{" "}
                  <span className="token__name">ShereKhan</span>
                </p>
              </p>
            </div>
          </div>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
};
