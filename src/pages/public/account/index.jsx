import { Flex, Form, Image, Input, Modal, Spin, message } from "antd";
import { request } from "../../../server";
import { Link, useNavigate } from "react-router-dom";

import {
  useGetUserInfoQuery,
  useUpdateUserInfoMutation,
  useUploadAccountPhotoMutation,
} from "../../../redux/queries/auth";
import { useEffect, useState } from "react";
import { getUserImage } from "../../../utils/getImage";

import "./style.scss";
import { TOKEN, USER } from "../../../constants";
import Cookies from "js-cookie";

const AccountPage = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const [photo, setPhoto] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const { data: user, refetch, isFetching } = useGetUserInfoQuery();

  const [updateUserInfo] = useUpdateUserInfoMutation();
  const [uploadAccountPhoto] = useUploadAccountPhotoMutation();

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
    refetch();
    navigate("/");
  };

  const changePassword = async (e) => {
    e.preventDefault();
    const newPassword = {
      username: e.target.username.value,
      currentPassword: e.target.currentPassword.value,
      newPassword: e.target.newPassword.value,
    };

    try {
      await request.put("/auth/updatepassword", newPassword);
      setShowForm(false);
      message.success("Password changed successfully");
    } catch (err) {
      message.error(err);
    }
    console.log(newPassword);
  };

  return (
    <Spin spinning={isFetching}>
      <section className="register">
        <div className="container">
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
          {showForm ? (
            <form
              name="password"
              className="reset-password"
              style={{
                paddingTop: "30px",
              }}
              onSubmit={changePassword}
              autoComplete="off"
            >
              <div className="password-input">
                <label htmlFor="username">Username</label>
                <input name="username" id="username" required type="text" />
              </div>

              <div className="password-input">
                <label htmlFor="currentPassword">Current password</label>
                <input
                  name="currentPassword"
                  id="currentPassword"
                  required
                  type="password"
                />
              </div>
              <div className="password-input">
                <label htmlFor="newPassword">New password</label>
                <input
                  name="newPassword"
                  id="newPassword"
                  required
                  type="password"
                />
              </div>

              <button className="submit-btn" type="submit">
                Change password
              </button>
            </form>
          ) : null}
        </div>
      </section>
    </Spin>
  );
};

export default AccountPage;
