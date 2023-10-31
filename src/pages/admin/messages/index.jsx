import { Fragment, memo, useEffect, useState } from "react";
import {
  Button,
  Flex,
  Form,
  Input,
  Modal,
  Pagination,
  Select,
  Space,
  Table,
} from "antd";

import {
  useCreateMessageMutation,
  useDeleteMessageMutation,
  useGetMessageMutation,
  useGetMessagesQuery,
  useUpdateMessageMutation,
} from "../../../redux/queries/messages";

import { LIMIT } from "../../../constants";

import "./style.scss";

const MessagesPage = () => {
  const [form] = Form.useForm();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [isModalLoading, setIsModalLoading] = useState(false);
  const [status, setStatus] = useState("answer");

  const {
    data: { messages, total } = { messages: [], total: 0 },
    isFetching,
    refetch,
  } = useGetMessagesQuery({ page, search, limit: LIMIT });

  const [createMessage] = useCreateMessageMutation();
  const [getMessage] = useGetMessageMutation();
  const [updateMessage] = useUpdateMessageMutation();
  const [deleteMessage] = useDeleteMessageMutation();


  const showModal = () => {
    setSelected(null);

    form.resetFields();
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleOk = async () => {
    try {
      setIsModalLoading(true);
      const values = await form.validateFields();
      if (selected === null) {
        await createMessage(values);
      } else {
        await updateMessage({ id: selected, body: values });
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
    const { data } = await getMessage(id);
    form.setFieldsValue(data);
  };

  const handleDelete = async (id) => {
    await deleteMessage(id);
    refetch();
    setPage(1);
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const sortMessages = (value) => {
    setStatus(value)
  }

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Message",
      dataIndex: "message",
      key: "message",
      render: (data) => (<p  style={{
        marginBottom: "0px"
      }} title="click answer to read more">{data.slice(0, 50)}</p>)
    },
    {
      title: "Sent by",
      dataIndex: "user",
    },
    {
      title: "Answer",
      dataIndex: "answer",
      render: (data) => {
        return (
          <p title="click answer to read more" className={data ? `answer` : `not-answered`}>
            {data ? `${data.slice(0, 50)}` : "No answer"}
          </p>
        );
      },
    },
    {
      title: "Action",
      dataIndex: "_id",
      key: "_id",
      render: (id) => (
        <Space size="middle">
          <Button type="primary" onClick={() => handleEdit(id)}>
            Answer
          </Button>
          <Button
            type="primary"
            danger
            onClick={() =>
              Modal.confirm({
                title: "Do you want to delete this message ?",
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
        dataSource={messages}
        columns={columns}
        bordered={true}
        title={() => (
          <Fragment>
            <Flex
              className="table-title"
              align="center"
              justify="space-between"
            >
              <h1 className="skills-title">Messages</h1>
              <Input
                className="search-input"
                value={search}
                onChange={handleSearch}
                style={{
                  width: "auto",
                  flexGrow: 1,
                  marginRight: "30px",
                  marginLeft: "30px",
                }}
                placeholder="Searching..."
              />
              <Select
                defaultValue="Sort"
                onChange={sortMessages}
                style={{ width: 120, marginRight: "20px" }}
                options={[
                  {
                    value: "answer[gt]",
                    label: "answered",
                  },
                  { value: "answer", label: "not-answered" },
                ]}
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
        title="Message details"
        maskClosable={false}
        confirmLoading={isModalLoading}
        okText={selected === null ? "Send message" : "Send answer"}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={closeModal}
      >
        <Form
          name="message"
          autoComplete="off"
          labelCol={{
            span: 24,
          }}
          wrapperCol={{
            span: 24,
          }}
          form={form}
        >
          <Form.Item
            label="Title"
            name="title"
            rules={[
              {
                required: { selected },
                message: "Please type message title!",
              },
            ]}
          >
            <Input title="This is ready-only mode" disabled={selected} />
          </Form.Item>

          <Form.Item
            label="Message"
            name="message"
            rules={[
              {
                required: true,
                message: "Please enter your message !",
              },
            ]}
          >
            <Input.TextArea
              title="This is ready-only mode"
              disabled={selected}
              showCount
              maxLength={100}
            />
          </Form.Item>

          {selected ? null : (
            <Fragment>
              <Form.Item
                label="The receiver id"
                name="whom"
                rules={[
                  {
                    required: true,
                    message: "Please enter receiver id !",
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Your email or phone number"
                name="user"
                rules={[
                  {
                    required: true,
                    message: "Please enter receiver id !",
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Fragment>
          )}

          {selected ? (
            <Form.Item
              label="Answer"
              name="answer"
              rules={[
                {
                  required: true,
                  message: "Please enter your response",
                },
              ]}
            >
              <Input />
            </Form.Item>
          ) : null}
        </Form>
      </Modal>
    </Fragment>
  );
};

const MemoMessagesPage = memo(MessagesPage);

export default MemoMessagesPage;
