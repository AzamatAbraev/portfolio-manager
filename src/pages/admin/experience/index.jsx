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

import { LIMIT } from "../../../constants";

import {
  useCreateExperienceMutation,
  useDeleteExperienceMutation,
  useGetExperienceMutation,
  useGetExperiencesQuery,
  useUpdateExperienceMutation,
} from "../../../redux/queries/experience";
import { longDate } from "../../../utils/dateConvert";

import "./style.scss";

const ExperiencePage = () => {
  const [form] = Form.useForm();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [isModalLoading, setIsModalLoading] = useState(false);

  const {
    data: { experiences, total } = { experiences: [], total: 0 },
    isFetching,
    refetch,
  } = useGetExperiencesQuery({ page, search, limit: LIMIT });

  const [createExperience] = useCreateExperienceMutation();
  const [updateExperience] = useUpdateExperienceMutation();
  const [getExperience] = useGetExperienceMutation();
  const [deleteExperience] = useDeleteExperienceMutation();

  const showModal = () => {
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
        await createExperience(values);
      } else {
        await updateExperience({ id: selected, body: values });
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
    const { data } = await getExperience(id);
    form.setFieldsValue(data);
  };

  const handleDelete = async (id) => {
    await deleteExperience(id);
    refetch();
    // setPage(1);
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const columns = [
    {
      title: "Full name",
      render: (_, row) =>
        `${row?.user?.firstName ?? "Anonymous"} ${row?.user?.lastName ?? ""}`,
    },
    {
      title: "Position",
      dataIndex: "workName",
      key: "workName",
    },
    {
      title: "Company",
      dataIndex: "companyName",
      key: "workName",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (data) => (
        <p style={{ marginBottom: "0px" }}>{data.slice(0, 40)}...</p>
      ),
    },
    {
      title: "Started",
      dataIndex: "startDate",
      key: "startDate",
      render: (date) => <p>{longDate(date)}</p>,
    },
    {
      title: "Finished",
      dataIndex: "endDate",
      key: "endDate",
      render: (date) => <p>{longDate(date)}</p>,
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
                title: "Do you want to delete this experience?",
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
        dataSource={experiences}
        columns={columns}
        bordered={true}
        title={() => (
          <Fragment>
            <Flex className="table-title2" align="center" justify="space-between" gap={36}>
              <h1 className="skills-title">Experience</h1>
              <Input
                className="search-input"
                value={search}
                onChange={handleSearch}
                style={{ width: "auto", flexGrow: 1 }}
                placeholder="Searching..."
              />
              <Button onClick={showModal} type="dashed">
                Add experience
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
        title="Experience info"
        maskClosable={false}
        confirmLoading={isModalLoading}
        okText={selected === null ? "Add experience" : "Save experience"}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={closeModal}
      >
        <Form
          name="experience"
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
            label="Position"
            name="workName"
            rules={[
              {
                required: true,
                message: "Please include your role or position!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Company"
            name="companyName"
            rules={[
              {
                required: true,
                message: "Please include company you work for!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Description"
            name="description"
            rules={[
              {
                required: true,
                message:
                  "Please enter a brief description about your experience !",
              },
            ]}
          >
            <Input.TextArea showCount maxLength={100} />
          </Form.Item>

          <Flex align="center" justify="space-between">
            <Form.Item
              label="Start date"
              name="startDate"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <input className="date-picker" type="date" />
            </Form.Item>

            <Form.Item
              label="End date"
              name="endDate"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <input className="date-picker" type="date" />
            </Form.Item>
          </Flex>
        </Form>
      </Modal>
    </Fragment>
  );
};

const MemoExperiencePage = memo(ExperiencePage);

export default MemoExperiencePage;
