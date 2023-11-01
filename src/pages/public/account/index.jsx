import { Flex, Form, Image, Input, Modal, Spin, message } from "antd";
import { Link, useNavigate } from "react-router-dom";

import {
  useGetUserInfoQuery,
  useUpdatePasswordMutation,
  useUpdateUserInfoMutation,
  useUploadAccountPhotoMutation,
} from "../../../redux/queries/auth";
import { useEffect, useState } from "react";
import { getUserImage } from "../../../utils/getImage";

import "./style.scss";
import "react-tabs/style/react-tabs.css";

import { TOKEN, USER } from "../../../constants";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { removeAuth } from "../../../redux/slices/auth";

import { Tab, Tabs, TabList, TabPanel } from "react-tabs";

const AccountPage = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const [photo, setPhoto] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const { data: user, refetch, isFetching } = useGetUserInfoQuery();

  const [updateUserInfo] = useUpdateUserInfoMutation();
  const [uploadAccountPhoto] = useUploadAccountPhotoMutation();
  const [updatePassword] = useUpdatePasswordMutation();

  useEffect(() => {
    form.setFieldsValue(user);
  }, [user, form]);

  const uploadImage = async (e) => {
    const formData = new FormData();
    formData.append("file", e.target.files[0]);
    const { data } = await uploadAccountPhoto(formData);
    setPhoto(data);
  };

  const updateUser = async (values) => {
    await updateUserInfo(values);
    message.success("Information saved successfully");
    refetch();
  };

  const logout = () => {
    Cookies.remove(TOKEN);
    localStorage.removeItem(USER);
    dispatch(removeAuth());
    navigate("/");
  };

  const changePassword = async (values) => {
    try {
      await updatePassword(values);
      setShowForm(false);
      message.success("Password changed successfully");
      navigate("/");
    } catch (err) {
      message.error(err);
    }
  };

  return (
    <Spin spinning={isFetching}>
      <section className="register">
        <div className="container">
          <Tabs className="tab">
            <TabList className="tab-account">
              <Tab className="tab-item tab1">Edit account info</Tab>
              <Tab className="tab-item tab2">Change password</Tab>
            </TabList>

            <TabPanel>
              <Form
                form={form}
                className="register-form"
                name="register"
                labelCol={{
                  span: 24,
                }}
                wrapperCol={{
                  span: 24,
                }}
                onFinish={updateUser}
                autoComplete="off"
              >
                <Form.Item>
                  <h2 className="register__title">Account Info</h2>
                </Form.Item>
                <div className="upload-image-container">
                  <Image
                    className="account-image"
                    style={{
                      width: "100%",
                    }}
                    src={
                      user?.photo
                        ? getUserImage(user.photo)
                        : "https://www.tenforums.com/geek/gars/images/2/types/thumb_15951118880user.png"
                    }
                  />
                  <input
                    className="upload-btn register-input"
                    type="file"
                    onChange={uploadImage}
                  />
                </div>
                <Form.Item
                  label="First name"
                  name="firstName"
                  rules={[
                    {
                      required: true,
                      message: "Please input your firstname!",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  label="Last name"
                  name="lastName"
                  rules={[
                    {
                      required: true,
                      message: "Please input your lastname!",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  label="Username"
                  name="username"
                  rules={[
                    {
                      required: true,
                      message: "Please input your username!",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>

                <Flex align="center" justify="space-between" gap={30}>
                  <Form.Item
                    label="Address"
                    name="address"
                    rules={[
                      {
                        required: true,
                        message: "Please input your address!",
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item label="Date of birth" name="birthday">
                    <input
                      className="date-picker register-date-picker"
                      type="date"
                    />
                  </Form.Item>
                </Flex>

                <Flex align="center" justify="space-between" gap={30}>
                  <Form.Item
                    label="Phone number"
                    name="phoneNumber"
                    rules={[
                      {
                        required: true,
                        message: "Please input your address!",
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                      {
                        required: true,
                        message: "Please input your email address!",
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Flex>

                <Flex>
                  <Flex align="center" justify="space-between" gap={10}>
                    <Form.Item label="Github" name="github">
                      <Input />
                    </Form.Item>

                    <Form.Item label="Instagram" name="instagram">
                      <Input />
                    </Form.Item>

                    <Form.Item label="Telegram" name="telegram">
                      <Input />
                    </Form.Item>
                  </Flex>
                </Flex>

                <Form.Item label="Describe yourself" name="info">
                  <Input.TextArea />
                </Form.Item>

                <Form.Item
                  className="btn-container"
                  wrapperCol={{
                    offset: 0,
                    span: 24,
                  }}
                >
                  <button className="submit-btn" type="submit">
                    Update Info
                  </button>
                </Form.Item>
                <div>
                  <div className="register__subinfo">
                    <p>Do you want to change log out ? </p>
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
                  </div>

                  <div className="register__subinfo">
                    <p>Do you want to change your password ? </p>
                    <Link onClick={() => setShowForm(!showForm)}>Reset</Link>
                  </div>
                </div>
              </Form>
            </TabPanel>
            <TabPanel>
              <Form
                name="password"
                className="reset-password"
                style={{
                  paddingTop: "30px",
                }}
                labelCol={{
                  span: 24,
                }}
                wrapperCol={{
                  span: 24,
                }}
                onFinish={changePassword}
                autoComplete="off"
              >
                <Form.Item
                  label="Username"
                  name="username"
                  rules={[
                    {
                      required: true,
                      message: "Please input your username",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  label="Current password"
                  name="currentPassword"
                  rules={[
                    {
                      required: true,
                      message: "Please input your current password",
                    },
                  ]}
                >
                  <Input.Password />
                </Form.Item>

                <Form.Item
                  label="New password"
                  name="newPassword"
                  rules={[
                    {
                      required: true,
                      message: "Please input your new password",
                    },
                  ]}
                >
                  <Input.Password />
                </Form.Item>

                <Form.Item
                  className="btn-container"
                  wrapperCol={{
                    offset: 0,
                    span: 24,
                  }}
                >
                  <button
                    className="submit-btn"
                    style={{
                      width: "100%",
                    }}
                    type="submit"
                  >
                    Update Info
                  </button>
                </Form.Item>
              </Form>
            </TabPanel>
          </Tabs>
        </div>
      </section>
    </Spin>
  );
};

export default AccountPage;
