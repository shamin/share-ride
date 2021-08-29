import { SideBar } from "./components/sidebar";
import './dashboard.scss';

export const Dashboard: React.FC = ({ children }) => <div>
    <SideBar />
    <div className="main">{children}</div>
</div>