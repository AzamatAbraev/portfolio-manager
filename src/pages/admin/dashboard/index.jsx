import { useGetExperiencesQuery } from "../../../redux/queries/experience";
import { useGetMessagesQuery } from "../../../redux/queries/messages";
import { useGetPortfoliosQuery } from "../../../redux/queries/portfolio";
import { useGetUsersQuery } from "../../../redux/queries/users";
import "./style.scss";

const DashboardPage = () => {
  const {data: messages} = useGetMessagesQuery();
  const { data: users } = useGetUsersQuery();
  const { data: portfolios } = useGetPortfoliosQuery();
  const { data: experience } = useGetExperiencesQuery();
  return (
    <section>
      <div className="container">
        <div className="main-stats">
          <h2 className="dashboard-title">Welcome abord, admin</h2>
          <p className="dashboard-desc">
            Stay updated with the latest statistics
          </p>
        </div>
        <div className="stats-row">
          <div className="stats-card">
            <h3>Active users</h3>
            <p>+{users?.total}</p>
          </div>
          <div className="stats-card">
            <h3>Experienced users</h3>
            <p>+{experience?.total}</p>
          </div>
          <div className="stats-card">
            <h3>Messages</h3>
            <p>+{messages?.total}</p>
          </div>
          <div className="stats-card">
            <h3>Portfolios</h3>
            <p>+{portfolios?.total}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DashboardPage;
