import { useEffect, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";

import {
  ClockCircleOutlined,
  DatabaseOutlined,
  LockOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  ReadOutlined,
  TeamOutlined,
  UserOutlined,
  WhatsAppOutlined,
  RightOutlined,
  LeftOutlined,
} from "@ant-design/icons";
import {
  Layout,
  Menu,
  Button,
  theme,
  Modal,
  Badge,
  Input,
  Spin,
  message,
} from "antd";
import useScreenSize from "../../../utils/screenSize";

import Cookies from "js-cookie";
import { LIMIT, TOKEN, USER } from "../../../constants";
import { setAuth } from "../../../redux/slices/auth";

import "./style.scss";
import {
  useGetUserMutation,
  useGetUsersQuery,
  useUpgradeUserMutation,
} from "../../../redux/queries/users";

const AdminLayout = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const screenSize = useScreenSize();
  const [collapsed, setCollapsed] = useState(false);
  const [notification, setNotification] = useState(false);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const {
    data: { users, total } = { users: [], total: 0 },
    isFetching,
    refetch,
  } = useGetUsersQuery({ role: "user", page, search, limit: LIMIT });

  const [upgradeUser] = useUpgradeUserMutation();
  const [getUser] = useGetUserMutation();

  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const { Header, Sider, Content } = Layout;
  const lastPage = Math.ceil(total / LIMIT);


  const logout = () => {
    Cookies.remove(TOKEN);
    localStorage.removeItem(USER);
    setAuth();
    navigate("/");
  };

  useEffect(() => {
    if (screenSize <= 650) {
      setCollapsed(true);
    } else {
      setCollapsed(false);
    }
  }, [screenSize]);

  const controlNotification = () => {
    setNotification(!notification);
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };


  const upgradeToClient = async (id) => {
    const values = await getUser(id);
    values.role = "client";
    await upgradeUser({ id, values });
    refetch();
    message.success("User upgraded to client");
  };
  return (
    <Layout>
      <Sider
        className="dashboard-sider"
        trigger={null}
        collapsible
        collapsed={collapsed}
      >
        <h3 className="dashboard-logo">
          {collapsed ? "PTP" : "PTP Solutions"}
        </h3>
        <Menu
          className="menu"
          theme="dark"
          mode="inline"
          defaultSelectedKeys={pathname}
          items={[
            {
              key: "/dashboard",
              icon: <UserOutlined />,
              label: <Link to="/dashboard">Dashboard</Link>,
            },
            {
              key: "/users",
              icon: <TeamOutlined />,
              label: <Link to="/users">Users</Link>,
            },
            {
              key: "/portfolios",
              icon: <DatabaseOutlined />,
              label: <Link to="/portfolios">Portfolios</Link>,
            },
            {
              key: "/education",
              icon: <ReadOutlined />,
              label: <Link to="/education">Education</Link>,
            },
            {
              key: "/experience",
              icon: <ClockCircleOutlined />,
              label: <Link to="/experience">Experience</Link>,
            },
            {
              key: "/skills",
              icon: <LockOutlined />,
              label: <Link to="/skills">Skills</Link>,
            },
            {
              key: "/messages",
              icon: <WhatsAppOutlined />,
              label: <Link to="/messages">Messages</Link>,
            },
            {
              key: "4",
              icon: <LogoutOutlined />,
              label: (
                <Link
                  onClick={() =>
                    Modal.confirm({
                      title: "Do you want to log out ?",
                      onOk: () => logout(),
                    })
                  }
                >
                  Logout
                </Link>
              ),
            },
          ]}
        />
      </Sider>
      <Layout>
        <Header
          className="dashboard-header"
          style={{
            padding: 0,
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: "16px",
              width: 64,
              height: 64,
            }}
          />
          <Link onClick={controlNotification} className="notification">
            <Badge className="dashboard-badge" count={total} size="small">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
                <path d="M160-200v-80h80v-280q0-83 50-147.5T420-792v-28q0-25 17.5-42.5T480-880q25 0 42.5 17.5T540-820v28q80 20 130 84.5T720-560v280h80v80H160Zm320-300Zm0 420q-33 0-56.5-23.5T400-160h160q0 33-23.5 56.5T480-80ZM320-280h320v-280q0-66-47-113t-113-47q-66 0-113 47t-47 113v280Z" />
              </svg>
            </Badge>
          </Link>
        </Header>
        <Content
          className="dashboard-main"
          style={{
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
          }}
        >
          <Outlet />
        </Content>
      </Layout>
      <div
        className={`notification-content ${
          notification ? "notification-open" : "notification-close"
        }`}
      >
        <h3 className="notification-content-title">Upgrade users ({total})</h3>
        <Input
          size="small"
          value={search}
          onChange={handleSearch}
          style={{
            width: "100%",
            marginBottom: "20px",
          }}
          placeholder="Searching..."
        />
        <Spin
          style={{
            background: "#fff",
            backdropFilter: "0.8",
          }}
          tip="Loading"
          spinning={isFetching}
        >
          {users.map((user) => (
            <div key={user?._id} className="notification-content-user">
              <p>{user?.firstName.slice(0, 25)}</p>
              <button
                onClick={() =>
                  Modal.confirm({
                    title: "Do you want to upgrade this user ?",
                    onOk: () => upgradeToClient(user?._id),
                  })
                }
                // onClick={() => upgradeToClient(user?._id)}
                className="upgrade-btn"
                size="small"
              >
                Upgrade
              </button>
            </div>
          ))}
        </Spin>
        <div className="notification-content-footer">
          <div className="notification-content-pagination">
            <button
              className={page === 1 ? `disabled` : null}
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              <LeftOutlined />
              Prev
            </button>
            <button
              disabled={page === lastPage}
              className={page === lastPage ? `disabled` : null}
              onClick={() => setPage(page + 1)}
            >
              Next <RightOutlined />
            </button>
          </div>
          <button onClick={controlNotification} className="close-btn">
            Close
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default AdminLayout;
