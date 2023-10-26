import { Fragment, memo, useState } from "react";
import {
  Button,
  Flex,
  Form,
  Input,
  Modal,
  Pagination,
  Space,
  Table,
} from "antd";
import { UserOutlined } from "@ant-design/icons/lib/icons";

import {
  useCreateUserMutation,
  useDeleteUserMutation,
  useGetUserMutation,
  useGetUsersQuery,
  useUpdateUserMutation,
  // useUploadPhotoMutation,
} from "../../../redux/queries/users";

import { LIMIT } from "../../../constants";
import { longDate } from "../../../utils/dateConvert";

import "./style.scss";

const UsersPage = () => {
  const [form] = Form.useForm();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  // const [photo, setPhoto] = useState(null);
  const [isModalLoading, setIsModalLoading] = useState(false);

  const {
    data: { users, total } = { users: [], total: 0 },
    isFetching,
    refetch,
  } = useGetUsersQuery({ page, search, limit: LIMIT });

  // const [uploadPhoto] = useUploadPhotoMutation();
  const [createUser] = useCreateUserMutation();
  const [getUser] = useGetUserMutation();
  const [updateUser] = useUpdateUserMutation();
  const [deleteUser] = useDeleteUserMutation();

  const showModal = async () => {
    form.resetFields();
    setIsModalOpen(true);
    // setPhoto(null);
    setSelected(null);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleOk = async () => {
    try {
      setIsModalLoading(true);
      const values = await form.validateFields();
      // values.photo = photo?._id;
      if (selected === null) {
        await createUser(values);
      } else {
        await updateUser({ id: selected, body: values });
      }
      refetch();
      setIsModalOpen(false);
      form.resetFields();
    } finally {
      setIsModalLoading(false);
    }
  };

  const handleEdit = async (id) => {
    setSelected(id);
    setIsModalOpen(true);
    const { data } = await getUser(id);
    // setPhoto(data?.photo);
    form.setFieldsValue(data);
  };

  const handleDelete = async (id) => {
    await deleteUser(id);
    refetch();
    setPage(1);
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  // const uploadImage = async (e) => {
  //   const formData = new FormData();
  //   formData.append("file", e.target.files[0]);
  //   const { data } = await uploadPhoto(formData);
  //   setPhoto(data);
  // };

  const columns = [
    {
      title: "Photo",
      dataIndex: "photo",
      key: "photo",
      render: () => <UserOutlined />,
    },
    {
      title: "First name",
      dataIndex: "firstName",
      key: "firstName",
    },
    {
      title: "Last name",
      dataIndex: "lastName",
      key: "lastName",
    },
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Date of birth",
      dataIndex: "birthday",
      key: "birthday",
      render: (data) => (
        <p style={{ marginBottom: "0px" }}>{data ? longDate(data) : "N/A"}</p>
      ),
    },
    {
      title: "Account created",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (data) => (
        <p style={{ marginBottom: "0px" }}>{data ? longDate(data) : "N/A"}</p>
      ),
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (data) => (
        <p
          className={`tag ${data === "client" ? "client" : ""} ${
            data === "admin" ? "admin" : ""
          } ${data === "client" ? "client" : ""} `}
        >
          {data}
        </p>
      ),
    },
    {
      title: "Action",
      dataIndex: "_id",
      key: "_id",
      render: (id) => (
        <Space size="middle">
          <Button type="primary" onClick={() => handleEdit(id)}>
            Edit
          </Button>
          <Button
            type="primary"
            danger
            onClick={() =>
              Modal.confirm({
                title: "Do you want to delete this user ?",
                onOk: () => handleDelete(id),
              })
            }
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];
  return (
    <Fragment>
      <Table
        className="skills-table"
        scroll={{
          x: 1000,
        }}
        pagination={false}
        loading={isFetching}
        dataSource={users}
        columns={columns}
        bordered={true}
        title={() => (
          <Fragment>
            <Flex align="center" justify="space-between" gap={36}>
              <h1 className="skills-title">Users</h1>
              <Input
                className="search-input"
                value={search}
                onChange={handleSearch}
                style={{ width: "auto", flexGrow: 1 }}
                placeholder="Searching..."
              />
              <Button onClick={showModal} type="dashed">
                Add user
              </Button>
            </Flex>
            <div>
              <p className="search-result-text">
                About <span>{total}</span> results match
              </p>
            </div>
          </Fragment>
        )}
      />
      {total > LIMIT ? (
        <Pagination
          className="pagination"
          total={total}
          pageSize={LIMIT}
          current={page}
          onChange={(page) => setPage(page)}
        />
      ) : null}
      <Modal
        title="User info"
        maskClosable={false}
        confirmLoading={isModalLoading}
        okText={selected === null ? "Add user" : "Save user"}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={closeModal}
      >
        <Form
          name="portfolio"
          autoComplete="off"
          initialValues={{
            phoneNumber: "+998 ",
          }}
          labelCol={{
            span: 24,
          }}
          wrapperCol={{
            span: 24,
          }}
          form={form}
        >
          <Form.Item
            label="First name"
            name="firstName"
            rules={[
              {
                required: true,
                message: "Please include firstname!",
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
                message: "Please include your lastname",
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
                message: "Please include your username",
              },
            ]}
          >
            <Input />
          </Form.Item>

          {selected === null ? <Form.Item
            label="Password"
            name="password"
            rules={[
              {
                required: true,
                message: "Please include your password",
              },
            ]}
          >
            <Input.Password />
          </Form.Item> : null}

          <Form.Item label="Address" name="address">
            <Input />
          </Form.Item>

          <Flex align="center" justify="space-between" gap={36}>
            <Form.Item
              label="Phone number"
              name="phoneNumber"
              rules={[
                {
                  required: true,
                  message: "Please include contact number",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item label="Date of birth" name="birthday">
              <input className="date-picker" type="date" />
            </Form.Item>
          </Flex>

          {/* <div>
            <label htmlFor="image">Upload an image</label>
            <input
              style={{ marginTop: "10px" }}
              className="upload-btn"
              id="image"
              type="file"
              onChange={uploadImage}
            />
            {photo ? <Image src={getImage(photo)} /> : null}
          </div> */}
        </Form>
      </Modal>
    </Fragment>
  );
};

const MemoUsersPage = memo(UsersPage);

export default MemoUsersPage;
